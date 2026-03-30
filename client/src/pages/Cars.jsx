import React, { useContext, useState, useEffect, useRef } from 'react'
import Title from '../components/Title'
import CarCard from '../components/CarCard'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import Loader from '../components/Loader'
import { useSearchParams } from 'react-router-dom';

const Cars = () => {
  const { allCars, pagination, fetchAllCars, searchCars, loading } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || ''
  });

  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  // debouncedSearch is the value that actually triggers API calls — avoids firing on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const isFirstRender = useRef(true);

  // Debounce: update debouncedSearch 400ms after the user stops typing
  // Also resets page to 1 when search changes (but NOT on initial mount)
  useEffect(() => {
    if (isFirstRender.current) return; // skip on mount — don't reset page
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Mark first render as done after mount
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  // Main effect: fires when page, filters, debounced search, or URL date params change
  useEffect(() => {
    const pickupDate = searchParams.get('pickupDate');
    const returnDate = searchParams.get('returnDate');
    const location = searchParams.get('location');

    searchCars({
      search: debouncedSearch,
      category: filters.category,
      sortBy: filters.sortBy,
      page: currentPage,
      limit: 9,
      location,
      pickupDate,
      returnDate
    });

    // Sync URL
    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearch) newParams.set('search', debouncedSearch); else newParams.delete('search');
    if (filters.category) newParams.set('category', filters.category); else newParams.delete('category');
    if (filters.sortBy) newParams.set('sortBy', filters.sortBy); else newParams.delete('sortBy');
    if (currentPage > 1) newParams.set('page', String(currentPage)); else newParams.delete('page');
    setSearchParams(newParams, { replace: true });

  }, [filters, currentPage, debouncedSearch, searchParams.get('pickupDate'), searchParams.get('returnDate'), searchParams.get('location')]);

  const clearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setFilters({ category: '', sortBy: '' });
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const dateFilterActive = searchParams.get('pickupDate') && searchParams.get('returnDate');

  return (
    <div>
      <div className='flex flex-col items-center py-12 md:py-20 bg-light px-4 sm:px-8'>
        <Title
          title={dateFilterActive ? 'Available Cars for Your Dates' : 'Available Cars'}
          subTitle={dateFilterActive
            ? `Showing cars available from ${searchParams.get('pickupDate')} to ${searchParams.get('returnDate')}`
            : 'Browse our selection of premium vehicles available for your next adventure'
          }
        />

        {/* Search Bar & Filters */}
        <div className='bg-white rounded-2xl mt-8 md:mt-10 p-4 md:p-6 shadow-md w-full max-w-4xl'>
          <div className='flex flex-col lg:flex-row items-center gap-4'>
            <div className='w-full lg:flex-1'>
              <div className='flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-primary transition-all duration-300'>
                <img src={assets.search_icon} alt="" className='w-4 opacity-50' />
                <input
                  type="text"
                  placeholder="Search brand, model, or location..."
                  className='outline-none w-full text-sm'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className='flex flex-row items-center gap-2 w-full lg:w-auto'>
              <select
                className='flex-1 lg:flex-none border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm bg-transparent focus:border-primary transition-all duration-300'
                value={filters.category}
                onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setCurrentPage(1); }}
              >
                <option value="">Categories</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
                <option value="Sports">Sports</option>
              </select>

              <select
                className='flex-1 lg:flex-none border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-sm bg-transparent focus:border-primary transition-all duration-300'
                value={filters.sortBy}
                onChange={(e) => { setFilters({ ...filters, sortBy: e.target.value }); setCurrentPage(1); }}
              >
                <option value="">Sort By</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
                <option value="newest">Newest First</option>
              </select>

              {(searchInput || filters.category || filters.sortBy || dateFilterActive) && (
                <button
                  onClick={clearFilters}
                  className='hidden sm:block text-xs text-red-500 hover:text-red-600 font-medium ml-2 whitespace-nowrap'
                >
                  Clear all
                </button>
              )}
            </div>

            {(searchInput || filters.category || filters.sortBy || dateFilterActive) && (
              <button
                onClick={clearFilters}
                className='sm:hidden text-xs text-red-500 hover:text-red-600 font-medium'
              >
                Clear all filters
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
            <div className='flex justify-between items-center mb-6'>
              <p className='text-gray-500'>
                Showing {allCars.length} of {pagination.total} {pagination.total === 1 ? 'Car' : 'Cars'}
              </p>
            </div>

            {allCars.length === 0 ? (
              <div className='text-center py-20'>
                <img src={assets.car_icon} alt="" className='w-16 mx-auto opacity-20 mb-4' />
                <p className='text-gray-400'>No cars found matching your criteria</p>
                <button onClick={clearFilters} className='mt-4 text-primary hover:underline'>
                  View All Cars
                </button>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 max-w-7xl mx-auto'>
                  {allCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>

                {/* Pagination UI */}
                {pagination.totalPages > 1 && (
                  <div className='flex justify-center items-center gap-2 mt-16 flex-wrap'>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? 'text-gray-300 border-gray-100 cursor-not-allowed' : 'text-gray-600 border-gray-200 hover:border-primary hover:text-primary'} transition-all duration-300`}
                    >
                      Previous
                    </button>

                    {(() => {
                      const totalPages = pagination.totalPages;
                      const pages = [];
                      const showEllipsis = totalPages > 7;

                      if (!showEllipsis) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        // Logic for truncated pagination: 1 ... curr-1 curr curr+1 ... last
                        pages.push(1);

                        let start = Math.max(2, currentPage - 1);
                        let end = Math.min(totalPages - 1, currentPage + 1);

                        if (currentPage <= 3) {
                          end = 4;
                        } else if (currentPage >= totalPages - 2) {
                          start = totalPages - 3;
                        }

                        if (start > 2) pages.push('...');
                        for (let i = start; i <= end; i++) pages.push(i);
                        if (end < totalPages - 1) pages.push('...');

                        pages.push(totalPages);
                      }

                      return pages.map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                          className={`w-10 h-10 rounded-lg border transition-all duration-300 ${page === '...' ? 'cursor-default border-transparent' : (currentPage === page ? 'bg-primary border-primary text-white' : 'text-gray-600 border-gray-200 hover:border-primary hover:text-primary')}`}
                        >
                          {page}
                        </button>
                      ));
                    })()}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className={`px-4 py-2 rounded-lg border ${currentPage === pagination.totalPages ? 'text-gray-300 border-gray-100 cursor-not-allowed' : 'text-gray-600 border-gray-200 hover:border-primary hover:text-primary'} transition-all duration-300`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Cars
