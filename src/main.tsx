import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Auth0ProviderWrapped} from "./auth/Auth0Provider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Auth0ProviderWrapped>
          <App />
      </Auth0ProviderWrapped>
  </StrictMode>,
)
