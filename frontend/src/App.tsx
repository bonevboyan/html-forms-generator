import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginRegister from './components/LoginRegister';
import LandingPage from './components/LandingPage';
import MyForms from './components/MyForms';
import Home from './components/Home';
import SharedForm from './components/SharedForm';
import { AuthProvider, useAuth } from './hooks/useAuth';

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <LandingPage />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/my-forms" element={isLoggedIn ? <MyForms /> : <Navigate to="/" />} />
        <Route path="/form/:formId" element={<SharedForm />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
