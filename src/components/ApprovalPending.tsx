import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "../auth/LogoutButton";

const ApprovalPending = () => {
  const { user } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
              {user?.nickname && (
                <p className="text-gray-600">Hello, {user.nickname}</p>
              )}
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="text-center py-6 sm:py-8">
            <svg 
              className="mx-auto h-14 w-14 sm:h-16 sm:w-16 text-[#8B0000] mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Approval Pending</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Your user account needs to be approved by an admin. Please reach out to the site admins for support.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprovalPending;
