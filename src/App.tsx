import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return isAuthenticated ? <Home /> : <Login />;
}

export default App
