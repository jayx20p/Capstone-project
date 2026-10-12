import express from "express";

import {
    updateProfilePicture,
    getProfilePicture
}
    from "../controllers/userController.js";


const router = express.Router();


router.put(
    "/:id/profile-picture",
    updateProfilePicture
);


router.get(
    "/:id/profile-picture",
    getProfilePicture
);


export default router;