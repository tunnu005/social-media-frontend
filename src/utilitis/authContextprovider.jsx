import { createContext,useEffect,useState } from "react";
import axios from 'axios'
import {  serverapi } from '@/data/server';
import { getUser } from "@/services/userServices";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{

    const[isAuthenticated,setIsAuthenticated] = useState(null);
    const [User,setUser] = useState({})
    // console.log('AuthProvider1')
    useEffect(()=>{
       
        
            axios.get(`${serverapi}/api/auth/verifyToken`, {
               withCredentials: true,
              })
              .then(response => {
                if (response.status === 200) {
                  // console.log('AuthProvider2')
                  setIsAuthenticated(true);
                }
              })
              .catch(error => {
                console.error('Token verification failed:', error);
                setIsAuthenticated(false);
              });
        
    },[]);

    useEffect(() => {
      // Set loading true before fetching
      const fetchProfile = async () => {
        // setuserloading(true)
        try {
          const profile = await getUser();
          // console.log('Profile loaded', profile)
          setUser(profile);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
        // setuserloading(false);
      };
      fetchProfile();
      // Set loading false after fetching
    }, []);

    return(
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated,User }}>
        {children}
      </AuthContext.Provider>
    )
}

export default AuthContext;
