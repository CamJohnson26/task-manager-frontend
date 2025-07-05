import {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

export const useGetEntity = () => {
    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)
    const {
        isLoading: auth0Loading,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (auth0Loading || !isAuthenticated) {
                    console.log('Auth failed', auth0Loading, isAuthenticated)
                    return;
                }

                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: import.meta.env.VITE_WORKER_API_AUDIENCE,
                    }
                })

                const path = '/entity'

                if (import.meta.env.VITE_WORKER_API_URL) {
                    const url = new URL(path, import.meta.env.VITE_WORKER_API_URL)
                    const response = await fetch(url, {
                        cache: 'no-store',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const textData = await response.text();
                    setData(textData);
                }
            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(false)
        };

        void fetchData();
    }, [auth0Loading, isAuthenticated, getAccessTokenSilently]);

    return {
        data,
        loading
    }
}