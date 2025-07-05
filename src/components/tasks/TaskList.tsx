import { type Task } from "../../types/Task";

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  selectedTaskId: string | null;
}

const TaskList = ({ tasks, onTaskSelect, selectedTaskId }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No tasks available
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li 
            key={task.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedTaskId === task.id ? 'bg-gray-100 border-l-4 border-[#8B0000]' : ''
            }`}
            onClick={() => onTaskSelect(task)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
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
          </li>
        ))}
      </ul>
    </div>
  );
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

export default TaskList;