import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './AppRoutes';
import ThemeContextProvider from './theme/ThemeContext'; 

function App() {
  return (
    <ThemeContextProvider>     
      <Router>                 
        <AppRoutes />         
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeContextProvider>
  );
}

export default App;
