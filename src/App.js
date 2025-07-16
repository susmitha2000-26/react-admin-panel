import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes'; // ✅ rename here

function App() {
  return (
    <Router>
      <AppRoutes /> {/* ✅ renamed here */}
    </Router>
  );
}

export default App;
