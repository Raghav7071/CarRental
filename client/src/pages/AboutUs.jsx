import React from 'react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        Welcome to our Premium Car Rental service. We are dedicated to providing you with the best experience in luxury and everyday vehicle rentals.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        Our mission is to make car rental simple, transparent, and enjoyable. Whether you need a sleek sedan for a business trip, a spacious SUV for a family vacation, or a high-performance luxury car for a special occasion, we've got you covered.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        With a wide selection of vehicles and a commitment to exceptional customer service, we strive to be your first choice for car rentals.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
