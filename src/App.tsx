import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import Login from "./components/Login";
import Home from "./components/Home";
import ApprovalPending from "./components/ApprovalPending";
import { useGetMe } from "./taskManagerApi/useGetMe";

function App() {
    const { isAuthenticated, isLoading } = useAuth0();
    const { loading: userLoading, error: userError } = useGetMe();

    // Show loading spinner while authentication or user data is loading
    if (isLoading || (isAuthenticated && userLoading)) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B0000]"></div>
            </div>
        );
    }

    // If not authenticated, show login page
    if (!isAuthenticated) {
        return <Login />;
    }

    // If authenticated but user is not approved, show approval pending page
    if (userError) {
        return <ApprovalPending />;
    }

    // If authenticated and approved, show home page
    return <Home />;
}

export default App
