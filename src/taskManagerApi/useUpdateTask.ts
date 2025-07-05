import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { type Task } from "../types/Task";

interface UpdateTaskInput {
  title: string;
  description: string;
  type: string;
  due_date?: string;
  priority: number;
  status: string;
  effort: number;
  percent_completed: number;
}

export const useUpdateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    getAccessTokenSilently,
    isAuthenticated,
  } = useAuth0();

  const updateTask = async (taskId: string, taskData: UpdateTaskInput): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_WORKER_API_AUDIENCE,
        }
      });

      const path = `/tasks/${taskId}`;

      if (import.meta.env.VITE_WORKER_API_URL) {
        const url = new URL(path, import.meta.env.VITE_WORKER_API_URL);
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
        }

        try {
          const updatedTask = await response.json();
          return updatedTask;
        } catch (jsonError) {
          if (import.meta.env.DEV) {
            console.error('JSON parse error:', jsonError);
          }
          throw new Error('Invalid response format');
        }
      }
      return null;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error updating task:', error);
      }
      setError(error instanceof Error ? error : new Error('Unknown error'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateTask,
    loading,
    error
  };
};