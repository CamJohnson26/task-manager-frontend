import { useEffect, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { type User } from "../types/User";

export const useGetUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const {
        isLoading: auth0Loading,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (auth0Loading || !isAuthenticated) {
                console.log('Auth failed', auth0Loading, isAuthenticated);
                return;
            }

            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_WORKER_API_AUDIENCE,
                }
            });

            const path = '/users';

            if (import.meta.env.VITE_WORKER_API_URL) {
                const url = new URL(path, import.meta.env.VITE_WORKER_API_URL);
                const response = await fetch(url, {
                    cache: 'no-store',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                try {
                    const usersData = await response.json();
                    setUsers(usersData);
                } catch (jsonError) {
                    if (import.meta.env.DEV) {
                        console.error('JSON parse error:', jsonError);
                    }
                    throw new Error('Invalid response format');
                }
            }
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('Error fetching users:', error);
            }
            setError(error instanceof Error ? error : new Error('Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [auth0Loading, isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
        void fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        refetch: fetchUsers
    };
};