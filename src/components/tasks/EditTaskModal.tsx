import { useRef, useEffect } from "react";
import TaskForm from "./TaskForm";
import { useUpdateTask } from "../../taskManagerApi/useUpdateTask";
import { type Task } from "../../types/Task";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  task: Task;
}

const EditTaskModal = ({ isOpen, onClose, onTaskUpdated, task }: EditTaskModalProps) => {
  const { updateTask, loading, error } = useUpdateTask();
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

  const handleSubmit = async (taskData: {
    title: string;
    description: string;
    type: string;
    due_date?: string;
    priority: number;
    status: string;
    effort: number;
    percent_completed: number;
  }) => {
    console.log('EditTaskModal handleSubmit called with data:', taskData);
    try {
      const result = await updateTask(task.id, taskData);
      console.log('Update task result:', result);
      if (result) {
        onTaskUpdated();
        onClose();
      } else {
        console.error('Update task returned null or undefined');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform translate-y-0"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error.message}
            </div>
          )}

          <TaskForm 
            onSubmit={handleSubmit} 
            onCancel={onClose} 
            isSubmitting={loading}
            initialData={task}
            mode="edit"
          />
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
