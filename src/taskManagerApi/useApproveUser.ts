import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { type User } from "../types/User";

export const useApproveUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    getAccessTokenSilently,
    isAuthenticated,
  } = useAuth0();

  const approveUser = async (userId: string): Promise<User | null> => {
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

      const path = `/users/${userId}/approve`;

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
          throw new Error(`Failed to approve user: ${response.status} ${response.statusText}`);
        }

        try {
          const updatedUser = await response.json();
          return updatedUser;
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
        console.error('Error approving user:', error);
      }
      setError(error instanceof Error ? error : new Error('Unknown error'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    approveUser,
    loading,
    error
  };
};