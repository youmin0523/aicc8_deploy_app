import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppV2 from './App_v2.jsx';
import { Provider } from 'react-redux';
import storeV2 from './redux/store_v2.js';

import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_AUTH_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={storeV2}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppV2 />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
);
