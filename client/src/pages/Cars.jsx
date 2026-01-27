import React, { useState } from 'react'
import Title from '../components/Title'
import CarCard from '../components/CarCard'
import { assets, dummyCarData } from '../assets/assets'

const Cars = () => {
  const [input, setInput] = useState('')

  return (
    <div>
      
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title
          title='Available Cars'
          subTitle='Browse our selection of premium vehicles available for your next adventure'
        />

        <div className='flex items-center bg-white px-4 mt-6 max-w-[560px] w-full h-12 rounded-full shadow'>
          <img
            src={assets.search_icon}
            alt='search'
            className='w-4.5 h-4.5 mr-2'
          />

          <input
            type='text'
            placeholder='Search by make, model, or features'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='w-full outline-none text-gray-500'
          />

          <img
            src={assets.filter_icon}
            alt='filter'
            className='w-4.5 h-4.5 ml-2'
          />
        </div>
      </div>

      {/* Cars Grid */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500'>
          Showing {dummyCarData.length} Cars
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 max-w-7xl mx-auto'>
          {dummyCarData.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cars
