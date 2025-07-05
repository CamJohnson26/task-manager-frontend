import { useState } from "react";
import { useGetTasks } from "../../taskManagerApi/useGetTasks";
import TaskList from "./TaskList";
import TaskDetail from "./TaskDetail";
import { type Task } from "../../types/Task";

const Tasks = () => {
  const { tasks, loading, error } = useGetTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B0000]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800">
        <p>Error loading tasks: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {/* Task list - always visible on desktop, hidden when detail is open on mobile */}
        <div className={`flex-shrink-0 flex-grow transition-all duration-300 ${detailOpen ? 'md:w-1/2 hidden md:block' : 'w-full'}`}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
          </div>

          <div className="h-[calc(100vh-260px)]">
            <TaskList 
              tasks={tasks} 
              onTaskSelect={handleTaskSelect} 
              selectedTaskId={selectedTask?.id || null} 
            />
          </div>
        </div>

        {/* Task detail - slides in from right on desktop, replaces list on mobile */}
        <div className={`flex-shrink-0 transition-all duration-300 overflow-hidden ${
          detailOpen 
            ? 'w-full md:w-1/2' 
            : 'w-0 md:w-0 opacity-0'
        }`}>
          <TaskDetail 
            task={selectedTask} 
            onClose={handleCloseDetail} 
            isOpen={detailOpen} 
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
