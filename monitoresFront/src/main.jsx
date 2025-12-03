import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./contexts/AuthContext";
import App2 from './App2.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css'

import { Provider } from 'react-redux';
import { store } from './redux/store.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <AuthProvider> */}
      <Provider store={store}>
        <App2 />
      </Provider>
      {/* <App /> */}
    {/* </AuthProvider> */}
  </StrictMode>
)
