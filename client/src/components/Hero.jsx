import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    // Construct query parameters
    const params = new URLSearchParams();
    if (pickupLocation) params.append('location', pickupLocation);
    if (pickupDate) params.append('pickupDate', pickupDate);
    if (returnDate) params.append('returnDate', returnDate);

    // Navigate to cars page with search params
    navigate(`/cars?${params.toString()}`);
  }

  // Get tomorrow's date for return date min value
  const getMinReturnDate = () => {
    if (pickupDate) {
      return pickupDate;
    }
    return new Date().toISOString().split('T')[0]; // Today
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-8 md:gap-14 bg-light text-center px-4 pt-20 pb-10'>

      <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold max-w-[90%]'>
        Luxury cars on Rent
      </h1>

      <form className='flex flex-col md:flex-row items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-full w-full max-w-[900px] bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] gap-6 md:gap-0'>

        <div className='flex flex-col sm:flex-row items-center md:items-center gap-6 md:gap-10 md:ml-8 w-full md:w-auto'>

          <div className='flex flex-col items-center md:items-start gap-1 w-full sm:w-auto'>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider md:hidden">Location</label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className='outline-none bg-transparent font-medium text-gray-700'
            >
              <option value=''>Pickup Location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className='hidden md:block px-1 text-sm text-gray-500'>
              {pickupLocation || 'Select location'}
            </p>
          </div>

          <div className='flex flex-col items-center md:items-start gap-1 w-full sm:w-auto'>
            <label htmlFor='pickup-date' className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pick-up Date</label>
            <input
              type='date'
              id='pickup-date'
              min={new Date().toISOString().split('T')[0]}
              className='text-sm text-gray-600 font-medium outline-none'
              value={pickupDate}
              onChange={(e) => {
                setPickupDate(e.target.value);
                // Reset return date if it's before new pickup date
                if (returnDate && e.target.value > returnDate) {
                  setReturnDate('');
                }
              }}
            />
          </div>

          <div className='flex flex-col items-center md:items-start gap-1 w-full sm:w-auto'>
            <label htmlFor='return-date' className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Return Date</label>
            <input
              type='date'
              id='return-date'
              min={getMinReturnDate()}
              className='text-sm text-gray-600 font-medium outline-none'
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

        </div>
        <button
          type='submit'
          onClick={handleSearch}
          className='w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dull text-white rounded-xl md:rounded-full cursor-pointer font-semibold transition-all duration-300 shadow-md hover:shadow-lg'
        >
          <img src={assets.search_icon} alt='search' className='w-4 h-4 brightness-300' />
          Search
        </button>
      </form>

      <img
        src={assets.main_car}
        alt='car'
        className='w-full max-w-[600px] md:max-w-[700px] lg:max-w-[800px] object-contain px-4 md:px-0 mt-4'
      />
    </div>
  )
}

export default Hero
