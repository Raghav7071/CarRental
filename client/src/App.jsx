import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import { Footer } from './assets/Footer';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const isOwnerPath = useLocation().pathname.startsWith('/owner');
  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cars-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBookings />} />

      </Routes>
      {!isOwnerPath && <Footer />}

      
    </>
  )
}

export default App
