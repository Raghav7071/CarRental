import React, { useState } from "react";
import { assets } from "../../assets/assets";

const AddCar = () => {
  const [image, setImage] = useState(null);

  return (
    <div className="flex-1 px-6 md:px-10 py-8 bg-[#F9FAFB] min-h-screen">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Add New Car
        </h1>
        <p className="text-sm text-gray-500 mt-1 max-w-xl">
          Fill in details to list a new car for booking, including pricing,
          availability, and car specifications.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 max-w-3xl shadow-sm">
        {/* Upload */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Upload a picture of your car
          </p>

          <label className="w-full flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-28 h-20 object-cover rounded-md"
              />
            ) : (
              <>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50">
                  <img
                    src={assets.upload_icon || assets.uploadIcon || assets.cloud_upload}
                    alt=""
                    className="w-5 h-5"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Click to upload car image
                </p>
              </>
            )}
          </label>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Brand */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Brand</label>
            <input
              type="text"
              placeholder="e.g. BMW, Mercedes, Audi..."
              className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Model */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Model</label>
            <input
              type="text"
              placeholder="e.g. X5, E-Class, M4..."
              className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Year */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Year</label>
            <input
              type="number"
              placeholder="2025"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Daily Price */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              Daily Price ($)
            </label>
            <input
              type="number"
              placeholder="100"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              Category
            </label>
            <select className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white">
              <option value="">Select</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Hatchback</option>
              <option>Luxury</option>
              <option>Sports</option>
            </select>
          </div>

          {/* Transmission */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              Transmission
            </label>
            <select className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white">
              <option value="">Select</option>
              <option>Automatic</option>
              <option>Manual</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              Fuel Type
            </label>
            <select className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 bg-white">
              <option value="">Select</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>

          {/* Seating Capacity */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">
              Seating Capacity
            </label>
            <input
              type="number"
              placeholder="5"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1 md:col-span-3">
            <label className="text-xs font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. San Francisco, CA"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1 md:col-span-3">
            <label className="text-xs font-semibold text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Describe your car, its condition, and any notable details..."
              className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 resize-none"
            />
          </div>
        </div>

        {/* Button */}
        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md text-sm transition">
            + List Your Car
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
