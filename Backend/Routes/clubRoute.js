import express from "express";
import { isAuthenticated, isAuthorized } from "../Middleware/isAuthenticated.js";
import { addMember, allClubs, allMembersOfClub, assignLead, changeDp, clubLeader, clubMentors, createClubPost, myClubPost, removeMember, showClub, updateClub } from "../Controllers/clubController.js";
const router=express.Router();


router.put("/update/:id",isAuthenticated,updateClub);
router.get("/show/:id",isAuthenticated,showClub);
router.put("/dp/:id",isAuthenticated,changeDp);
router.put("/assignlead/:id",isAuthenticated,assignLead);
router.post("/createclubpost/:id",isAuthenticated,createClubPost);
router.put("/addmember/:id",isAuthenticated,addMember);
router.put("/removemember/:id/:userId",isAuthenticated,removeMember);
router.get("/allposts/:id",isAuthenticated,myClubPost);
router.get("/allclubs",isAuthenticated,allClubs);
router.get("/clublead/:id",isAuthenticated,clubLeader);
router.get("/clubmentors/:id",isAuthenticated,clubMentors);
router.get("/clubmembers/:id",isAuthenticated,allMembersOfClub);


export default router;

