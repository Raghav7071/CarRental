import React from 'react';

const HelpCenter = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-primary">Booking Help</h2>
                        <ul className="space-y-3 text-gray-600">
                            <li>How to book a car?</li>
                            <li>Can I cancel my booking?</li>
                            <li>How to modify pick-up/return dates?</li>
                        </ul>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-primary">Payment & Pricing</h2>
                        <ul className="space-y-3 text-gray-600">
                            <li>What payment methods are accepted?</li>
                            <li>When will I be charged?</li>
                            <li>Are there any hidden fees?</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
