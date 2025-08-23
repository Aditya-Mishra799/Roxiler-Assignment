import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Logout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {reload} = useAuth();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        setLoading(true);
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
          {},
          { withCredentials: true }
        );
        setLoading(false);
        navigate('/login'); 
        reload()
      } catch (err) {
        console.error("Logout failed:", err);
        toast.error("Not able to Logout")
      } 
    };

    logoutUser();
  }, []);

  return loading ? <Loader label="Logging out..." /> : null;
};

export default Logout;
