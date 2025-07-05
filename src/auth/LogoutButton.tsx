import { useAuth0 } from "@auth0/auth0-react";

export const LogoutButton = () => {
    const { logout, user } = useAuth0();

    return (
        user ? <button onClick={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_ORIGIN_URL } })}>
            Log Out
        </button> : null
    );
};
