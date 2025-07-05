import './App.css'
import {useHelloWorldApi} from "./taskManagerApi/useHelloWorldApi.ts";
import {LoginButton} from "./auth/LoginButton.tsx";
import {LogoutButton} from "./auth/LogoutButton.tsx";
import {useProtectedApi} from "./taskManagerApi/useProtectedApi.ts";
import {useGetEntity} from "./taskManagerApi/useGetEntity.ts";

function App() {
    const {data, loading} = useHelloWorldApi()
    const {data: privateData, loading: privateLoading} = useProtectedApi();
    const {data: entityData, loading: entityLoading} = useGetEntity();

    return (
        <>
            <div>{data}</div>
            <div>{privateData}</div>
            <div>{entityData}</div>
            {loading || privateLoading || entityLoading && <div>Loading...</div>}
            <LoginButton /><LogoutButton />
        </>
    )
}

export default App
