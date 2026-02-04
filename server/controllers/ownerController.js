import imagekit from "../configs/imageKit.js";
import { prisma } from "../configs/db.js";
import fs from "fs";

// Change user role to owner
export const changeRoleToOwner = async (req, res) => {
    try {
        const { id } = req.user;
        await prisma.user.update({
            where: { id },
            data: { role: "owner" }
        });
        res.json({ success: true, message: "Now you can list cars" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Add a new car
export const addCar = async (req, res) => {
    try {
        const { id } = req.user;
        let car = JSON.parse(req.body.carDate);
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Please upload a car image" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        });

        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        await prisma.car.create({
            data: {
                brand: car.brand,
                model: car.model,
                year: Number(car.year),
                category: car.category,
                transmission: car.transmission,
                fuel_type: car.fuel_type,
                seating_capacity: Number(car.seating_capacity),
                pricePerDay: car.pricePerDay,
                location: car.location || "Available",
                description: car.description || "",
                ownerId: id,
                image: optimizedImageUrl
            }
        });

        // Clean up temp file
        fs.unlinkSync(imageFile.path);

        res.json({ success: true, message: "Car Added Successfully!" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get owner's cars
export const getOwnerCars = async (req, res) => {
    try {
        const { id: ownerId } = req.user;
        const cars = await prisma.car.findMany({
            where: { ownerId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete a car
export const deleteCar = async (req, res) => {
    try {
        const { id: ownerId } = req.user;
        const { carId } = req.body;

        const car = await prisma.car.findUnique({ where: { id: carId } });

        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        if (car.ownerId !== ownerId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Check if car has active bookings
        const activeBookings = await prisma.booking.findFirst({
            where: { carId, status: { in: ['pending', 'confirmed'] } }
        });

        if (activeBookings) {
            return res.json({ success: false, message: "Cannot delete car with active bookings" });
        }

        await prisma.car.delete({ where: { id: carId } });
        res.json({ success: true, message: "Car deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const { id: ownerId } = req.user;
        const { carId } = req.body;

        const car = await prisma.car.findUnique({ where: { id: carId } });

        if (!car || car.ownerId !== ownerId) {
            return res.json({ success: false, message: "Car not found or unauthorized" });
        }

        await prisma.car.update({
            where: { id: carId },
            data: { isAvailable: !car.isAvailable }
        });

        res.json({ success: true, message: `Car is now ${!car.isAvailable ? 'available' : 'unavailable'}` });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get bookings for owner's cars
export const getOwnerBookings = async (req, res) => {
    try {
        const { id: ownerId } = req.user;
        const bookings = await prisma.booking.findMany({
            where: { car: { ownerId } },
            include: {
                user: { select: { name: true, email: true, image: true } },
                car: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Update booking status (confirm/cancel)
export const updateBookingStatus = async (req, res) => {
    try {
        const { id: ownerId } = req.user;
        const { bookingId, status } = req.body;

        if (!['confirmed', 'cancelled'].includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { car: true }
        });

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.car.ownerId !== ownerId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        await prisma.booking.update({
            where: { id: bookingId },
            data: { status }
        });

        res.json({ success: true, message: `Booking ${status}` });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const { id: ownerId } = req.user;

        const totalCars = await prisma.car.count({ where: { ownerId } });

        const bookings = await prisma.booking.findMany({
            where: { car: { ownerId } },
            include: { car: true, user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });

        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

        // Calculate total revenue from confirmed bookings
        const totalRevenue = bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + b.amount, 0);

        // Get recent bookings (last 5)
        const recentBookings = bookings.slice(0, 5);

        res.json({
            success: true,
            stats: {
                totalCars,
                totalBookings,
                pendingBookings,
                confirmedBookings,
                cancelledBookings,
                totalRevenue,
                recentBookings
            }
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
