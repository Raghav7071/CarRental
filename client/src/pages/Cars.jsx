import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CarCard from '../components/CarCard'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import Loader from '../components/Loader'
import { useSearchParams } from 'react-router-dom';

const Cars = () => {
  const { allCars, fetchAllCars, searchCars, loading } = useContext(AppContext);
  const [searchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('location') || '');
  const [filters, setFilters] = useState({
    category: '',
    transmission: '',
    fuel_type: ''
  });
  const [sortBy, setSortBy] = useState('');

  // Initial fetch with query params if present
  useEffect(() => {
    const pickupDate = searchParams.get('pickupDate');
    const returnDate = searchParams.get('returnDate');
    const location = searchParams.get('location');

    if (pickupDate && returnDate) {
      // If dates are present, trigger a server-side search for availability checking
      searchCars({
        location: location || '',
        pickupDate,
        returnDate
      });
    } else {
      // Otherwise just fetch all cars (or use existing allCars if already loaded and no specific search)
      fetchAllCars();
    }
  }, [searchParams]);

  // Filter and sort cars locally (for other attributes)
  const getFilteredCars = () => {
    let filtered = [...allCars];

    // Search by brand or model
    if (searchInput) {
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(searchInput.toLowerCase()) ||
        car.model.toLowerCase().includes(searchInput.toLowerCase()) ||
        car.location.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(car => car.category === filters.category);
    }
    if (filters.transmission) {
      filtered = filtered.filter(car => car.transmission === filters.transmission);
    }
    if (filters.fuel_type) {
      filtered = filtered.filter(car => car.fuel_type === filters.fuel_type);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => parseInt(a.pricePerDay) - parseInt(b.pricePerDay));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => parseInt(b.pricePerDay) - parseInt(a.pricePerDay));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({ category: '', transmission: '', fuel_type: '' });
    setSortBy('');
    fetchAllCars(); // Reset to all cars
  };

  const filteredCars = getFilteredCars();

  // Display date filter info if active
  const dateFilterActive = searchParams.get('pickupDate') && searchParams.get('returnDate');

  return (
    <div>
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title
          title={dateFilterActive ? 'Available Cars for Your Dates' : 'Available Cars'}
          subTitle={dateFilterActive
            ? `Showing cars available from ${searchParams.get('pickupDate')} to ${searchParams.get('returnDate')}`
            : 'Browse our selection of premium vehicles available for your next adventure'
          }
        />

        {/* Search Bar */}
        <div className='bg-white rounded-xl mt-10 p-4 shadow-md w-full max-w-3xl'>
          <div className='flex items-center gap-4 flex-wrap'>
            <div className='flex-1 min-w-[200px]'>
              <div className='flex items-center gap-2 border rounded-lg px-4 py-2'>
                <img src={assets.searchIcon} alt="" className='w-5 opacity-50' />
                <input
                  type="text"
                  placeholder="Search by brand, model, or location..."
                  className='outline-none w-full'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <select
              className='border rounded-lg px-4 py-2 outline-none'
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports">Sports</option>
            </select>

            <select
              className='border rounded-lg px-4 py-2 outline-none'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>

            {(searchInput || filters.category || filters.transmission || filters.fuel_type || sortBy || dateFilterActive) && (
              <button
                onClick={clearFilters}
                className='text-sm text-red-500 hover:underline'
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10 pb-20'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <p className='text-gray-500'>
              Showing {filteredCars.length} {filteredCars.length === 1 ? 'Car' : 'Cars'}
            </p>

            {filteredCars.length === 0 ? (
              <div className='text-center py-20'>
                <img src={assets.car_icon} alt="" className='w-16 mx-auto opacity-20 mb-4' />
                <p className='text-gray-400'>No cars found matching your criteria</p>
                <button onClick={clearFilters} className='mt-4 text-primary hover:underline'>
                  View All Cars
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 max-w-7xl mx-auto'>
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Cars
