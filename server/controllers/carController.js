import { prisma } from "../configs/db.js";

// Get all available cars (public)
export const listCars = async (req, res) => {
    try {
        const cars = await prisma.car.findMany({
            where: { isAvailable: true },
            include: { owner: { select: { name: true, image: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get single car details (public)
export const carDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await prisma.car.findUnique({
            where: { id },
            include: { owner: { select: { name: true, image: true } } }
        });
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        res.json({ success: true, car });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Search cars with filters (public)
export const searchCars = async (req, res) => {
    try {
        const { brand, category, transmission, fuel_type, minPrice, maxPrice, location } = req.query;

        const where = { isAvailable: true };

        if (brand) where.brand = { contains: brand, mode: 'insensitive' };
        if (category) where.category = category;
        if (transmission) where.transmission = transmission;
        if (fuel_type) where.fuel_type = fuel_type;
        if (location) where.location = { contains: location, mode: 'insensitive' };

        const cars = await prisma.car.findMany({
            where,
            include: { owner: { select: { name: true, image: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // Filter by price range (pricePerDay is stored as string)
        let filteredCars = cars;
        if (minPrice || maxPrice) {
            filteredCars = cars.filter(car => {
                const price = parseInt(car.pricePerDay);
                if (minPrice && price < parseInt(minPrice)) return false;
                if (maxPrice && price > parseInt(maxPrice)) return false;
                return true;
            });
        }

        res.json({ success: true, cars: filteredCars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
