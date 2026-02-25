import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

export const Footer = () => {
    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'>
            <div className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b'>
                <div>
                    <Link to='/'>
                        <img src={assets.logo} alt='logo' className='h-8 md:h-9 hover:scale-105 transition-all duration-300 cursor-pointer' />
                    </Link>
                    <p className='max-w-xs mt-3'>
                        Premium car rental service with a wide selection of luxury and everyday vehicles for all your driving needs
                    </p>
                    <div className='flex items-center gap-3 mt-6'>
                        <a href='#'><img src={assets.facebook_logo} className="w-5 h-5 hover:scale-110 transition-transform" /></a>
                        <a href='#'><img src={assets.instagram_logo} className="w-5 h-5 hover:scale-110 transition-transform" /></a>
                        <a href='#'><img src={assets.twitter_logo} className="w-5 h-5 hover:scale-110 transition-transform" /></a>
                        <a href='#'><img src={assets.gmail_logo} className="w-5 h-5 hover:scale-110 transition-transform" /></a>
                    </div>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                        <li><Link to="/cars" className="hover:text-primary transition-colors">Browse Cars</Link></li>
                        <li><Link to="/owner/add-car" className="hover:text-primary transition-colors">List Your Car</Link></li>
                        <li><Link to="/about-us" className="hover:text-primary transition-colors">About Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><Link to="/help-center" className="hover:text-primary transition-colors">Help Center</Link></li>
                        <li><Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/insurance" className="hover:text-primary transition-colors">Insurance</Link></li>
                    </ul>
                </div>
                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li>1234 Luxury Drive</li>
                        <li>Lohegao Pune, Maharastra</li>
                        <li>9559455544</li>
                        <li>random@random.random</li>
                    </ul>
                </div>
            </div>

            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} Raghav. All rights reserved</p>
                <ul className='flex items-center gap-4'>
                    <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link></li>
                    <li>|</li>
                    <li><Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms</Link></li>
                    <li>|</li>
                    <li><Link to="#" className="hover:text-primary transition-colors">Cookies</Link></li>
                </ul>
            </div>
        </div>
    )
}
