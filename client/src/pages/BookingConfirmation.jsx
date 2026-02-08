import React, { useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const BookingConfirmation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { currency } = useContext(AppContext);
    const booking = state?.booking;
    const ticketRef = useRef();

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p>No booking details found.</p>
                <button onClick={() => navigate('/')} className="text-primary hover:underline">Go Home</button>
            </div>
        )
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 flex flex-col items-center bg-gray-50">
            <div className="text-center mb-8 animate-fade-in-up">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h1>
                <p className="text-gray-500 mt-2">A confirmation email has been sent to you.</p>
            </div>

            {/* Ticket Card */}
            <div ref={ticketRef} className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-borderColor print:shadow-none print:border-none">
                <div className="bg-primary px-6 py-4 flex justify-between items-center text-white">
                    <span className="font-bold tracking-widest uppercase text-sm">CarRental Ticket</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">#{booking.id.slice(-6).toUpperCase()}</span>
                </div>

                <div className="p-6 relative">
                    {/* Watermark/Background decoration could go here */}

                    <div className="border-b border-dashed border-gray-200 pb-6 mb-6">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Vehicle</p>
                        <h2 className="text-2xl font-bold text-gray-800">{booking.car?.brand} {booking.car?.model}</h2>
                        <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            {booking.car?.category} ({booking.car?.year})
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Pickup</p>
                            <p className="font-semibold text-gray-700">{booking.pickupDate}</p>
                            <p className="text-xs text-gray-500">{booking.car?.location}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Return</p>
                            <p className="font-semibold text-gray-700">{booking.returnDate}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Total Paid</p>
                            <p className="text-xl font-bold text-primary">{currency}{booking.amount}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-green-600 font-bold uppercase bg-green-100 px-2 py-0.5 rounded">Paid via Card</p>
                        </div>
                    </div>
                </div>

                {/* Perforated edge effect */}
                <div className="relative h-4 bg-gray-100 flex items-center justify-between px-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    ))}
                </div>

                <div className="bg-gray-50 p-6 text-center">
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${booking.id}`}
                        alt="QR"
                        className="w-24 h-24 mx-auto mix-blend-multiply opacity-80"
                    />
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Scan at counter</p>
                </div>
            </div>

            <div className="mt-8 flex gap-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-black transition-all shadow-lg hover:shadow-xl"
                >
                    Download Ticket
                </button>
                <button
                    onClick={() => navigate('/my-bookings')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default BookingConfirmation;
