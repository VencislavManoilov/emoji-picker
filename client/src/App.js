import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import EmojiPicker from './components/EmojiPicker';
import Notification from './components/Notification';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch('http://localhost:8080/me', {
        headers: {
          'Authorization': token
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const showCopyNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLogin} />
      ) : (
        <EmojiPicker onCopy={showCopyNotification} />
      )}
      {showNotification && <Notification message="Copied!" />}
    </div>
  );
}

export default App;
