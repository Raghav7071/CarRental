import React, { useEffect, useState } from "react";
import { assets, dummyCarData } from "../../assets/assets";
import Title from "../../components/Title";

const MangeCars = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [cars, setCars] = useState([]);

  const fetchOwnerCars = async () => {
    // make all cars available
    const updatedCars = dummyCarData.map((car) => ({
      ...car,
      isAvailiable: true,
    }));
    setCars(updatedCars);
  };

  useEffect(() => {
    fetchOwnerCars();
  }, []);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      {/* LEFT aligned Title */}
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform"
        align="left"
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-white">
        <table className="w-full border-collapse text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3 font-medium text-left">Car</th>
              <th className="p-3 font-medium text-left max-md:hidden">
                Category
              </th>
              <th className="p-3 font-medium text-left">Price</th>
              <th className="p-3 font-medium text-left max-md:hidden">
                Status
              </th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((car, index) => (
              <tr
                key={index}
                className="border-b border-borderColor last:border-0 hover:bg-gray-50"
              >
                {/* Car */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={car.image}
                      alt=""
                      className="h-12 w-12 aspect-square rounded-md object-cover"
                    />
                    <div className="max-md:hidden">
                      <p className="font-medium text-gray-800">
                        {car.brand} {car.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {car.seating_capacity} seats • {car.transmission}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="p-3 max-md:hidden">{car.category}</td>

                {/* Price */}
                <td className="p-3 font-medium text-gray-800">
                  {currency}
                  {car.pricePerDay}/day
                </td>

                {/* Status (Always Green) */}
                <td className="p-3 max-md:hidden">
                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">
                    Available
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex justify-center gap-4">
                    <button className="p-2 rounded-md border hover:bg-gray-100 transition">
                      <img
                        src={assets.eye_icon}
                        alt="view"
                        className="w-4"
                      />
                    </button>

                    <button className="p-2 rounded-md border border-red-200 hover:bg-red-50 transition">
                      <img
                        src={assets.delete_icon}
                        alt="delete"
                        className="w-4"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {cars.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                  No cars found
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
