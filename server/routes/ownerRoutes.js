import express from "express";
import { protect } from "../middleware/auth.js";
import {
    addCar,
    changeRoleToOwner,
    getOwnerCars,
    deleteCar,
    toggleCarAvailability,
    getOwnerBookings,
    updateBookingStatus,
    getDashboardStats
} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

// Role management
ownerRouter.post("/change-role", protect, changeRoleToOwner);

// Car management
ownerRouter.post("/add-car", protect, upload.single("image"), addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/delete-car", protect, deleteCar);
ownerRouter.post("/toggle-availability", protect, toggleCarAvailability);

// Booking management
ownerRouter.get("/bookings", protect, getOwnerBookings);
ownerRouter.post("/update-booking", protect, updateBookingStatus);

// Dashboard
ownerRouter.get("/dashboard-stats", protect, getDashboardStats);

export default ownerRouter;