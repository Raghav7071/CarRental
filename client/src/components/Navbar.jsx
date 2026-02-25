import React, { useContext, useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = ({ setShowLogin }) => {
    const { token, setToken, userData } = useContext(AppContext);
    const location = useLocation()
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/cars?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    }

    const logout = () => {
        setToken("");
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <div className={`flex items-center justify-between px-4 py-3 md:py-4 lg:px-24 xl:px-32 text-gray-600 border-borderColor relative transition-all ${location.pathname === "/" ? "bg-light" : "bg-white"}`} >

            <Link to='/'>
                <img src={assets.logo} alt='logo' className='h-7 md:h-8 hover:scale-105 transition-all duration-300 cursor-pointer'></img>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-6 md:gap-8">
                {menuLinks.map((link, index) => (
                    <Link key={index} to={link.path} className='hover:text-primary transition-all duration-300 font-medium whitespace-nowrap'>{link.name}</Link>
                ))}
            </div>

            <div className='flex items-center gap-2 md:gap-4'>
                {/* Search Bar - Hidden on small mobile */}
                <div className='hidden md:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-40 lg:max-w-56 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300'>
                    <input
                        type='text'
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        placeholder='Search'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <img
                        src={assets.search_icon}
                        alt='search'
                        className="w-4 h-4 cursor-pointer hover:scale-110 transition-all"
                        onClick={handleSearch}
                    />
                </div>

                {token && userData ? (
                    <div className='flex items-center gap-4'>
                        <button onClick={() => navigate('/owner')} className='hidden md:block cursor-pointer hover:text-primary transition-all duration-300 font-medium'>Dashboard</button>
                        <div className='group relative cursor-pointer'>
                            <img src={userData.image || assets.profile_pic} className='w-8 md:w-10 rounded-full hover:scale-110 hover:ring-2 hover:ring-primary transition-all duration-300' alt="" />
                            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-40 bg-slate-100 rounded flex flex-col gap-2 p-3 shadow-lg'>
                                    <p onClick={() => navigate('/owner')} className='md:hidden hover:bg-gray-200 hover:text-black px-2 py-1 rounded transition-all duration-200 cursor-pointer'>Dashboard</p>
                                    <p onClick={() => navigate('/my-bookings')} className='hover:bg-gray-200 hover:text-black px-2 py-1 rounded transition-all duration-200 cursor-pointer'>My Bookings</p>
                                    <p onClick={logout} className='hover:bg-gray-200 hover:text-black px-2 py-1 rounded transition-all duration-200 cursor-pointer'>Logout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setShowLogin(true)} className='cursor-pointer px-4 md:px-8 py-1.5 md:py-2 bg-primary hover:bg-primary-dull hover:shadow-lg hover:scale-105 transition-all duration-300 text-white rounded-lg text-sm md:text-base'>Login</button>
                )}

                {/* Mobile Menu Icon */}
                <button className="sm:hidden z-50 cursor-pointer p-1" aria-label="Menu" onClick={() => setOpen(!open)}>
                    <img src={open ? assets.close_icon : assets.menu_icon} alt='menu' className="w-6 h-6"></img>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 sm:hidden ${open ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setOpen(false)}></div>

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 sm:hidden ${open ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex flex-col p-6 gap-6 mt-16">
                    {menuLinks.map((link, index) => (
                        <Link key={index} to={link.path} onClick={() => setOpen(false)} className='text-lg hover:text-primary transition-all duration-300 font-medium border-b border-gray-100 pb-2'>{link.name}</Link>
                    ))}
                    {token && userData && (
                        <button onClick={() => { navigate('/owner'); setOpen(false); }} className='text-lg text-left hover:text-primary transition-all duration-300 font-medium border-b border-gray-100 pb-2'>Dashboard</button>
                    )}
                </div>
            </div>

        </div>
    )
}

export default Navbar
