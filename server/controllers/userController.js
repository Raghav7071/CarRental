import { prisma } from "../configs/db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
            data: { name, email, password: hashedPassword }
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
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        if (!car.isAvailable) {
            return res.json({ success: false, message: "Car is not available" });
        }

        // Check for date conflicts
        const existingBooking = await prisma.booking.findFirst({
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

        if (existingBooking) {
            return res.json({ success: false, message: "Car is already booked for these dates" });
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

        res.json({ success: true, message: "Car Booked Successfully!", booking });
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