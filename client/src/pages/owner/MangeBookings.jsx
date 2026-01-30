import React, { useEffect, useState } from 'react'
import { dummyMyBookingsData } from '../../assets/assets'
import Title from '../../components/Title'

const MangeBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const [bookings, setBooking] = useState([])

  const fetchOwnerCarsBookings = async () => {
    setBooking(dummyMyBookingsData)
  }

  useEffect(() => {
    fetchOwnerCarsBookings()
  }, [])

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      {/* LEFT aligned Title */}
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and booking statuses."
        align="left"
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-white">
        <table className="w-full border-collapse text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3 font-medium text-left">Car</th>
              <th className="p-3 font-medium text-left max-md:hidden">
                Date Range
              </th>
              <th className="p-3 font-medium text-left">Total</th>
              <th className="p-3 font-medium text-left max-md:hidden">
                Payment
              </th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={index}
                className="border-t border-borderColor text-gray-500"
              >
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={booking?.car?.image}
                    alt=""
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <p className="font-medium max-md:hidden">
                    {booking?.car?.brand} {booking?.car?.model}
                  </p>
                </td>
                <td className='p-3 max-hidden'>
                  {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}

                </td>
                <td className='p-3'>{currency}{booking.price}</td>
                <td className='p-3 max-md:hidden'>
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
                </td>
                <td className='p-3'>
                  {booking.status === 'pending' ? (
                    <select value={booking.status} className='px-2 py-1.5 mt-1 test-gray-500 border border-borderColor rounded-md outline-none'>
                      <option value='pending'>Pending</option>
                      <option value='cancelled'>Cancelled</option>
                      <option value='conffirmed'>Confirmed</option>


                    </select>
                  ): (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>{booking.status}</span>
                  )}

                </td>


              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MangeBookings
