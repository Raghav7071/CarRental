import { assets } from '../assets/assets';
import Title from './Title';

const Testimonial = () => {


    const testimonials = [
        {
            name: "Shreya Jain",
            location: "Pune,Maharastra",
            image: assets.testimonial_image_1,
            testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional."
        },
        {
            name: "Shena shukla",
            location: "Mumbai,Maharastra",
            image: assets.testimonial_image_2,
            testimonial: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic"
        },
        {
            name: "Parul Soni",
            location: "Noida,Uttarpradesh",
            image: assets.testimonial_image_1,
            testimonial: "I highly recommend CarRental Their fleet is amazing, and always feel like I'm getting the best deal with excellent service"
        }


    ];


    return (
        <div className="py-12 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
            <Title
                title='What Our Customers Say'
                subTitle='Discover why discerning travelers choose our service for their luxury car rentals around the world.'
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10 md:mt-18 max-w-[1200px] mx-auto">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img key={index} src={assets.star_icon} alt='start_icon' />

                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial