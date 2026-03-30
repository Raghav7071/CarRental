import express from "express";
import { getUserData, loginUser, registerUser, bookCar, getUserBookings, cancelBooking, payBooking, updateImage, forgotPassword, resetPassword } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

// Auth routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/get-data', protect, getUserData)
userRouter.post('/update-image', protect, upload.single('image'), updateImage)

// Booking routes
userRouter.post('/book-car', protect, bookCar)
userRouter.get('/my-bookings', protect, getUserBookings)
userRouter.post('/cancel-booking', protect, cancelBooking)
userRouter.post('/pay-booking', protect, payBooking)

export default userRouter;