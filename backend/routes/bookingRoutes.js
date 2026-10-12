import express from "express";


import {

    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    updateCompleted

} from "../controllers/bookingController.js";



const router = express.Router();



// GET ALL
router.get(
    "/",
    getBookings
);



// GET ONE
router.get(
    "/:id",
    getBookingById
);



// CREATE
router.post(
    "/",
    createBooking
);



// UPDATE
router.put(
    "/:id",
    updateBooking
);



// DELETE
router.delete(
    "/:id",
    deleteBooking
);



// COMPLETE CHECKBOX
router.put(
    "/:id/completed",
    updateCompleted
);



export default router;