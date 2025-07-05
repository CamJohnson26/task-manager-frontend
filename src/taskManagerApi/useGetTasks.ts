import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { type Task } from "../types/Task";

export const useGetTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const {
        isLoading: auth0Loading,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    useEffect(() => {
        const fetchTasks = async () => {
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

                const path = '/tasks';

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
                        throw new Error('Failed to fetch tasks');
                    }

                    try {
                        const tasksData = await response.json();
                        setTasks(tasksData);
                    } catch (jsonError) {
                        if (import.meta.env.DEV) {
                            console.error('JSON parse error:', jsonError);
                        }
                        throw new Error('Invalid response format');
                    }
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error('Error fetching tasks:', error);
                }
                setError(error instanceof Error ? error : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        void fetchTasks();
    }, [auth0Loading, isAuthenticated, getAccessTokenSilently]);

    return {
        tasks,
        loading,
        error
    };
};