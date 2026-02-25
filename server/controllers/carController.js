import { prisma } from "../configs/db.js";

// Get all available cars with pagination (public)
export const listCars = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const [cars, total] = await Promise.all([
            prisma.car.findMany({
                where: { isAvailable: true },
                include: { owner: { select: { name: true, image: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.car.count({ where: { isAvailable: true } })
        ]);

        res.json({
            success: true,
            cars,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
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

// Search cars with filters and pagination (public)
export const searchCars = async (req, res) => {
    try {
        const {
            brand, category, transmission, fuel_type,
            minPrice, maxPrice, location, pickupDate, returnDate,
            sortBy, page, limit, search
        } = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 9;
        const skip = (pageNum - 1) * limitNum;

        const where = { isAvailable: true };

        if (brand) where.brand = { contains: brand, mode: 'insensitive' };
        if (search) {
            where.OR = [
                { brand: { contains: search, mode: 'insensitive' } },
                { model: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category) where.category = category;
        if (transmission) where.transmission = transmission;
        if (fuel_type) where.fuel_type = fuel_type;
        if (location) where.location = { contains: location, mode: 'insensitive' };

        // Date Availability Filter
        if (pickupDate && returnDate) {
            const overlappingBookings = await prisma.booking.findMany({
                where: {
                    status: 'confirmed',
                    OR: [
                        {
                            pickupDate: { lte: returnDate },
                            returnDate: { gte: pickupDate }
                        }
                    ]
                },
                select: { carId: true }
            });

            const bookedCarIds = overlappingBookings.map(b => b.carId);
            if (bookedCarIds.length > 0) {
                where.id = { notIn: bookedCarIds };
            }
        }

        // Sorting
        let orderBy = { createdAt: 'desc' };
        if (sortBy === 'price-low') orderBy = { pricePerDay: 'asc' };
        else if (sortBy === 'price-high') orderBy = { pricePerDay: 'desc' };
        else if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

        // We can't easily filter by pricePerDay in Prisma because it's a String in this schema
        // and Prisma doesn't support casting in 'where' for some dialects/versions easily.
        // However, we'll try to fetch all matching 'where' and then handle price filter and pagination.
        // If price filter is NOT present, we can do DB pagination.

        let cars;
        let total;

        if (minPrice || maxPrice) {
            // Fetch all and filter in JS if price filter is used (due to string type)
            const allMatchingCars = await prisma.car.findMany({
                where,
                include: { owner: { select: { name: true, image: true } } },
                orderBy
            });

            let filteredCars = allMatchingCars.filter(car => {
                const price = parseInt(car.pricePerDay);
                if (minPrice && price < parseInt(minPrice)) return false;
                if (maxPrice && price > parseInt(maxPrice)) return false;
                return true;
            });

            total = filteredCars.length;
            cars = filteredCars.slice(skip, skip + limitNum);
        } else {
            // DB pagination
            [cars, total] = await Promise.all([
                prisma.car.findMany({
                    where,
                    include: { owner: { select: { name: true, image: true } } },
                    orderBy,
                    skip,
                    take: limitNum
                }),
                prisma.car.count({ where })
            ]);
        }

        res.json({
            success: true,
            cars,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
