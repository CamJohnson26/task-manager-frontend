import { useState, useEffect } from "react";
import { type Task } from "../../types/Task";
import TaskForm from "./TaskForm";
import { useUpdateTask } from "../../taskManagerApi/useUpdateTask";

interface TaskListItemProps {
  task: Task;
  onTaskSelect: (task: Task) => void;
  isSelected: boolean;
  onTaskUpdated: () => void;
}

const TaskListItem = ({ task, onTaskSelect, isSelected, onTaskUpdated }: TaskListItemProps) => {
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
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Priority: {getPriorityLabel(task.priority)}</span>
          <span>{Math.round(task.percent_completed * 100)}% complete</span>
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
