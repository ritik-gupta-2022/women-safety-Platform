import React from 'react';
import { PhoneCall } from 'lucide-react'; 
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../../utils/utils';

const CallIcon = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const {currentUser} = useSelector((state)=>state.user);
  const handleClick = async () => {
    try {
      const res = await fetch(`${API_URL}api/feature/fake-call`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',

      }); 

      const data = await res.json();
      if(res.status===200){
        toast.success("You will receive call within few minutes.");
      }
      else{
        toast.error(data.message);
      }
    } 
    catch (err) {
      toast.error(err.message);
    }
  };

  return ( currentUser && !currentUser?.isAdmin && !isHomePage &&
    <div
      onClick={handleClick}
      className="fixed bottom-4 right-20 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer text-white hover:bg-red-600 transition-colors"
    >
      <PhoneCall className="w-6 h-6" />
    </div>
  );
};

export default CallIcon;
