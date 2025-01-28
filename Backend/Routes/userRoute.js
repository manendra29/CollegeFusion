import express from "express";
const router=express.Router();
import { allFeed, allFollowers, allFollowing, changeCover, changeDp, follow, friendClub, friendPost, generateOTP, getProfile, getUser, login, logout, myClub, myFeed, mypost, register, search, searchPeron, unFollow, updateDetails } from "../Controllers/userController.js"
import { isAuthenticated } from "../Middleware/isAuthenticated.js";


router.post("/otp",generateOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/logout",isAuthenticated,logout);
router.get("/me",isAuthenticated,getProfile);
router.put("/dp",isAuthenticated,changeDp);
router.put("/cover",isAuthenticated,changeCover);
router.put("/update/:id",isAuthenticated,updateDetails);
router.put("/follow/:id",isAuthenticated,follow);
router.put("/unfollow/:id",isAuthenticated,unFollow);
router.get("/search",isAuthenticated,search);
router.get("/feed",isAuthenticated,allFeed);
router.get("/myfeed",isAuthenticated,myFeed);
router.get("/myposts",isAuthenticated,mypost);
router.get("/getuser/:id",isAuthenticated,getUser);
router.get("/myclub",isAuthenticated,myClub);
router.get("/friendpost/:id",isAuthenticated,friendPost);
router.get("/friendclub/:id",isAuthenticated,friendClub);
router.get("/allfollowers/:id",isAuthenticated,allFollowers);
router.get("/allfollowing/:id",isAuthenticated,allFollowing);
router.get("/searchperson",searchPeron);

export default router;