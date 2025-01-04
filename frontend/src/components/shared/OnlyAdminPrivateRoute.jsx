import {useSelector } from 'react-redux'
import { Outlet , Navigate} from 'react-router-dom'
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

function OnlyAdminPrivateRoute() {

    const {currentUser}=useSelector(state=>state.user)
    return ( currentUser ?  currentUser.isAdmin ? <Outlet/> : <Navigate to='/dashboard'/> :  <Navigate to='/signin'/> 

  )
}

export default OnlyAdminPrivateRoute