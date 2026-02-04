import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'

const MyBookings = () => {
  const { token, currency, getUserBookings, cancelBooking } = useContext(AppContext)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchBookings = async () => {
    setLoading(true)
    const data = await getUserBookings()
    setBookings(data)
    setLoading(false)
  }

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const success = await cancelBooking(bookingId)
      if (success) {
        fetchBookings()
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-600'
      case 'cancelled': return 'bg-red-100 text-red-600'
      default: return 'bg-yellow-100 text-yellow-600'
    }
  }

  useEffect(() => {
    if (token) {
      fetchBookings()
    } else {
      navigate('/')
    }
  }, [token])

  if (loading) return <Loader />

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 pb-20 text-sm max-w-7xl mx-auto min-h-[60vh]'>
      <Title
        title='My Bookings'
        subTitle='View and manage all your car bookings'
        align='left'
      />

      <div className='flex flex-col gap-6 mt-10'>
        {bookings.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-borderColor'>
            <img src={assets.car_icon} className='w-16 opacity-10 mb-4' alt="" />
            <p className='text-gray-400 font-medium'>You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate('/cars')}
              className='mt-4 text-primary font-semibold hover:underline'
            >
              Browse Cars
            </button>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className='flex flex-col md:flex-row gap-6 p-6 border border-borderColor rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow'
            >
              {/* Car Image */}
              <div className='md:w-1/4'>
                <div className='rounded-lg overflow-hidden border border-borderColor'>
                  <img
                    src={booking.car.image}
                    alt={`${booking.car.brand} ${booking.car.model}`}
                    className='w-full aspect-[16/10] object-cover'
                  />
                </div>
              </div>

              {/* Booking Details */}
              <div className='flex-1 flex flex-col justify-between'>
                <div>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <p className='text-lg font-bold text-gray-800'>
                      {booking.car.brand} {booking.car.model}
                    </p>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className='text-gray-500 font-medium mt-1'>
                    {booking.car.year} · {booking.car.category}
                  </p>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
                    <div className='flex items-start gap-2.5'>
                      <div className='bg-blue-50 p-2 rounded-lg'>
                        <img src={assets.calendar_icon_colored} className='w-4 h-4' alt='' />
                      </div>
                      <div>
                        <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Rental Period</p>
                        <p className='text-gray-700 font-medium'>
                          {booking.pickupDate} to {booking.returnDate}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start gap-2.5'>
                      <div className='bg-blue-50 p-2 rounded-lg'>
                        <img src={assets.location_icon_colored} className='w-4 h-4' alt='' />
                      </div>
                      <div>
                        <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Location</p>
                        <p className='text-gray-700 font-medium'>{booking.car.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-6 pt-4 border-t border-dashed border-borderColor flex items-center justify-between flex-wrap gap-4'>
                  <div>
                    <p className='text-xs text-gray-400'>
                      Booked on <span className='font-medium text-gray-600'>{new Date(booking.createdAt).toLocaleDateString()}</span>
                    </p>
                    <div className='flex items-baseline gap-1 mt-1'>
                      <span className='text-gray-400 text-xs'>Total:</span>
                      <span className='text-xl font-bold text-primary'>{currency}{booking.amount}</span>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className='px-4 py-2 border border-red-200 text-red-500 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors'
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyBookings
