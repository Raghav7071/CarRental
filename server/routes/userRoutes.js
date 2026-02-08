import express from "express";
import { getUserData, loginUser, registerUser, bookCar, getUserBookings, cancelBooking, payBooking } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

// Auth routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-data', protect, getUserData)

// Booking routes
userRouter.post('/book-car', protect, bookCar)
userRouter.get('/my-bookings', protect, getUserBookings)
userRouter.post('/cancel-booking', protect, cancelBooking)
userRouter.post('/pay-booking', protect, payBooking)

export default userRouter;