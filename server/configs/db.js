import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log("Database Connected with Prisma")
    } catch (error) {
        console.log(error.message)
    }
}

export { prisma }
export default connectDB