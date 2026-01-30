import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import { Footer } from './assets/Footer';

import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import MangeCars from './pages/owner/MangeCars';
import MangeBookings from './pages/owner/MangeBookings';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner');

  return (
    <>
      {/* Public Navbar */}
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/cars-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Owner routes */}
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<MangeCars />} />
          <Route path="manage-bookings" element={<MangeBookings />} />
        </Route>
      </Routes>

      {/* Public Footer */}
      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;
