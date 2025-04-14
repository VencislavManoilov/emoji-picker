import { useEffect, useState } from 'react';
import './styles.css';

function Notification({ message }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      setIsVisible(false);
    };
  }, []);

  return (
    <div className={`notification ${isVisible ? 'notification-visible' : ''}`}>
      {message}
    </div>
  );
}

export default Notification;