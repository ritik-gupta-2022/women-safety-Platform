import {useSelector } from 'react-redux'
import { Outlet , Navigate} from 'react-router-dom'
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';


function OnlyUserPrivateRoute() {
  const [token, setToken] = useState(() => {
    const initialToken = Cookies.get('access_token');
    return initialToken || null;
  });

  useEffect(() => {
    const handleToken = () => {
      const accessToken = Cookies.get('access_token');
      console.log("Handling token update:", accessToken);
      
      if (accessToken !== token) {
        console.log("Setting new token value");
        setToken(accessToken || null);
      }
    };

    handleToken();

    
    window.addEventListener('storage', handleToken);
    return () => window.removeEventListener('storage', handleToken);
  }, []); 

    const {currentUser}=useSelector(state=>state.user)
    return ( token && currentUser ?  currentUser.isAdmin ? <Navigate to='/admin-dashboard'/> : <Outlet/> :  <Navigate to='/signin'/> 

  )
}

export default OnlyUserPrivateRoute