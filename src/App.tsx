import './App.css'
import {useHelloWorldApi} from "./taskManagerApi/useHelloWorldApi.ts";
import {LoginButton} from "./auth/LoginButton.tsx";
import {LogoutButton} from "./auth/LogoutButton.tsx";
import {useProtectedApi} from "./taskManagerApi/useProtectedApi.ts";

function App() {
    const {data, loading} = useHelloWorldApi()
    const {data: privateData, loading: privateLoading} = useProtectedApi()

    return (
        <>
            <div>{data}</div>
            <div>{privateData}</div>
            {loading || privateLoading && <div>Loading...</div>}
            <LoginButton /><LogoutButton />
        </>
    )
}

export default App
