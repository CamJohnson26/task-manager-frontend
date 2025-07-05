import { useAuth0 } from "@auth0/auth0-react";
import { useGetEntity } from "../taskManagerApi/useGetEntity";
import { LogoutButton } from "../auth/LogoutButton";

const Home = () => {
  const { user } = useAuth0();
  const { data: entityData, loading: entityLoading } = useGetEntity();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
            {user?.nickname && (
              <p className="text-gray-600">Welcome, {user.nickname}!</p>
            )}
          </div>
          <LogoutButton />
        </header>

        <main className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Entity Data</h2>

          {entityLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B0000]"></div>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-md overflow-x-auto">
              <pre className="whitespace-pre-wrap break-words text-gray-700 text-sm sm:text-base">
                {entityData || "No data available"}
              </pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
