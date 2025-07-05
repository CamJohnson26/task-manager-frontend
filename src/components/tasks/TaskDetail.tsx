import { type Task } from "../../types/Task";

interface TaskDetailProps {
  task: Task | null;
  onClose: () => void;
  isOpen: boolean;
}

const TaskDetail = ({ task, onClose, isOpen }: TaskDetailProps) => {
  if (!task) return null;

  return (
    <div 
      className={`bg-white border-l border-gray-200 h-full transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center">
            {/* Back button - only visible on mobile */}
            <button 
              onClick={onClose}
              className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Task Details</h2>
          </div>
          {/* Close button - only visible on desktop */}
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none hidden md:block"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow h-[calc(100vh-260px)]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className="text-sm text-gray-500">
                Priority: {getPriorityLabel(task.priority)}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">DESCRIPTION</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
                <p className="text-gray-700">{task.type || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                <p className="text-gray-700">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Effort</h3>
                <p className="text-gray-700">{task.effort || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Completion</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-[#8B0000] h-2.5 rounded-full" 
                    style={{ width: `${Math.round(task.percent_completed * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round(task.percent_completed * 100)}%</p>
              </div>
            </div>

            {task.last_completed && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Completed</h3>
                <p className="text-gray-700">{new Date(task.last_completed).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for formatting (same as in TaskList)
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

export default TaskDetail;
