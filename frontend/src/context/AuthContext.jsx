import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    user: null,
  });
  const [refresh, setRefresh] = useState(false)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/user-details`,
          { withCredentials: true }
        );
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: res.data,
        });
      } catch (error) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
      }
    };

    fetchUser();
  }, [refresh]);
  const reload = ()=>setRefresh(prev => !prev)
  return (
    <AuthContext.Provider value={{authState, reload}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
