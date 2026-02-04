import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import Loader from '../components/Loader'

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { backendUrl, token, currency, bookCar } = useContext(AppContext)

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  // Get today's date for min date
  const today = new Date().toISOString().split('T')[0];

  // Fetch car details
  const fetchCarDetails = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/car/details/' + id)
      if (data.success) {
        setCar(data.car)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate total price
  const calculateTotal = () => {
    if (!pickupDate || !returnDate || !car) return 0
    const d1 = new Date(pickupDate)
    const d2 = new Date(returnDate)
    const diffTime = Math.abs(d2 - d1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
    return diffDays * parseInt(car.pricePerDay)
  }

  // Handle booking
  const handleBooking = async (e) => {
    e.preventDefault()

    if (!token) {
      navigate('/')
      return
    }

    if (!pickupDate || !returnDate) {
      return
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      return
    }

    setBooking(true)
    const amount = calculateTotal()
    const success = await bookCar(car.id, pickupDate, returnDate, amount)
    setBooking(false)

    if (success) {
      navigate('/my-bookings')
    }
  }

  useEffect(() => {
    fetchCarDetails()
  }, [id])

  if (loading) return <Loader />
  if (!car) return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center'>
      <p className='text-gray-500'>Car not found</p>
      <button onClick={() => navigate('/cars')} className='mt-4 text-primary hover:underline'>
        Browse Cars
      </button>
    </div>
  )

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 pb-20'>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 hover:text-gray-700'>
        <img src={assets.arrow_icon} className='rotate-180 w-4 opacity-65' alt="" />
        Back
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: Car Image & Details */}
        <div className='lg:col-span-2'>
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className='w-full h-auto max-h-[500px] object-cover rounded-xl mb-6 shadow-md'
          />

          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
              <p className='text-gray-500 text-lg'>{car.category} · {car.year}</p>
            </div>

            <hr className='border-borderColor' />

            {/* Specs Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location }
              ].map(({ icon, text }) => (
                <div key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                  <img src={icon} alt='' className='h-5 mb-2' />
                  <span className='text-sm text-gray-600'>{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div>
                <h2 className='text-xl font-medium mb-3'>Description</h2>
                <p className='text-gray-500'>{car.description}</p>
              </div>
            )}

            {/* Features */}
            <div>
              <h2 className='text-xl font-medium mb-3'>Features</h2>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {["Air Conditioning", "Bluetooth", "GPS Navigation", "USB Charging", "Backup Camera"].map((item) => (
                  <li key={item} className='flex items-center text-gray-500'>
                    <img src={assets.check_icon} className='h-4 mr-2' alt='' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Owner Info */}
            {car.owner && (
              <div className='p-4 bg-gray-50 rounded-lg flex items-center gap-4'>
                <img
                  src={car.owner.image || assets.profile_icon}
                  className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm'
                  alt=""
                />
                <div>
                  <p className='text-xs text-gray-400 font-medium'>CAR OWNER</p>
                  <p className='font-bold text-gray-700'>{car.owner.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Booking Form */}
        <form onSubmit={handleBooking} className='bg-white shadow-lg h-max sticky top-20 rounded-xl p-6 space-y-6 border border-borderColor'>
          <div className='flex items-center justify-between'>
            <p className='text-2xl text-primary font-bold'>{currency}{car.pricePerDay}</p>
            <span className='text-gray-400'>per day</span>
          </div>

          <hr className='border-borderColor' />

          <div className='flex flex-col gap-2'>
            <label htmlFor='pickup-date' className='font-medium'>Pickup Date</label>
            <input
              type='date'
              id='pickup-date'
              className='border border-borderColor px-3 py-2 rounded-lg outline-primary'
              required
              min={today}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='return-date' className='font-medium'>Return Date</label>
            <input
              type='date'
              id='return-date'
              className='border border-borderColor px-3 py-2 rounded-lg outline-primary'
              required
              min={pickupDate || today}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

          {pickupDate && returnDate && (
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Total Days</span>
                <span>{Math.ceil(Math.abs(new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) || 1}</span>
              </div>
              <div className='flex justify-between text-lg font-bold mt-2'>
                <span>Total</span>
                <span className='text-primary'>{currency}{calculateTotal()}</span>
              </div>
            </div>
          )}

          <button
            type='submit'
            disabled={booking || !token}
            className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer disabled:opacity-50'
          >
            {!token ? 'Login to Book' : booking ? 'Booking...' : 'Book Now'}
          </button>

          <p className='text-center text-sm text-gray-400'>Free cancellation up to 24 hours before pickup</p>
        </form>
      </div>
    </div>
  )
}

export default CarDetails