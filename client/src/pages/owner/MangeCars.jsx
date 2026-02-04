import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/Title";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const MangeCars = () => {
  const { backendUrl, token, currency } = useContext(AppContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerCars = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + '/api/owner/cars', {
        headers: { authorization: token }
      });
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      const { data } = await axios.post(backendUrl + '/api/owner/delete-car',
        { carId },
        { headers: { authorization: token } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleToggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/owner/toggle-availability',
        { carId },
        { headers: { authorization: token } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
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
      fetchOwnerCars();
    }
  }, [token]);

  if (loading) return <Loader />;

  return (
    <div className="px-6 pt-10 w-full max-w-6xl">
      <Title
        title="Manage Your Cars"
        subTitle="View and manage all your listed vehicles"
        align="left"
      />

      <div className="mt-10 overflow-hidden bg-white border border-borderColor rounded-2xl shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-50 border-b border-borderColor font-bold uppercase text-[10px] tracking-widest text-gray-400">
            <tr>
              <th className="p-5 font-bold">Vehicle Details</th>
              <th className="p-5 max-md:hidden">Category</th>
              <th className="p-5">Daily Rate</th>
              <th className="p-5 max-md:hidden">Status</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {cars.length > 0 ? (
              cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={car.image}
                        alt=""
                        className="h-16 w-24 object-cover rounded-xl border border-borderColor"
                      />
                      <div>
                        <p className="font-black text-gray-800 text-base leading-tight">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-xs text-gray-400 font-bold mt-1 uppercase">
                          {car.year} · {car.transmission} · {car.fuel_type}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-5 max-md:hidden font-bold text-gray-500 uppercase text-xs">
                    {car.category}
                  </td>

                  <td className="p-5">
                    <p className="text-lg font-black text-primary">{currency}{car.pricePerDay}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">per day</p>
                  </td>

                  <td className="p-5 max-md:hidden">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${car.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>

                  <td className="p-5">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleToggleAvailability(car.id)}
                        className="p-2.5 rounded-xl border border-borderColor hover:bg-gray-100 transition-colors group"
                        title={car.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                      >
                        <img src={assets.eye_icon} alt="Toggle" className="w-4 opacity-50 group-hover:opacity-100" />
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="p-2.5 rounded-xl border border-red-100 hover:bg-red-50 transition-colors group"
                        title="Delete Car"
                      >
                        <img src={assets.delete_icon} alt="Delete" className="w-4 opacity-40 group-hover:opacity-100" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-24 text-center">
                  <div className="flex flex-col items-center">
                    <img src={assets.carIconColored} className="w-12 opacity-10 mb-4" alt="" />
                    <p className="text-gray-400 font-medium">You haven't listed any cars yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MangeCars;
