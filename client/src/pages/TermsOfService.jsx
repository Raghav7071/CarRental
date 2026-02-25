import React from 'react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed">
                    <p className="mb-4">By using our platform, you agree to abide by our terms and conditions.</p>
                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Eligibility</h2>
                    <p className="mb-4">You must be at least 18 years old and possess a valid driver's license to rent a vehicle.</p>
                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Booking and Cancellation</h2>
                    <p className="mb-4">Bookings are subject to availability and verification. Cancellation policies apply as stated during the booking process.</p>
                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Vehicle Usage</h2>
                    <p>Vehicles must be used responsibly and in accordance with all local laws and regulations.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
