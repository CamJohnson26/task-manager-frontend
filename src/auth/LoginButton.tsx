import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton = () => {
    const { loginWithRedirect, user } = useAuth0();
    return user?.nickname ? 
        <span className="text-gray-700 font-medium">Hello, {user.nickname}!</span> 
        : 
        <button 
            onClick={() => loginWithRedirect()}
            className="bg-[#8B0000] hover:bg-[#a30000] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
        >
            Log In
        </button>;
};
