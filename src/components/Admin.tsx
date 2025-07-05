import { useState } from "react";
import { useGetUsers } from "../taskManagerApi/useGetUsers";
import { useApproveUser } from "../taskManagerApi/useApproveUser";
import { type User } from "../types/User";

const Admin = () => {
  const { users, loading, error, refetch } = useGetUsers();
  const { approveUser, loading: approveLoading } = useApproveUser();
  const [approvingUserId, setApprovingUserId] = useState<string | null>(null);

  const handleApproveUser = async (user: User) => {
    if (approveLoading) return;

    setApprovingUserId(user['id']);
    try {
      await approveUser(user['id']);
      // Refetch the users list to update the UI
      refetch();
    } finally {
      setApprovingUserId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Dashboard</h2>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B0000]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          <p>Error loading users: {error.message}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-600">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Id
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user['id']}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user['id']}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user['email']}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user[3] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user[3] ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user['approved'] ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user['approved'] ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!user['approved'] && (
                      <button
                        onClick={() => handleApproveUser(user)}
                        disabled={approveLoading && approvingUserId === user[0]}
                        className="text-[#8B0000] hover:text-[#a30000] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {approveLoading && approvingUserId === user[0] ? 'Approving...' : 'Approve'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
