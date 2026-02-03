import imagekit from "../configs/imageKit.js";
import { prisma } from "../configs/db.js";
import fs from "fs";

export const changeRoleToOwner = async (req, res) => {
    try {
        const { id } = req.user;
        await prisma.user.update({
            where: { id },
            data: { role: "owner" }
        })
        res.json({ success: true, message: "Now you can list cars" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const addCar = async (req, res) => {
    try {
        const { id } = req.user;
        let car = JSON.parse(req.body.carDate);
        const imageFile = req.file;

        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        })

        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });
        const image = optimizedImageUrl;

        // Prisma expects specific types, ensure year and seating_capacity are numbers
        await prisma.car.create({
            data: {
                ...car,
                year: Number(car.year),
                seating_capacity: Number(car.seating_capacity),
                ownerId: id,
                image
            }
        })

        res.json({ success: true, message: "Car Added" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

