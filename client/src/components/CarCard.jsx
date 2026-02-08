import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹"
  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
        navigate(`/cars-details/${car.id}`)
        window.scrollTo(0, 0)
      }}
      className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-50 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-white border border-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
        <img
          src={car.image}
          alt={car.brand}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />

        {/* Availability Badge */}
        {car.isAvaliable && (
          <div className='absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm text-xs font-medium text-emerald-600 flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></span>
            Available
          </div>
        )}

        {/* Price Badge */}
        <div className='absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm shadow-sm px-3 py-1.5 rounded-lg border border-gray-100 flex items-baseline gap-1'>
          <span className='text-sm font-bold text-gray-900'>{currency}{car.pricePerDay}</span>
          <span className='text-[10px] text-gray-500 font-medium'>/DAY</span>
        </div>
      </div>

      {/* Info Content */}
      <div className='space-y-3 px-1'>
        <div className='flex justify-between items-start'>
          <div>
            <p className='text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5'>{car.brand}</p>
            <h3 className='text-lg font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors'>{car.model}</h3>
          </div>
          <div className='text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200'>
            {car.year}
          </div>
        </div>

        {/* Specs Grid */}
        <div className='grid grid-cols-2 gap-x-2 gap-y-2 pt-3 border-t border-dashed border-gray-100'>
          <div className='flex items-center gap-2 text-xs text-gray-600'>
            <img src={assets.users_icon} className='w-3.5 h-3.5 opacity-60' alt="seats" />
            <span className='truncate'>{car.seating_capacity} Seats</span>
          </div>
          <div className='flex items-center gap-2 text-xs text-gray-600'>
            <img src={assets.fuel_icon} className='w-3.5 h-3.5 opacity-60' alt="fuel" />
            <span className='truncate'>{car.fuel_type}</span>
          </div>
          <div className='flex items-center gap-2 text-xs text-gray-600'>
            <img src={assets.carIcon || assets.car_icon} className='w-3.5 h-3.5 opacity-60' alt="transmission" />
            <span className='truncate'>{car.transmission}</span>
          </div>
          <div className='flex items-center gap-2 text-xs text-gray-600'>
            <img src={assets.location_icon} className='w-3.5 h-3.5 opacity-60' alt="location" />
            <span className='truncate'>{car.location}</span>
          </div>
        </div>

        {/* View Details Button (Visual Cue) */}
        <div className='mt-2 pt-2'>
          <button className='w-full py-2 bg-blue-50 text-primary font-semibold rounded-lg text-xs group-hover:bg-primary group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2'>
            View Details
            <img src={assets.arrow_icon} className='w-3 brightness-0 group-hover:brightness-0 group-hover:invert transition-all' alt="" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CarCard
