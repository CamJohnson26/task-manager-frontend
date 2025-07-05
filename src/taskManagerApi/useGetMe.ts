import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

export const useGetMe = () => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const {
        isLoading: auth0Loading,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    useEffect(() => {
        const fetchData = async () => {
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

                const path = '/me';

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
                        // Don't try to parse JSON for error responses
                        // This prevents JSON parse errors from flashing
                        throw new Error('User not approved');
                    }

                    try {
                        // Only try to parse JSON for successful responses
                        // Wrap in try/catch to handle any JSON parse errors silently
                        const userData = await response.json();
                        setUser(userData);
                    } catch (jsonError) {
                        // Handle JSON parse errors silently
                        if (import.meta.env.DEV) {
                            console.error('JSON parse error:', jsonError);
                        }
                        throw new Error('Invalid response format');
                    }
                }
            } catch (error) {
                // Silently handle the error to prevent flashing error messages
                // Only log to console in development environment
                if (import.meta.env.DEV) {
                    console.error('Error:', error);
                }
                setError(error instanceof Error ? error : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [auth0Loading, isAuthenticated, getAccessTokenSilently]);

    return {
        user,
        loading,
        error
    };
};
