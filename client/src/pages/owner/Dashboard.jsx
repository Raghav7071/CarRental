import React, { useEffect, useState } from "react";
import { assets, dummyDashboardData } from "../../assets/assets";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
  ];

  useEffect(() => {
    setData(dummyDashboardData);
  }, []);

  return (
    <div className="px-6 pt-8 flex-1 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-2">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 font-medium max-w-xl">
          Monitor overall platform performance including total cars, bookings, revenue,
          and recent activities
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col p-4 rounded-lg border border-gray-200 bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xs text-gray-400">{card.title}</h1>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                <img src={card.icon} alt="" className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="md:col-span-2 p-5 border border-gray-200 rounded-lg bg-white">
          <h1 className="text-lg font-bold mb-1">Recent Bookings</h1>
          <p className="text-sm text-gray-400 mb-4">Latest customer bookings</p>

          {data.recentBookings?.length > 0 ? (
            data.recentBookings.map((booking, index) => (
              <div
                key={index}
                className="py-3 flex items-center justify-between border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50">
                    <img
                      src={assets.listIconColored}
                      alt=""
                      className="h-4 w-4"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      {booking?.car?.brand} {booking?.car?.model}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking?.createdAt ? booking.createdAt.split("T")[0] : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-gray-600">
                    {currency}
                    {booking?.price}
                  </p>
                  <span className="px-4 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                    {booking?.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No recent bookings found.</p>
          )}
        </div>

        {/* Monthly Revenue */}
        <div className="p-5 border border-gray-200 rounded-lg bg-white h-fit">
          <h1 className="text-lg font-bold mb-1">Monthly Revenue</h1>
          <p className="text-sm text-gray-400">Revenue for current month</p>

          <p className="text-3xl mt-6 font-semibold text-primary">
            {currency}
            {data.monthlyRevenue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
