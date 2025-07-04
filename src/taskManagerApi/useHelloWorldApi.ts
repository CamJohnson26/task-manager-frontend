import {useEffect, useState} from "react";

export const useHelloWorldApi = () => {
    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (import.meta.env.VITE_WORKER_API_URL) {
                    const response = await fetch(import.meta.env.VITE_WORKER_API_URL, {
                        cache: 'no-store',
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
    }, []);

    return {
        data,
        loading
    }
}