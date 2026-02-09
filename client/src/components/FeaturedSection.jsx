import React from 'react'
import { useNavigate } from 'react-router-dom'
import Title from './Title'
import { dummyCarData, assets } from '../assets/assets'
import CarCard from './CarCard'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useEffect } from 'react'

const FeaturedSection = () => {

  const navigate = useNavigate()
  const { allCars, fetchAllCars, searchCars, loading } = useContext(AppContext);

  useEffect(() => {
    fetchAllCars();
  }, []);



  return (
    <div className='flex flex-col items-center py-12 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32'>

      <Title
        title='Featured Vehicles'
        subTitle='Explore our selection of premium vehicles available for your next adventure.'
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10 md:mt-18 w-full max-w-[1200px]'>
        {
          allCars.slice(0, 6).map((car) => (
            <CarCard key={car.id} car={car} />
          ))
        }
      </div>

      <button
        onClick={() => { navigate('/cars'); scroll(0, 0) }}
        className='flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer'
      >
        Explore all cars
        <img src={assets.arrow_icon} alt="arrow" />
      </button>

    </div>
  )
}

export default FeaturedSection

