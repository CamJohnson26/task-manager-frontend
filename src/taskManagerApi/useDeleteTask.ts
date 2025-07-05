import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const useDeleteTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    getAccessTokenSilently,
    isAuthenticated,
  } = useAuth0();

  const deleteTask = async (taskId: string): Promise<boolean> => {
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
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete task: ${response.status} ${response.statusText}`);
        }

        return true;
      }
      return false;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error deleting task:', error);
      }
      setError(error instanceof Error ? error : new Error('Unknown error'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteTask,
    loading,
    error
  };
};