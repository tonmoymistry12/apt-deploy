import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import SideMenu from "@/components/SideMenu";
import Header from "@/components/Header";

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   // Add other user-related fields as necessary
// };

interface AuthContextType {
  token: string | null;
  user: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: string) => void;
  logout: () => void;
  isInitialized:boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false); // Track initialization
    const router = useRouter();
  
    useEffect(() => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
  
      if (savedToken) setToken(savedToken);
      if (savedUser) setUser(savedUser);
      
      setIsInitialized(true); // Initialization complete
    }, []);
  
    const login = (token: string, user: string) => {
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
    };
  
    const logout = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem('userId');
      localStorage.removeItem('username')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userProject')
      localStorage.removeItem('userName')
      localStorage.removeItem('userPwd')
      router.push("/"); // Redirect to home page
    };
  
    // Only render SideMenu and Header if user is authenticated and not on signin page
    const isSignInPage = router.pathname === '/signin' || '/forgot-password';
    const isAuthenticated = !!token;

    return (
      <AuthContext.Provider value={{ 
        token, 
        user, 
        login, 
        logout, 
        isInitialized,
        isAuthenticated 
      }}>
        {isAuthenticated && !isSignInPage && <SideMenu />}
        {isAuthenticated && !isSignInPage && <Header notificationCount={3} />}
        <div style={{ marginTop: isAuthenticated && !isSignInPage ? '65px' : '0' }}>
          {children}
        </div>
      </AuthContext.Provider>
    );
  };
  

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
