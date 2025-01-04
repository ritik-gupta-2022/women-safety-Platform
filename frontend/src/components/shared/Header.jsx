import React from 'react';
import { FaHome, FaSignOutAlt, FaUser, FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/user/userSlice';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const res = await fetch('/api/auth/logout');
      const data = await res.json();

      if (res.status === 200) {
        dispatch(logoutUser());
        toast.success('Logout Successful');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between p-4 bg-blue-600 text-white shadow-md">
      <div className="flex items-center space-x-2 mb-4 sm:mb-0">
        <FaUserCircle className="w-10 h-10" />
        <span className="text-lg font-semibold truncate">Welcome, {currentUser?.name}</span>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          <FaHome className="w-5 h-5 inline-block mr-2" />
          Dashboard
        </Button>
        <Button
          onClick={() => navigate('/profile')}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          <FaUser className="w-5 h-5 inline-block mr-2" />
          Profile
        </Button>
        <Button
          onClick={() => logout()}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          <FaSignOutAlt className="w-5 h-5 inline-block mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
