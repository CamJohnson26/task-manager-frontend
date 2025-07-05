import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../auth/LogoutButton";
import Tasks from "./tasks/Tasks";

const Home = () => {
  const { user } = useAuth0();

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

        <Tasks />
      </div>
    </div>
  );
};

export default Home;
