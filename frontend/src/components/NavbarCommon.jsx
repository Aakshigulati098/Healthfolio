import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';

const NavbarCommon = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    aToken && setAToken('');
    aToken && localStorage.removeItem('aToken');
    dToken && setDToken('');
    dToken && localStorage.removeItem('dToken');
  };

  return (
    <div className="flex justify-between items-center px-6 sm:px-10 py-4 border-b shadow-md bg-white">
      {/* Logo and Role */}
      <div className="flex items-center gap-4">
        <img className="sm:w-20 cursor-pointer" src={assets.logo} alt="Logo" />
        <p className="text-xs font-semibold px-3 py-1 rounded-full border-2 border-gray-600 text-gray-600">
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>
      
      {/* Logout Button */}
      <button
        onClick={logout}
        className="bg-[#16a34a] hover:bg-[#15803d] text-white text-sm px-6 py-2 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
      >
        Logout
      </button>
    </div>
  );
};

export default NavbarCommon;


