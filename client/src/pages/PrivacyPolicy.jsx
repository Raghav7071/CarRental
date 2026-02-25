import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-600 leading-relaxed">
                    <p className="mb-4">We value your privacy and are committed to protecting your personal information.</p>
                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Data Collection</h2>
                    <p className="mb-4">We collect information necessary to provide our car rental services, including name, contact details, and payment information.</p>
                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Data Usage</h2>
                    <p className="mb-4">Your data is used to process bookings, verify identity, and improve our services.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
