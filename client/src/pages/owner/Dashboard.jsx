import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Loader from "../../components/Loader";

const Dashboard = () => {
  const { backendUrl, token, currency } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(backendUrl + '/api/owner/dashboard-stats', {
        headers: { authorization: token }
      });
      if (response.success) {
        setData(response.stats);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.listIconColored, color: "text-yellow-600" },
    { title: "Confirmed", value: data.confirmedBookings, icon: assets.listIconColored, color: "text-green-600" },
  ];

  if (loading) return <Loader />;

  return (
    <div className="px-6 pt-8 flex-1 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-800">Owner Dashboard</h1>
        <p className="text-sm text-gray-500 font-medium max-w-xl">
          Overview of your car rental business performance and recent activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col p-6 rounded-2xl border border-borderColor bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{card.title}</h1>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                <img src={card.icon} alt="" className="h-5 w-5" />
              </div>
            </div>
            <p className={`text-3xl font-black ${card.color || 'text-gray-800'}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 p-6 border border-borderColor rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Recent Bookings</h1>
              <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">Latest transactions</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {data.recentBookings && data.recentBookings.length > 0 ? (
              data.recentBookings.map((booking, index) => (
                <div
                  key={index}
                  className="py-4 flex items-center justify-between border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <img src={booking.car?.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    <div>
                      <p className="font-bold text-sm text-gray-800">
                        {booking.car?.brand} {booking.car?.model}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {booking.user?.name} · {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <p className="text-sm font-bold text-gray-800">
                      {currency}{booking.amount}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                      }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-400">No recent bookings to show.</p>
              </div>
            )}
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-8 border border-borderColor rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white shadow-xl h-fit">
          <h1 className="text-lg font-bold">Total Revenue</h1>
          <p className="text-xs text-blue-200 uppercase font-bold tracking-widest mt-1">From Confirmed Bookings</p>

          <div className="mt-8">
            <p className="text-4xl font-black">{currency}{data.totalRevenue}</p>
          </div>

          <div className="mt-8 pt-4 border-t border-white/20">
            <p className="text-sm text-blue-100">
              {data.confirmedBookings} confirmed bookings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
