import { useRef, useEffect } from "react";
import { useDeleteTask } from "../../taskManagerApi/useDeleteTask";
import { type Task } from "../../types/Task";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskDeleted: () => void;
  task: Task;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onTaskDeleted, task }: DeleteConfirmationModalProps) => {
  const { deleteTask, loading, error } = useDeleteTask();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleConfirmDelete = async () => {
    const success = await deleteTask(task.id);
    if (success) {
      onTaskDeleted();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-xl transform translate-y-0"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Task</h2>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error.message}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000]"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
