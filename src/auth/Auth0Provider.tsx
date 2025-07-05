// auth/Auth0Provider.tsx

import {type PropsWithChildren} from "react";
import {Auth0Provider} from "@auth0/auth0-react";

export const Auth0ProviderWrapped = ({children}: PropsWithChildren) => {
    return <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN ?? ''}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''}
        authorizationParams={{
            redirect_uri: window.location.href,
            audience: import.meta.env.VITE_WORKER_API_AUDIENCE,
        }}
        useRefreshTokens={true}
    >
        {children}
    </Auth0Provider>
}