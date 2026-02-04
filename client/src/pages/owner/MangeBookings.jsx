import React, { useContext, useEffect, useState } from 'react'
import Title from '../../components/Title'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'

const MangeBookings = () => {
  const { backendUrl, token, currency } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + '/api/owner/bookings', {
        headers: { authorization: token }
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/owner/update-booking',
        { bookingId, status },
        { headers: { authorization: token } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOwnerBookings();
    }
  }, [token]);

  if (loading) return <Loader />;

  return (
    <div className="px-6 pt-10 w-full max-w-6xl">
      <Title
        title="Manage Bookings"
        subTitle="Approve or cancel customer rental requests"
        align="left"
      />

      <div className="mt-10 bg-white rounded-2xl border border-borderColor overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-borderColor text-left">
              <th className="p-5">Customer / Car</th>
              <th className="p-5 max-md:hidden">Rental Dates</th>
              <th className="p-5">Payment</th>
              <th className="p-5 text-center">Status / Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img src={booking.car?.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                      <div>
                        <p className="font-bold text-gray-800">{booking.user?.name}</p>
                        <p className="text-xs text-primary font-medium">{booking.car?.brand} {booking.car?.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className='p-5 max-md:hidden'>
                    <p className='text-gray-600 font-medium'>{booking.pickupDate}</p>
                    <p className='text-gray-400 text-xs mt-1'>to {booking.returnDate}</p>
                  </td>
                  <td className='p-5'>
                    <p className="font-bold text-gray-800">{currency}{booking.amount}</p>
                    <span className='text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase font-bold'>Offline</span>
                  </td>
                  <td className='p-5'>
                    <div className="flex justify-center">
                      {booking.status === 'pending' ? (
                        <div className='flex gap-2'>
                          <button
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            className='px-4 py-1.5 bg-primary text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors'
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            className='px-4 py-1.5 border border-red-200 text-red-500 rounded-lg font-bold text-xs hover:bg-red-50 transition-colors'
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                          {booking.status}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center">
                  <p className="text-gray-400 font-medium">No customer bookings found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MangeBookings;
