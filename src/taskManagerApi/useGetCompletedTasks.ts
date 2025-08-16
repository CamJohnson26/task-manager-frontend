import { useEffect, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { type Task } from "../types/Task";

export const useGetCompletedTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const {
        isLoading: auth0Loading,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    const fetchCompletedTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (auth0Loading || !isAuthenticated) {
                return;
            }

            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_WORKER_API_AUDIENCE,
                }
            });

            const path = '/tasks/completed';

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
                    throw new Error('Failed to fetch completed tasks');
                }

                try {
                    const tasksData = await response.json();
                    // Map the response to the Task interface format
                    // Based on the issue description, the API returns tasks as arrays
                    const mappedTasks = tasksData.map((task: any) => {
                        // Check if task is an array (as described in the issue)
                        if (Array.isArray(task)) {
                            return {
                                id: task[0],
                                user_id: task[1],
                                title: task[2],
                                description: task[3],
                                type: task[4],
                                due_date: task[5],
                                priority: task[6],
                                status: task[7],
                                effort: task[8],
                                percent_completed: task[9],
                                // Use the completed_at field for the completion date
                                // If it's not available, fall back to the current date
                                completed_at: task[10] || null,
                                last_completed: task[10] || new Date().toISOString()
                            };
                        } else {
                            // If task is already an object, just ensure it has the required fields
                            return {
                                ...task,
                                completed_at: task.completed_at || null,
                                last_completed: task.completed_at || task.last_completed || new Date().toISOString()
                            };
                        }
                    });

                    // Sort tasks by completed_at in descending order (most recent first)
                    const sortedTasks = [...mappedTasks].sort((a, b) => {
                        if (!a.completed_at) return 1;
                        if (!b.completed_at) return -1;
                        return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
                    });

                    setTasks(sortedTasks);
                } catch (jsonError) {
                    throw new Error('Invalid response format');
                }
            }
        } catch (error) {
            setError(error instanceof Error ? error : new Error('Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [auth0Loading, isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
        void fetchCompletedTasks();
    }, [fetchCompletedTasks]);

    return {
        completedTasks: tasks,
        loading,
        error,
        refetch: fetchCompletedTasks
    };
};
