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
                        throw new Error('User not approved');
                    }
                    
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error:', error);
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