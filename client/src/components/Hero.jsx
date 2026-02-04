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
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>

      <h1 className='text-4xl md:text-5xl font-semibold'>
        Luxury cars on Rent
      </h1>

      <form className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-full w-full max-w-[800px] bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>

        <div className='flex flex-col md:flex-row items-start md:items-center gap-10 md:ml-8'>

          <div className='flex flex-col items-start gap-2'>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className='outline-none bg-transparent'
            >
              <option value=''>Pickup Location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <p className='px-1 text-sm text-gray-500'>
              {pickupLocation || 'Select location'}
            </p>
          </div>

          <div className='flex flex-col items-start gap-2'>
            <label htmlFor='pickup-date'>Pick-up Date</label>
            <input
              type='date'
              id='pickup-date'
              min={new Date().toISOString().split('T')[0]}
              className='text-sm text-gray-500'
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

          <div className='flex flex-col items-start gap-2'>
            <label htmlFor='return-date'>Return Date</label>
            <input
              type='date'
              id='return-date'
              min={getMinReturnDate()}
              className='text-sm text-gray-500'
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

        </div>
        <button
          type='submit'
          onClick={handleSearch}
          className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer'
        >
          <img src={assets.search_icon} alt='search' className='brightness-300' />
          Search
        </button>
      </form>

      <img
        src={assets.main_car}
        alt='car'
        className='max-h-[300px]'
      />
    </div>
  )
}

export default Hero
