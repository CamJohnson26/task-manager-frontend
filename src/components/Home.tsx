import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Tasks from "./tasks/Tasks";
import Admin from "./Admin";
import Navbar from "./Navbar";

const Home = () => {
  const [activeTab, setActiveTab] = useState("tasks");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "tasks" && <Tasks />}
        {activeTab === "admin" && <Admin />}
      </div>
    </div>
  );
};

export default Home;
