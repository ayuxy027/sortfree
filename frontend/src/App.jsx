import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UserProfile from './components/UserProfile';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  // Initialize dark mode from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Update localStorage and document class when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <Router>
        <div className={`App min-h-screen transition-colors duration-300 ${
          darkMode ? 'dark bg-background-dark' : 'bg-background-light'
        }`}>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Routes>
            <Route path="/" element={<Hero darkMode={darkMode} />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </Auth0Provider>
  );
}

export default App;