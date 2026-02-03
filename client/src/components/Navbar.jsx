import React, { useContext, useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = ({ setShowLogin }) => {
    const { token, setToken, userData } = useContext(AppContext);
    const location = useLocation()
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        setToken("");
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <div className={`flex items-center justify-between px-6 py-3 md:py-4
  lg:px-24 xl:px-32 text-gray-600 border-borderColor relative transition-all
  ${location.pathname === "/" ? "bg-light" : "bg-white"}`} >

            <Link to='/'>
                <img src={assets.logo} alt='logo' className='h-8'></img>
            </Link>
            <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t- border-borderColor right-0 flex flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "max-sem:translate-x-0" : "max-sm:translate-x-full"} `}>
                {menuLinks.map((link, index) => (
                    <Link key={index} to={link.path}>{link.name}</Link>
                ))}

                <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
                    <input type='text' className="py-1.5 w-full bg-transparent outline-non placeholder-gray-500" placeholder='Search products' />
                    <img src={assets.search_icon} alt='search' />

                </div>
                <div className='flex max-sm:flex-col items-starts-start sm:items-center gap-6'>
                    {token && userData ? (
                        <div className='flex items-center gap-4'>
                            <button onClick={() => navigate('/owner')} className='cursor-pointer'>Dashboard</button>
                            <div className='group relative cursor-pointer'>
                                <img src={userData.image || assets.profile_pic} className='w-10 rounded-full' alt="" />
                                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                    <div className='min-w-48 bg-slate-100 rounded flex flex-col gap-4 p-4'>
                                        <p onClick={() => navigate('/my-bookings')} className='hover:text-black cursor-pointer'>My Bookings</p>
                                        <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setShowLogin(true)} className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'>Login</button>
                    )}
                </div>
                <button className="sm:hidden cursor-pointer" aria-label="Menu" onClick={() => setOpen(!open)}>
                    <img src={open ? assets.close_icon : assets.menu_icon} alt='menu'></img>
                </button>
            </div>

        </div>
    )
}

export default Navbar

