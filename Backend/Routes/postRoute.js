import express from "express";
const router=express.Router();
import { isAuthenticated } from "../Middleware/isAuthenticated.js"
import { commentPost, createPost, deleteComment, deletePost, like, unLike } from "../Controllers/postController.js";


router.post("/createpost",isAuthenticated,createPost);
router.delete("/delete/:id",isAuthenticated,deletePost);
router.put("/like/:id",isAuthenticated,like);
router.put("/unlike/:id",isAuthenticated,unLike);
router.put("/comment/:id",isAuthenticated,commentPost);
router.put("/comment/:postId/:id",isAuthenticated,deleteComment);


export default router;