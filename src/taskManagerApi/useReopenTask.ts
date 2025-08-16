import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { type Task } from "../types/Task";
import { useUpdateTask } from "./useUpdateTask";
import { useGetCompletedTasks } from "./useGetCompletedTasks";

export const useReopenTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { updateTask } = useUpdateTask();
  const { completedTasks } = useGetCompletedTasks();

  const reopenTask = async (taskId: string): Promise<Task | null> => {
    setLoading(true);
    setError(null);

    try {
      // Find the task in the completed tasks list
      const taskToReopen = completedTasks.find(task => task.id === taskId);

      if (!taskToReopen) {
        throw new Error('Task not found');
      }

      // Prepare the task data with all required fields
      const taskData = {
        title: taskToReopen.title,
        description: taskToReopen.description,
        type: taskToReopen.type,
        due_date: taskToReopen.due_date,
        priority: taskToReopen.priority,
        status: 'pending', // Change status to pending
        effort: taskToReopen.effort,
        percent_completed: taskToReopen.percent_completed,
        completed_at: null // Set completed_at to null
      };

      // Use the updateTask function to update the task with all fields
      const result = await updateTask(taskId, taskData);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Unknown error'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    reopenTask,
    loading,
    error
  };
};
