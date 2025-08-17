import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Tasks from "./tasks/Tasks";
import CompletedTasks from "./tasks/CompletedTasks";
import Admin from "./Admin";
import Navbar from "./Navbar";
import { LogoutButton } from "../auth/LogoutButton";

const Home = () => {
  const [activeTab, setActiveTab] = useState("tasks");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <div className="w-full max-w-7xl mx-auto flex-grow">
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "tasks" && <Tasks />}
        {activeTab === "completed" && <CompletedTasks />}
        {activeTab === "admin" && <Admin />}
      </div>

      <footer className="w-full max-w-7xl mx-auto mt-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">© 2025 Task Manager</p>
          <LogoutButton />
        </div>
      </footer>
    </div>
  );
};

export default Home;
