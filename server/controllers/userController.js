import { prisma } from "../configs/db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendEmail from '../utils/sendEmail.js'
import imagekit from "../configs/imageKit.js";
import fs from "fs";

const generateToken = (userId) => {
    return jwt.sign(userId, process.env.JWT_SECRET)
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Please fill all the fields' })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' })
        }

        const userExists = await prisma.user.findUnique({ where: { email } })
        if (userExists) {
            return res.json({ success: false, message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                image: `https://ui-avatars.com/api/?name=${name.split(" ").join("+")}&background=random`
            }
        })
        const token = generateToken(user.id)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user.id)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get user data using token (JWT)
export const getUserData = async (req, res) => {
    try {
        const { user } = req;
        res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Book a car
export const bookCar = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { carId, pickupDate, returnDate, amount } = req.body;

        if (!carId || !pickupDate || !returnDate || !amount) {
            return res.json({ success: false, message: "Missing booking details" });
        }

        // Check if car exists and is available
        const car = await prisma.car.findUnique({ where: { id: carId } });
        console.log({ car })
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        if (!car.isAvailable) {
            return res.json({ success: false, message: "Car is not available" });
        }

        // Check for date conflicts
        const conflictingBookings = await prisma.booking.findMany({
            where: {
                carId,
                status: { not: 'cancelled' },
                OR: [
                    {
                        pickupDate: { lte: returnDate },
                        returnDate: { gte: pickupDate }
                    }
                ]
            }
        });

        if (conflictingBookings.length > 0) {
            const latestReturnDate = conflictingBookings.reduce((max, booking) =>
                booking.returnDate > max ? booking.returnDate : max
                , "");

            const dateObj = new Date(latestReturnDate);
            dateObj.setDate(dateObj.getDate() + 1);
            const nextAvailable = dateObj.toISOString().split('T')[0];
            const formattedDate = nextAvailable.split('-').reverse().join('/');

            return res.json({ success: false, message: `Car is already booked. Available from ${formattedDate}` });
        }

        const booking = await prisma.booking.create({
            data: {
                userId,
                carId,
                pickupDate,
                returnDate,
                amount: Number(amount)
            }
        });

        res.json({ success: true, message: "Booking initiated. Processing payment...", booking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get user's bookings
export const getUserBookings = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                car: {
                    include: { owner: { select: { name: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Cancel a booking
export const cancelBooking = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { bookingId } = req.body;

        const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        if (booking.status === 'cancelled') {
            return res.json({ success: false, message: "Booking already cancelled" });
        }

        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'cancelled' }
        });

        res.json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Pay for a booking
export const payBooking = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { bookingId } = req.body;

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { car: { include: { owner: true } }, user: true }
        });

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        if (booking.status === 'confirmed') {
            return res.json({ success: false, message: "Booking already paid/confirmed" });
        }

        if (booking.status === 'cancelled') {
            return res.json({ success: false, message: "Cannot pay for cancelled booking" });
        }

        // One last check: Is the car still available?
        const conflicts = await prisma.booking.findFirst({
            where: {
                carId: booking.carId,
                status: 'confirmed',
                id: { not: bookingId },
                OR: [
                    {
                        pickupDate: { lte: booking.returnDate },
                        returnDate: { gte: booking.pickupDate }
                    }
                ]
            }
        });

        if (conflicts) {
            return res.json({ success: false, message: "Car was booked by someone else during checkout. Payment refunded (Mock)." });
        }

        // Mock Payment Success - Update status
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'confirmed' },
            include: { car: true }
        });

        // Send Email
        const emailSubject = `Booking Confirmed: ${booking.car.brand} ${booking.car.model}`;
        const emailText = `Your booking is confirmed.\nTotal: ${booking.amount}`;

        sendEmail({
            to: booking.user.email,
            subject: emailSubject,
            text: emailText,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #0558FE;">
                    <h1 style="color: #0558FE; margin: 0;">Car Rental</h1>
                    <p style="color: #666; font-size: 14px; margin-top: 5px;">Your Journey Begins Here</p>
                </div>

                <div style="padding: 30px 0; text-align: center;">
                    <h2 style="color: #333; margin-top: 0;">Booking Confirmed!</h2>
                    <p style="color: #555; font-size: 16px; line-height: 1.5;">
                        Hello <strong>\${booking.user.name}</strong>,<br>
                        Your payment of <strong style="color: #0558FE;">₹\${booking.amount}</strong> was successful.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: left;">
                        <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 0;">Vehicle Details</h3>
                        <p style="margin: 8px 0;"><strong>Car:</strong> \${booking.car.brand} \${booking.car.model} (\${booking.car.year})</p>
                        <p style="margin: 8px 0;"><strong>Category:</strong> \${booking.car.category}</p>
                        <p style="margin: 8px 0;"><strong>Location:</strong> \${booking.car.location}</p>
                        
                        <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 20px;">Rental Period</h3>
                        <p style="margin: 8px 0;"><strong>Pickup:</strong> \${booking.pickupDate}</p>
                        <p style="margin: 8px 0;"><strong>Return:</strong> \${booking.returnDate}</p>
                    </div>

                    <p style="font-size: 14px; color: #888;">Ticket ID: \${booking.id}</p>
                </div>

                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #aaa; font-size: 12px;">
                    <p>&copy; \${new Date().getFullYear()} Car Rental Inc. All rights reserved.</p>
                </div>
            </div>
            `
        });

        res.json({ success: true, message: "Payment Successful & Email Sent!", booking: updatedBooking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Update user image
export const updateImage = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Please upload an image" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        });

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '500' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        await prisma.user.update({
            where: { id: userId },
            data: { image: optimizedImageUrl }
        });

        // Clean up temp file
        fs.unlinkSync(imageFile.path);

        res.json({ success: true, message: "Image Updated Successfully!", imageUrl: optimizedImageUrl });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Forgot Password - Send Mock OTP
export const forgotPassword = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.json({ success: false, message: "Phone number is required" });
        }

        const user = await prisma.user.findFirst({ where: { phone } });
        if (!user) {
            return res.json({ success: false, message: "User not found with this phone number" });
        }

        // In a real app, send OTP via SMS here
        res.json({ success: true, message: "OTP sent to your phone number: 123456" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Reset Password - Verify Mock OTP & Update
export const resetPassword = async (req, res) => {
    try {
        const { phone, otp, newPassword } = req.body;

        if (!phone || !otp || !newPassword) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        if (otp !== "123456") {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        const user = await prisma.user.findFirst({ where: { phone } });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        res.json({ success: true, message: "Password reset successfully!" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}