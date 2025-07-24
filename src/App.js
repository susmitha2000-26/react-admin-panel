import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './AppRoutes';
import { SnackbarProvider } from 'notistack';
import { connectQZ } from './utils/qzUtils'; // 🔌 Import QZ connect

function App() {
  useEffect(() => {
    connectQZ().catch((err) => {
      console.error('❌ Failed to connect to QZ Tray:', err);
    });
  }, []); // 👈 Only run once on app start

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      preventDuplicate
      dense
    >
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </SnackbarProvider>
  );
}

export default App;
