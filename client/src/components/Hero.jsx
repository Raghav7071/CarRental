import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'

const Hero = () => {

  const [pickupLocation, setPickupLocation] = useState('')

  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>
      
      <h1 className='text-4xl md:text-5xl font-semibold'>
        Luxury cars on Rent
      </h1>

      <form className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-full w-full max-w-[800px] bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>
        
        <div className='flex flex-col md:flex-row items-start md:items-center gap-10 md:ml-8'>
          
          <div>
            <select
              required
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
              {pickupLocation || 'Please select location'}
            </p>
          </div>

        </div>

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
