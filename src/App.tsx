import './App.css'
import {useHelloWorldApi} from "./taskManagerApi/useHelloWorldApi.ts";
import {Auth0Provider} from "@auth0/auth0-react";
import {LoginButton} from "./auth/LoginButton.tsx";
import {LogoutButton} from "./auth/LogoutButton.tsx";

function App() {
  const {data, loading} = useHelloWorldApi()

  return (
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN ?? ''}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
        useRefreshTokens={true}
    >
      {data}
      {loading && <div>Loading...</div>}
        <LoginButton /><LogoutButton />
    </Auth0Provider>
  )
}

export default App
