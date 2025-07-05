import { useAuth0 } from "@auth0/auth0-react";

export const LogoutButton = () => {
    const { logout, user } = useAuth0();

    return (
        user ? (
            <button 
                onClick={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_ORIGIN_URL } })}
                className="bg-[#8B0000] hover:bg-[#a30000] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
                Log Out
            </button>
        ) : null
    );
};
