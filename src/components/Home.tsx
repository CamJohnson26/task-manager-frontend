import { useAuth0 } from "@auth0/auth0-react";
import { useGetEntity } from "../taskManagerApi/useGetEntity";
import { LogoutButton } from "../auth/LogoutButton";

const Home = () => {
  const { user } = useAuth0();
  const { data: entityData, loading: entityLoading } = useGetEntity();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
            {user?.nickname && (
              <p className="text-gray-600">Welcome, {user.nickname}!</p>
            )}
          </div>
          <LogoutButton />
        </header>

        <main className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Entity Data</h2>
          
          {entityLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap break-words text-gray-700">
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