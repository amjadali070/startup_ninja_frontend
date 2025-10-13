import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { MsalProvider } from '@azure/msal-react'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './lib/msalConfig'
import App from './App.tsx'
import './index.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const microsoftClientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID

if (!googleClientId) {
  console.warn('[Auth] VITE_GOOGLE_CLIENT_ID is not defined. Google sign-in will be disabled.')
}

if (!microsoftClientId) {
  console.warn('[Auth] VITE_MICROSOFT_CLIENT_ID is not defined. Microsoft sign-in will be disabled.')
}

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig)

// Render app with providers
const renderApp = () => {
  let appComponent = (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

  // Wrap with Microsoft provider if available
  if (microsoftClientId) {
    appComponent = (
      <MsalProvider instance={msalInstance}>
        {appComponent}
      </MsalProvider>
    )
  }

  // Wrap with Google provider if available
  if (googleClientId) {
    appComponent = (
      <GoogleOAuthProvider clientId={googleClientId}>
        {appComponent}
      </GoogleOAuthProvider>
    )
  }

  return appComponent
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {renderApp()}
  </React.StrictMode>,
)
