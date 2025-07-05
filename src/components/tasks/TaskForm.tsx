import { useState, FormEvent, useEffect } from "react";
import { type Task } from "../../types/Task";

interface TaskFormProps {
  onSubmit: (taskData: {
    title: string;
    description: string;
    type: string;
    due_date?: string;
    priority: number;
    status: string;
    effort: number;
    percent_completed: number;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData?: Task;
  mode: 'create' | 'edit';
}

const TaskForm = ({ onSubmit, onCancel, isSubmitting, initialData, mode = 'create' }: TaskFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [type, setType] = useState(initialData?.type || "task");
  const [dueDate, setDueDate] = useState(initialData?.due_date ? initialData.due_date.split('T')[0] : "");
  const [priority, setPriority] = useState(initialData?.priority || 2); // Medium priority by default
  const [status, setStatus] = useState(initialData?.status || "pending");
  const [effort, setEffort] = useState(initialData?.effort || 1);
  const [percentCompleted, setPercentCompleted] = useState(initialData ? Math.round(initialData.percent_completed * 100) : 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setType(initialData.type);
      setDueDate(initialData.due_date ? initialData.due_date.split('T')[0] : "");
      setPriority(initialData.priority);
      setStatus(initialData.status);
      setEffort(initialData.effort);
      setPercentCompleted(Math.round(initialData.percent_completed * 100));
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert local date to UTC timestamp if due date is provided
    let utcDueDate: string | undefined;
    if (dueDate) {
      // Create a date object at midnight local time
      const dateObj = new Date(dueDate + 'T00:00:00');
      // Convert to ISO string which includes the UTC timestamp
      utcDueDate = dateObj.toISOString();
    }

    const taskData = {
      title,
      description,
      type,
      ...(utcDueDate ? { due_date: utcDueDate } : {}),
      priority,
      status,
      effort,
      percent_completed: percentCompleted / 100,
    };

    await onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.title ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-[#8B0000]`}
          placeholder="Task title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.description ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-[#8B0000]`}
          placeholder="Task description"
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
          >
            <option value="task">Task</option>
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
          >
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Urgent</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="effort" className="block text-sm font-medium text-gray-700 mb-1">
            Effort (1-10)
          </label>
          <input
            type="number"
            id="effort"
            min="1"
            max="10"
            value={effort}
            onChange={(e) => setEffort(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
          />
        </div>

        <div>
          <label htmlFor="percentCompleted" className="block text-sm font-medium text-gray-700 mb-1">
            Completion (%)
          </label>
          <input
            type="number"
            id="percentCompleted"
            min="0"
            max="100"
            value={percentCompleted}
            onChange={(e) => setPercentCompleted(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000]"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#8B0000] hover:bg-[#a30000] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (mode === 'edit' ? "Updating..." : "Creating...") 
            : (mode === 'edit' ? "Update Task" : "Create Task")
          }
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
