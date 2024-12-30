import { catchAsyncError } from "../Middleware/catchAsyncError.js";
import ErrorHandler from "../Middleware/error.js";
import {v2 as cloudinary} from "cloudinary"
import { Post } from "../models/postSchema.js";
import mongoose from "mongoose";


export const createPost = catchAsyncError(async (req,res,next) => {
    if(!req.files || Object.keys(req.files).length === 0 )
        return next(new ErrorHandler("Post Image is Needed",400));
     const {postImage}=req.files;
     const allowedFormart=["image/png","image/jpeg","image/webp"];
     if(!allowedFormart.includes(postImage.mimetype))
         return next(new ErrorHandler("Post Image format not supported",400));

    const {title,description} = req.body;
    if(!title || !description)
            return next(new ErrorHandler("Enter the title and description",400));
    const cloudinaryResponse= await cloudinary.uploader.upload(
        postImage.tempFilePath,
        {
            folder:"Post_Image"
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
        return next(new ErrorHandler("Failed to upload image top cloudinary",400));
    }
    const userPost = await Post.create({
        title,description,postImage:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        },
        userId:req.user._id
    });
    res.status(201).json({
        success:true,
        message:"Post created",
        userPost
    });
});

export const deletePost=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const post=await Post.findById(id);
    if(!post)
        return next(new ErrorHandler("Post not Found",404));

    const deletedPost=await Post.findByIdAndDelete(id);
    res.status(201).json({
        success:true,
        message:"Post Deleted Successfully",
        deletePost
    })
});

export const like=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const post=await Post.findById(id);
    const alreadyLike=post.like.includes(req.user._id);
    const user= req.user;
    if(alreadyLike)
        return next(new ErrorHandler("Already Liked",400));
    const likedPost = await Post.findByIdAndUpdate(id,{
        $push:{like:user._id}}
    ,{
        new :true,
        runValidators :true,
        useFindAndModify :false  
    });
    res.status(201).json({
        success:true,
        message:"Post has been liked",
        likedPost
    })
})

export const unLike=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const post=await Post.findById(id);
    const alreadyLike=post.like.includes(req.user._id);
    if(!alreadyLike)
        return next(new ErrorHandler("Like first",400));
    await Post.findByIdAndUpdate(id,{
        $pull:{like:req.user._id}
    },{
        new :true,
        runValidators :true,
        useFindAndModify :false  
    });
    res.status(201).json({
        success:true,
        message:"Post has been unliked",
    })
})

export const commentPost=catchAsyncError(async (req,res,next)=> {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const {comment} = req.body;
    if(!comment)
        return next(new ErrorHandler("Add some Comment",400));
    await Post.findByIdAndUpdate(id,{
        $push:{comment:{
            userId:req.user._id,
            value:comment
        }}
    },{ 
        new :true,
    runValidators :true,
    useFindAndModify :false
    });
    
    res.status(201).json({
        success:true,
        message:"Commented!",
        comment
    });
})

export const deleteComment = catchAsyncError(async (req,res,next) => {
    const {id} = req.params;
    const {postId} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const post = await Post.findById(postId);
    if(!post)
        return next(new ErrorHandler("No Post Found!",404));
    await Post.findByIdAndUpdate(postId,{
        $pull:{
            comment:{
                _id:id
            }
        }
    });
    res.status(201).json({
        success:true,
        message:"Comment Deleted!"
    })
})

