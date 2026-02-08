import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets";

const Payment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { backendUrl, token, currency } = useContext(AppContext);
    const booking = state?.booking;

    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: "",
        name: "",
    });

    useEffect(() => {
        if (!token || !booking) {
            navigate("/");
        }
    }, [token, booking, navigate]);

    const handleChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Basic mock validation
            if (cardDetails.number.length < 16 || cardDetails.cvv.length < 3) {
                toast.error("Invalid Card Details (Mock: Use 16 digits)");
                setLoading(false);
                return;
            }

            const { data } = await axios.post(
                backendUrl + "/api/user/pay-booking",
                { bookingId: booking.id },
                { headers: { authorization: token } }
            );

            if (data.success) {
                toast.success("Payment Successful!");
                navigate("/booking-confirmation", { state: { booking: data.booking } });
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

    if (!booking) return null;

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-10 bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full border border-borderColor">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Secure Payment</h2>

                <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-500 mb-1">Total Amount to Pay</p>
                    <p className="text-3xl font-black text-primary">{currency}{booking.amount}</p>
                    <p className="text-xs text-gray-400 mt-2">For {booking.car?.brand} {booking.car?.model}</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                            type="text"
                            name="number"
                            placeholder="0000 0000 0000 0000"
                            maxLength="19"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            value={cardDetails.number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                                type="text"
                                name="expiry"
                                placeholder="MM/YY"
                                maxLength="5"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                value={cardDetails.expiry}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                                type="password"
                                name="cvv"
                                placeholder="123"
                                maxLength="3"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                value={cardDetails.cvv}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            value={cardDetails.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary-dull transition-all shadow-lg shadow-primary/30 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Processing..." : `Pay ${currency}${booking.amount}`}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
                    {assets.check_icon && <img src={assets.check_icon} className="w-3" alt="" />}
                    Secured by MockPay
                </p>
            </div>
        </div>
    );
};

export default Payment;
