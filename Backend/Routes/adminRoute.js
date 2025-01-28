import express from "express";
import { isAuthenticated, isAuthorized } from "../Middleware/isAuthenticated.js";
import { assignMentor, createClub, deleteClub, deleteUser } from "../Controllers/adminController.js";
const router=express.Router();

router.post("/createclub",isAuthenticated,isAuthorized("Admin"),createClub);
router.delete("/deleteclub/:id",isAuthenticated,isAuthorized("Admin"),deleteClub);
router.delete("/deleteuser/:id",isAuthenticated,isAuthorized("Admin"),deleteUser);
router.put("/assignmentor/:id",isAuthenticated,isAuthorized("Admin"),assignMentor);




export default router;