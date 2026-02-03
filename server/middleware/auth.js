
import jwt from "jsonwebtoken";
import { prisma } from "../configs/db.js";

export const protect = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.json({ success: false, message: "not authorized" })
    }
    try {
        const userId = jwt.verify(token, process.env.JWT_SECRET)
        if (!userId) {
            return res.json({ success: false, message: "not authorized" })
        }
        req.user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true
            }
        })
        next();

    } catch (error) {
        return res.json({ success: false, message: "not authorized" })

    }
}