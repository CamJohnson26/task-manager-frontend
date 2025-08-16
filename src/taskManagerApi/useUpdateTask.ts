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
  completed_at?: string | null;
  interval?: number;
}

export const useUpdateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    getAccessTokenSilently,
    isAuthenticated,
  } = useAuth0();

  const updateTask = async (taskId: string, taskData: UpdateTaskInput): Promise<Task | null> => {
    console.log('updateTask called with taskId:', taskId, 'and data:', taskData);
    setLoading(true);
    setError(null);

    try {
      if (!isAuthenticated) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('Getting access token...');
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_WORKER_API_AUDIENCE,
        }
      });
      console.log('Got access token');

      const path = `/tasks/${taskId}`;
      console.log('API URL:', import.meta.env.VITE_WORKER_API_URL);

      if (import.meta.env.VITE_WORKER_API_URL) {
        const url = new URL(path, import.meta.env.VITE_WORKER_API_URL);
        console.log('Making PUT request to:', url.toString());

        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
        }

        try {
          const updatedTask = await response.json();
          console.log('Updated task:', updatedTask);
          return updatedTask;
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          throw new Error('Invalid response format');
        }
      } else {
        console.error('VITE_WORKER_API_URL is not defined');
      }
      return null;
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      return null;
    } finally {
      setLoading(false);
      console.log('updateTask completed');
    }
  };

  return {
    updateTask,
    loading,
    error
  };
};
