import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const currency = import.meta.env.VITE_CURRENCY || "₹";

    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const [userData, setUserData] = useState(null);
    const [allCars, setAllCars] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all available cars
    const fetchAllCars = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(backendUrl + '/api/car/list');
            if (data.success) {
                setAllCars(data.cars);
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

    // Search cars with filters
    const searchCars = async (filters) => {
        try {
            setLoading(true);

            // Clean undefined/null values
            Object.keys(filters).forEach(key =>
                (filters[key] === undefined || filters[key] === null || filters[key] === '') && delete filters[key]
            );

            const params = new URLSearchParams(filters);
            const { data } = await axios.get(backendUrl + '/api/car/search?' + params);
            if (data.success) {
                setAllCars(data.cars);
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

    // Load user data
    const loadUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-data', {
                headers: { authorization: token }
            });
            if (data.success) {
                setUserData(data.user);
            } else {
                // Token invalid, clear it
                setToken("");
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.log(error);
            setToken("");
            localStorage.removeItem('token');
        }
    };

    // Book a car
    const bookCar = async (carId, pickupDate, returnDate, amount) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-car',
                { carId, pickupDate, returnDate, amount },
                { headers: { authorization: token } }
            );
            if (data.success) {
                toast.success(data.message);
                return data;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            return false;
        }
    };

    // Get user bookings
    const getUserBookings = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/my-bookings', {
                headers: { authorization: token }
            });
            if (data.success) {
                return data.bookings;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    // Cancel booking
    const cancelBooking = async (bookingId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-booking',
                { bookingId },
                { headers: { authorization: token } }
            );
            if (data.success) {
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            return false;
        }
    };

    const value = {
        backendUrl,
        currency,
        token,
        setToken,
        userData,
        setUserData,
        loadUserData,
        allCars,
        setAllCars,
        fetchAllCars,
        searchCars,
        loading,
        bookCar,
        getUserBookings,
        cancelBooking
    };

    useEffect(() => {
        fetchAllCars();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserData();
        } else {
            setUserData(null);
        }
    }, [token]);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
