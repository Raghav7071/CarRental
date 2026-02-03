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
            return res.json({ success: false, message: 'Password must be at least 8 characters long' })
        }

        const userExists = await prisma.user.findUnique({ where: { email } })
        if (userExists) {
            return res.json({ success: false, message: 'User alerady exists' })
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

// jwt user data using token(JWT)
export const getUserData = async (req, res) => {
    try {
        const { user } = req;
        res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}