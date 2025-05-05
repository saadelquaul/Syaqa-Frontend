import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from '@/utils/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isMonitor, setIsMonitor] = useState(false);
  const [isCandidate, setIsCandidate] = useState(false);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
            ...getAuthHeader(),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
      });

      setUser(response.data.user);
      setIsAdmin(response.data.user.isAdmin);
      setIsMonitor(response.data.user.isMonitor);
      setIsCandidate(response.data.user.isCandidate); 
      setError(null);
    } catch (err) {
      setError('Failed to fetch user data');
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUser();
  }, []);

  return { 
    user, 
    isAdmin, 
    isMonitor, 
    isCandidate,
    isLoading, 
    error, 
    refetchUser: fetchUser 
  };
}