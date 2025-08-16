import { useState, useCallback } from "react";
import { useGetCompletedTasks } from "../../taskManagerApi/useGetCompletedTasks";
import { useReopenTask } from "../../taskManagerApi/useReopenTask";
import { type Task } from "../../types/Task";

const CompletedTasks = () => {
  const { completedTasks, loading, error, refetch } = useGetCompletedTasks();
  const { reopenTask, loading: reopenLoading } = useReopenTask();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleReopenTask = useCallback(async (taskId: string) => {
    try {
      const result = await reopenTask(taskId);
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error('Error reopening task:', error);
    }
  }, [reopenTask, refetch]);

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
        <p>Error loading completed tasks: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Completed Tasks</h2>
      </div>

      {completedTasks.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No completed tasks available
        </div>
      ) : (
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <ul className="divide-y divide-gray-200">
            {completedTasks.map((task) => (
              <li key={task.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    {task.completed_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Completed on: {new Date(task.completed_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleReopenTask(task.id)}
                      disabled={reopenLoading}
                      className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Reopen
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
