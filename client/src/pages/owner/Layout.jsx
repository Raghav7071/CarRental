import React, { useContext, useEffect } from 'react'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import NavbarOwner from '../../components/owner/NavbarOwner'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const Layout = () => {
  const { token } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      toast.error('Please login to access the dashboard')
      navigate('/')
    }
  }, [token, navigate])

  if (!token) return null
  return (
    <div className='flex flex-col'>
      <NavbarOwner />
      <div className='flex'>
        <Sidebar />
        <Outlet />

      </div>

    </div>
  )
}

export default Layout