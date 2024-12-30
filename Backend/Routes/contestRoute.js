import express from "express";
import { isAuthenticated, isAuthorized } from "../Middleware/isAuthenticated.js";
import { applyContest, createContest, deleteContest, showContest, unApplyContest, updateContest } from "../Controllers/contestController.js";
const router=express.Router();

router.post("/create",isAuthenticated,createContest);
router.post("/update/:id",isAuthenticated,updateContest);
router.get("/show/:id",isAuthenticated,showContest);
router.delete("/delete/:id",isAuthenticated,deleteContest);
router.put("/apply/:id",isAuthenticated,applyContest);
router.put("/unapply/:id",isAuthenticated,unApplyContest);

export default router;

