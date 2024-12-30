import express from "express";
import { isAuthenticated, isAuthorized } from "../Middleware/isAuthenticated.js";
import { applyContest, createContest, deleteContest, pastContest, showContest, unApplyContest, upComingContest, updateContest } from "../Controllers/contestController.js";
const router=express.Router();

router.post("/:id/create",isAuthenticated,createContest);
router.post("/update/:id",isAuthenticated,updateContest);
router.get("/show/:id",isAuthenticated,showContest);
router.delete("/delete/:id",isAuthenticated,deleteContest);
router.put("/apply/:id",isAuthenticated,applyContest);
router.put("/unapply/:id",isAuthenticated,unApplyContest);
router.get("/upcoming/:id",isAuthenticated,upComingContest);
router.get("/completed/:id",isAuthenticated,pastContest);


export default router;

