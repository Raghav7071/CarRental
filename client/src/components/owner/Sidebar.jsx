import React, { useContext, useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const { userData, token, backendUrl, setToken, setUserData } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [image, setImage] = useState('');

    const updateImage = async (img) => {
        try {
            const formData = new FormData();
            formData.append('image', img || image);

            const { data } = await axios.post(backendUrl + '/api/user/update-image', formData, {
                headers: { authorization: token }
            });

            if (data.success) {
                toast.success(data.message);
                setUserData(prev => ({ ...prev, image: data.imageUrl }));
                setImage('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const handleLogout = () => {
        setToken("");
        setUserData(null);
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>
            {/* Profile Image */}
            <div className='group relative'>
                <label htmlFor='image'>
                    <img
                        src={image ? URL.createObjectURL(image) : userData?.image || assets.profile_icon}
                        alt=""
                        className='w-20 h-20 rounded-full object-cover border-2 border-borderColor'
                    />
                    <input type='file' id='image' accept='image/*' hidden onChange={e => {
                        if (e.target.files[0]) updateImage(e.target.files[0]);
                    }} />
                    <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
                        <img src={assets.edit_icon} alt="" className='w-5' />
                    </div>
                </label>
            </div>

            {image && (
                <button className='mt-2 flex p-2 gap-1 bg-primary/10 text-primary text-xs rounded cursor-pointer' onClick={updateImage}>
                    Save <img src={assets.check_icon} width={13} alt='' />
                </button>
            )}

            <p className='mt-2 text-base font-medium max-md:hidden'>{userData?.name || "Owner"}</p>
            <p className='text-xs text-gray-400 max-md:hidden'>{userData?.email}</p>

            {/* Menu Links */}
            <div className='w-full mt-6'>
                {ownerMenuLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={`relative flex items-center gap-2 w-full py-3 pl-4 ${link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt='icon' className='w-5' />
                        <span className='max-md:hidden'>{link.name}</span>
                        <div className={`${link.path === location.pathname && 'bg-primary '}w-1.5 h-8 rounded-l right-0 absolute`}></div>
                    </NavLink>
                ))}
            </div>

            {/* Logout Button */}
            <div className='w-full mt-auto pb-6'>
                <button
                    onClick={handleLogout}
                    className='flex items-center gap-2 w-full py-3 pl-4 text-red-500 hover:bg-red-50 transition-colors cursor-pointer'
                >
                    <img src={assets.logout_icon || assets.arrow_icon} alt='logout' className='w-5 rotate-180' />
                    <span className='max-md:hidden'>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar