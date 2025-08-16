import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { type Task } from "../types/Task";

export const useCompleteTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    getAccessTokenSilently,
    isAuthenticated,
  } = useAuth0();

  const completeTask = async (taskId: string): Promise<Task | null> => {
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

      const path = `/tasks/${taskId}/complete`;

      if (import.meta.env.VITE_WORKER_API_URL) {
        const url = new URL(path, import.meta.env.VITE_WORKER_API_URL);

        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to complete task: ${response.status} ${response.statusText}`);
        }

        try {
          const completedTask = await response.json();
          return completedTask;
        } catch (jsonError) {
          throw new Error('Invalid response format');
        }
      }
      return null;
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Unknown error'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    completeTask,
    loading,
    error
  };
};
