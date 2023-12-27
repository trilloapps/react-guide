import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication (you might want to customize this logic)
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return { authenticated };
};