import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Task Manager</h1>
        <p className="text-gray-600 text-center mb-8">
          Please log in to access your tasks
        </p>
        <button 
          onClick={() => loginWithRedirect()}
          className="w-full bg-[#8B0000] hover:bg-[#a30000] text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Login;
