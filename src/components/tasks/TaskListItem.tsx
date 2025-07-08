import { useState, useEffect } from "react";
import { type Task } from "../../types/Task";
import TaskForm from "./TaskForm";
import { useUpdateTask } from "../../taskManagerApi/useUpdateTask";

interface TaskListItemProps {
  task: Task;
  onTaskSelect: (task: Task) => void;
  isSelected: boolean;
  onTaskUpdated: () => void;
  onDeleteTask: (task: Task) => void;
}

const TaskListItem = ({ task, onTaskSelect, isSelected, onTaskUpdated, onDeleteTask }: TaskListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask, loading: updateLoading } = useUpdateTask();

  // Automatically set edit mode when task is selected
  useEffect(() => {
    if (isSelected) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [isSelected]);

  const handleTaskClick = () => {
    if (isEditing) return; // Don't trigger selection if we're editing
    onTaskSelect(task);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

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
    try {
      const result = await updateTask(task.id, taskData);
      if (result) {
        onTaskUpdated();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Helper functions for formatting
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: number): string => {
    switch (priority) {
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      case 4:
        return 'Urgent';
      default:
        return 'Normal';
    }
  };

  return (
    <li 
      className={`border-b border-gray-200 transition-all duration-300 ${
        isSelected ? 'bg-gray-100 border-l-4 border-l-[#8B0000]' : 'hover:bg-gray-50'
      }`}
    >
      {/* Task summary - always visible */}
      <div 
        className="p-4 cursor-pointer"
        onClick={handleTaskClick}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            {!isEditing && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            {task.due_date && (
              <span className="text-xs text-gray-500 mt-1">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <span>Priority: {getPriorityLabel(task.priority)}</span>
          <div className="flex items-center space-x-3">
            <span>{Math.round(task.percent_completed * 100)}% complete</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent task selection
                onDeleteTask(task);
              }}
              className="text-red-600 hover:text-red-800 focus:outline-none"
              aria-label="Delete task"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Edit form - visible when editing */}
      {isSelected && isEditing && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            isSubmitting={updateLoading}
            initialData={task}
            mode="edit"
          />
        </div>
      )}
    </li>
  );
};

export default TaskListItem;
