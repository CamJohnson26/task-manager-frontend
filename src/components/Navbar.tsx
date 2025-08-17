import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../auth/LogoutButton";
import { useGetMe } from "../taskManagerApi/useGetMe";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const { user: meUser } = useGetMe();
  const isAdmin = meUser?.[3] === true;
  return (
    <header className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="mb-4 sm:mb-0">
          <div className="flex flex-row justify-between items-center">
            <img width={48} height={48} src={"./icon.svg"} alt={"logo"}></img>
            <h1 className="text-2xl font-bold text-gray-800 ml-1">Task Manager</h1>
          </div>
        </div>
      </div>

      <nav className="flex border-b border-gray-200">
        <a
          href="#"
          className={`py-3 px-3 text-sm font-medium transition-colors duration-200 relative ${
            activeTab === "tasks"
              ? "text-[#8B0000]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange("tasks");
          }}
        >
          Tasks
          {activeTab === "tasks" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B0000]"></span>
          )}
        </a>

        <a
          href="#"
          className={`py-3 px-3 text-sm font-medium transition-colors duration-200 relative ${
            activeTab === "completed"
              ? "text-[#8B0000]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange("completed");
          }}
        >
          Completed
          {activeTab === "completed" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B0000]"></span>
          )}
        </a>

        {isAdmin && (
          <a
            href="#"
            className={`py-3 px-3 text-sm font-medium transition-colors duration-200 relative ${
              activeTab === "admin"
                ? "text-[#8B0000]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange("admin");
            }}
          >
            Admin
            {activeTab === "admin" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B0000]"></span>
            )}
          </a>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
