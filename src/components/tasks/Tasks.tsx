import { useState, useCallback } from "react";
import { useGetTasks } from "../../taskManagerApi/useGetTasks";
import TaskList from "./TaskList";
import NewTaskModal from "./NewTaskModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import TaskVisualization from "./TaskVisualization";
import { type Task } from "../../types/Task";

const Tasks = () => {
  const { tasks: allTasks, loading, error, refetch } = useGetTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'visualization'>('list');

  // Filter out completed tasks
  const tasks = allTasks.filter(task => task.status.toLowerCase() !== 'completed');

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleOpenNewTaskModal = () => {
    setIsNewTaskModalOpen(true);
  };

  const handleCloseNewTaskModal = () => {
    setIsNewTaskModalOpen(false);
  };

  const handleTaskCreated = useCallback(() => {
    // Refetch tasks after a new task is created
    refetch();
  }, [refetch]);


  const handleTaskUpdated = useCallback(() => {
    console.log('handleTaskUpdated called');
    // Refetch tasks after a task is updated
    refetch();
  }, [refetch]);

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleTaskDeleted = useCallback(() => {
    // Refetch tasks after a task is deleted
    refetch();
  }, [refetch]);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'visualization' : 'list');
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
        {/* Visualization - on top for mobile, left pane for desktop */}
        <div className="w-full md:w-1/2 md:border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Task Visualization</h2>
          </div>
          <div className="h-[300px] md:h-[calc(100vh-260px)] md:flex-grow">
            <TaskVisualization
              tasks={tasks}
              onTaskSelect={handleTaskSelect}
              selectedTaskId={selectedTask?.id || null}
            />
          </div>
        </div>

        {/* Task list - below visualization on mobile, right pane on desktop */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
          </div>

          <div className="h-[calc(100vh-260px)] md:overflow-y-auto">
            <TaskList 
              tasks={tasks} 
              onTaskSelect={handleTaskSelect} 
              selectedTaskId={selectedTask?.id || null}
              onTaskUpdated={handleTaskUpdated}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>
      </div>

      {/* Floating action button */}
      <button
        onClick={handleOpenNewTaskModal}
        className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-[#8B0000] hover:bg-[#a30000] text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] transition-all duration-300 z-10"
        aria-label="Create new task"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* New task modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={handleCloseNewTaskModal}
        onTaskCreated={handleTaskCreated}
      />


      {/* Delete confirmation modal */}
      {taskToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onTaskDeleted={handleTaskDeleted}
          task={taskToDelete}
        />
      )}
    </div>
  );
};

export default Tasks;
