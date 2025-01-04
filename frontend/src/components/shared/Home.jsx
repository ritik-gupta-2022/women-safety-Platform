import {useSelector } from 'react-redux'
import { Outlet , Navigate} from 'react-router-dom'
import Cookies from 'js-cookie';

function Home() {
    const access_token = Cookies.get('access_token');
  
    const {currentUser}=useSelector(state=>state.user)
    return ( access_token ?  currentUser.isAdmin ? <Navigate to='/admin-dashboard'/> : <Navigate to='/dashboard'/> :  <Navigate to='/signin'/> 

  )
}

export default Home