import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCar = () => {
  const { backendUrl, token, fetchAllCars } = useContext(AppContext);
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.warn("Please upload a car image");
      return;
    }

    // Validate required fields
    const { brand, model, year, pricePerDay, category, transmission, fuel_type, seating_capacity } = formData;
    if (!brand || !model || !year || !pricePerDay || !category || !transmission || !fuel_type || !seating_capacity) {
      toast.warn("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const dataToSend = new FormData();
      dataToSend.append('image', image);
      dataToSend.append('carDate', JSON.stringify({
        ...formData,
        year: Number(formData.year),
        seating_capacity: Number(formData.seating_capacity)
      }));

      const { data } = await axios.post(backendUrl + '/api/owner/add-car', dataToSend, {
        headers: {
          authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        toast.success(data.message);
        fetchAllCars();
        navigate('/owner/manage-cars');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pt-10 w-full max-w-3xl">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Car</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-xl">
          Fill in details to list a new car for booking.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-borderColor rounded-xl p-6 md:p-8 shadow-sm">
        {/* Image Upload */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Upload Car Image *</p>
          <label className="w-full flex flex-col items-center justify-center gap-2 border border-borderColor rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition">
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
                className="w-48 h-32 object-cover rounded-md"
              />
            ) : (
              <>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50">
                  <img src={assets.upload_icon} alt="" className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-400">Click to upload car image</p>
              </>
            )}
          </label>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Brand *</label>
            <input
              required
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g. BMW"
              className="border border-borderColor rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Model *</label>
            <input
              required
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g. X5"
              className="border border-borderColor rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Year *</label>
            <input
              required
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="2025"
              className="border border-borderColor rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Price per Day ($) *</label>
            <input
              required
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              placeholder="100"
              className="border border-borderColor rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Category *</label>
            <select
              required
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border border-borderColor rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="">Select</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Hatchback</option>
              <option>Luxury</option>
              <option>Sports</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Transmission *</label>
            <select
              required
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="border border-borderColor rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="">Select</option>
              <option>Automatic</option>
              <option>Manual</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Fuel Type *</label>
            <select
              required
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              className="border border-borderColor rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white"
            >
              <option value="">Select</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Seating Capacity *</label>
            <input
              required
              type="number"
              name="seating_capacity"
              value={formData.seating_capacity}
              onChange={handleChange}
              placeholder="5"
              className="border border-borderColor rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York"
              className="border border-borderColor rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your car..."
            rows="3"
            className="w-full mt-1 border border-borderColor rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-blue-700 text-white font-bold px-10 py-3 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Adding...' : '+ List Your Car'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCar;
