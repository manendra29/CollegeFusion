import express from "express";
import { isAuthenticated, isAuthorized } from "../Middleware/isAuthenticated.js";
import { changeDp, createClub, deleteClub, showClub, updateClub } from "../Controllers/clubController.js";
const router=express.Router();

router.post("/create",isAuthenticated,createClub);
router.put("/update/:id",isAuthenticated,updateClub);
router.get("/show/:id",isAuthenticated,showClub);
router.delete("/delete/:id",isAuthenticated,deleteClub);
router.put("/dp/:id",isAuthenticated,changeDp);

export default router;

