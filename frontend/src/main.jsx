import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './app/store'
import { Provider } from 'react-redux' // to "Provide" the redux store to our app

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <BrowserRouter>
        <Routes>
          <Route path = "/*" element ={<App />} /> 
          {/* Above path allows nested routes (it's a catch-all and all paths are directed to this route*/}
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
 