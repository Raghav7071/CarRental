import React from 'react';

const Insurance = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Insurance Information</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 leading-relaxed text-gray-600">
                    <p className="mb-4 text-lg">Your safety and peace of mind are our priorities. All rentals include basic insurance coverage.</p>
                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Coverage Options</h2>
                    <ul className="list-disc pl-5 space-y-3">
                        <li><strong>Basic Coverage:</strong> Included in all rentals, covers basic liability.</li>
                        <li><strong>Premium Protection:</strong> Lowers your deductible and provides comprehensive coverage.</li>
                        <li><strong>Personal Accident Insurance:</strong> Provides additional medical coverage for you and your passengers.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Insurance;
