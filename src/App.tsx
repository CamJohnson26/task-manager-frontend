import './App.css'
import {useHelloWorldApi} from "./taskManagerApi/useHelloWorldApi.ts";
import {LoginButton} from "./auth/LoginButton.tsx";
import {LogoutButton} from "./auth/LogoutButton.tsx";
import {Auth0ProviderWrapped} from "./auth/Auth0Provider.tsx";

function App() {
  const {data, loading} = useHelloWorldApi()

  return (
      <Auth0ProviderWrapped>
      {data}
      {loading && <div>Loading...</div>}
        <LoginButton /><LogoutButton />
    </Auth0ProviderWrapped>
  )
}

export default App
