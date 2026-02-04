import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const NavbarOwner = () => {
  const { userData, setToken, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    setUserData(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
      <Link to='/'>
        <img src={assets.logo} alt='' className='h-7' />
      </Link>

      <div className='flex items-center gap-4'>
        <p className='max-sm:hidden'>Welcome, <span className='font-medium text-gray-700'>{userData?.name || "Owner"}</span></p>

        <button
          onClick={handleLogout}
          className='flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer'
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default NavbarOwner