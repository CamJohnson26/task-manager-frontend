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
      {/* Overlay that appears behind the detail panel when it's open */}
      {detailOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-0 md:hidden"
          onClick={handleCloseDetail}
        ></div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
        </div>
        
        <TaskList 
          tasks={tasks} 
          onTaskSelect={handleTaskSelect} 
          selectedTaskId={selectedTask?.id || null} 
        />
      </div>
      
      <TaskDetail 
        task={selectedTask} 
        onClose={handleCloseDetail} 
        isOpen={detailOpen} 
      />
    </div>
  );
};

export default Tasks;