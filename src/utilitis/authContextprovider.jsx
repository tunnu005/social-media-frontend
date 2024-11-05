import { createContext,useEffect,useState } from "react";
import axios from 'axios'
import {  serverapi } from '@/data/server';

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{

    const[isAuthenticated,setIsAuthenticated] = useState(null);
    console.log('AuthProvider1')
    useEffect(()=>{
       
        
            axios.get(`${serverapi}/api/auth/verifyToken`, {
               withCredentials: true,
              })
              .then(response => {
                if (response.status === 200) {
                  console.log('AuthProvider2')
                  setIsAuthenticated(true);
                }
              })
              .catch(error => {
                console.error('Token verification failed:', error);
                setIsAuthenticated(false);
              });
        
    },[]);

    return(
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        {children}
      </AuthContext.Provider>
    )
}

export default AuthContext;
