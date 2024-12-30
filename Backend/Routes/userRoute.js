import express from "express";
const router=express.Router();
import { allFeed, changeCover, changeDp, follow, generateOTP, getProfile, login, logout, myFeed, mypost, register, search, unFollow, updateDetails } from "../Controllers/userController.js"
import { isAuthenticated } from "../Middleware/isAuthenticated.js";


router.post("/otp",generateOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/logout",isAuthenticated,logout);
router.get("/me",isAuthenticated,getProfile);
router.post("/dp",isAuthenticated,changeDp);
router.post("/cover",isAuthenticated,changeCover);
router.put("/update/:id",isAuthenticated,updateDetails);
router.put("/follow/:id",isAuthenticated,follow);
router.put("/unfollow/:id",isAuthenticated,unFollow);
router.get("/search",isAuthenticated,search);
router.get("/feed",isAuthenticated,allFeed);
router.get("/myfeed",isAuthenticated,myFeed);
router.get("/myposts",isAuthenticated,mypost);

export default router;