import { User } from "../models/userSchema.js";
import {catchAsyncError} from "../Middleware/catchAsyncError.js"
import ErrorHandler  from "../Middleware/error.js"
import { sendEmail } from "../utils/sendEmail.js";
import { generateJwtToken } from "../utils/jwtToken.js";
import {v2 as cloudinary} from "cloudinary"
import { Post } from "../models/postSchema.js";
import mongoose from "mongoose";
import { Club } from "../models/clubSchema.js";


const otpStorage=new Map();
export const generateOTP=catchAsyncError(async(req,res,next) =>{
    const {email}=req.body;
    const user=await User.find({email});
    console.log(user);
    if(user.length===1)
        return next(new ErrorHandler("User Already exists",400));
    if(!email.endsWith("@gmail.com"))
        return next(new ErrorHandler("Please Provide Your College Domain email id!",400));
    let otp=Math.floor((Math.random()+1)*100000).toString();
    await sendEmail(email,otp);
    otpStorage.set(email,{otp,expires:Date.now()+300000});
    console.log(otpStorage.get(email));
    res.status(200).json({
        success:true,
        message:"OTP sent successfully"
    });
})


export const register=catchAsyncError(async(req,res,next) =>{
    const {username,email,password,college,department,otp}=req.body;
    if(!username || !email || !password || !college || !department || !otp)
        return next(new ErrorHandler("Please provide all details!",400));

    const checkUser=await User.find({email});
    if(checkUser.length ===1)
        return next(new ErrorHandler("User Already exists",400));
    if(!email.endsWith("@gmail.com"))
        return next(new ErrorHandler("Please Provide Your College Domain email id!",400));
   
    const storedOtpData = otpStorage.get(email); 
    console.log(storedOtpData);
        if (!storedOtpData) {
      return next(new ErrorHandler("OTP not found or expired!", 400));
     }

  const { otp: storedOtp, expiresAt } = storedOtpData;

  if (Date.now() > expiresAt) {
    otpStorage.delete(email); 
    return next(new ErrorHandler("OTP has expired!", 400));
  }
  if (storedOtp !== otp) {
    return next(new ErrorHandler("Invalid OTP!", 400));
  }
  otpStorage.delete(email);
  const user = await User.create({
    username,
    email,
    password,
    college,
    department,
  });
    generateJwtToken(user,"Registered successfully",201,res);
});

export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password )
        return next(new ErrorHandler("Please provide both email and password ",400));
    const user=await User.findOne({email});
    if(!user)
        return next(new ErrorHandler("Invalid Credentials",400));
    const correctPassword=await user.comparePassword(password);
    if(!correctPassword)
        return next(new ErrorHandler("Incorrect Password",400));
    generateJwtToken(user,"Login successfully",201,res);
})

export const logout=catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token","",{
        expires:new Date(Date.now()),
        httpOnly:true
    }).json({
        success:true,
        message:"User LogOut Successfully"
    });
});

export const getProfile=catchAsyncError(async(req,res,next)=>{
    const user=req.user;
    res.status(201).json({
        success:true,
        message:"Your Profile",
        user 
    })
});

export const changeDp=catchAsyncError(async(req,res,next) =>{
    if(!req.files || Object.keys(req.files).length === 0 )
        return next(new ErrorHandler("Profile Picture is Needed",400));
     const {profilePicture}=req.files;
     const allowedFormart=["image/png","image/jpeg","image/webp"];
     if(!allowedFormart.includes(profilePicture.mimetype))
         return next(new ErrorHandler("Profile Picture format not supported",400));

     const cloudinaryResponse= await cloudinary.uploader.upload(
        profilePicture.tempFilePath,
        {
            folder:"Profile_Image"
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
        return next(new ErrorHandler("Failed to upload image top cloudinary",400));
    }
    const filter={_id:req.user._id};
    const data = {
        $set: {
          profilePicture:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url
    }
        }
      };
    const profileImage=await User.updateOne(filter,data);
    res.status(201).json({
        success:true,
        message:"Profile Updated Successfully",
        profileImage
    })
})

export const changeCover=catchAsyncError(async(req,res,next) =>{
    if(!req.files || Object.keys(req.files).length === 0 )
        return next(new ErrorHandler("Cover Picture is Needed",400));
     const {coverPicture}=req.files;
     const allowedFormart=["image/png","image/jpeg","image/webp"];
     if(!allowedFormart.includes(coverPicture.mimetype))
         return next(new ErrorHandler("Cover Picture format not supported",400));

     const cloudinaryResponse= await cloudinary.uploader.upload(
        coverPicture.tempFilePath,
        {
            folder:"Cover_Image"
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
        return next(new ErrorHandler("Failed to upload image top cloudinary",400));
    }
    const filter={_id:req.user._id};
    const data = {
        $set: {
          coverPicture:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url
    }
        }
      };
    const coverImage=await User.updateOne(filter,data);
    res.status(201).json({
        success:true,
        message:"Cover Picture Updated Successfully",
        coverImage
    })
})

export const updateDetails=catchAsyncError(async(req,res,next)=>{
   const {id}=req.params;
   const user=await User.findByIdAndUpdate(id,req.body,{
     new :true,
    runValidators :true,
    useFindAndModify :false
   });
   res.status(201).json({
    success:true,
    message:"Data Updated",
    user
   });
})

export const follow = catchAsyncError(async (req,res,next)=>{
    const {id} = req.params;
    const userId = req.user._id;
    const alreadyFollow = req.user.following.includes(id);
    if(alreadyFollow)
            return next(new ErrorHandler("You already follow this account!",400));
    const follower =await User.findByIdAndUpdate(id,{$push:{followers:userId}},
        {new:true,
            runValidators:true,
         useFindAndModify:false   
        }
    );
    const following=await User.findByIdAndUpdate(userId,{$push:{following:id}},
        {new:true,
            runValidators:true,
         useFindAndModify:false   
        }
    );
    res.status(201).json({
        success:true,
        follow,
        following,
        message:"Followed Successfully"
    })
});

export const unFollow = catchAsyncError(async (req,res,next)=>{
    const {id} = req.params;
    const userId = req.user._id;
    const alreadyFollow = req.user.following.includes(id);
    if(!alreadyFollow)
            return next(new ErrorHandler("First follow this account!",400));
    const follower =await User.findByIdAndUpdate(id,{$pull:{followers:userId}},
        {new:true,
            runValidators:true,
         useFindAndModify:false   
        }
    );
    const following=await User.findByIdAndUpdate(userId,{$pull:{following:id}},
        {new:true,
            runValidators:true,
         useFindAndModify:false   
        }
    );
    res.status(201).json({
        success:true,
        follow,
        following,
        message:"UnFollowed Successfully"
    })
});

export const search = catchAsyncError(async (req,res,next) => {
    const {username} = req.body;
    const users = await User.find({username});
    if(users.length===0)
        return next(new ErrorHandler("No users Found!",404));
    res.status(201).json({
        success:true,
        users,
        message:"Found some users!"
    });
});

export const allFeed = catchAsyncError(async(req,res,next) => {
    // const sevenDaysAgo = Date.now() - 604800000;
    // const posts = await Post.find({ createdAt: { $gte: sevenDaysAgo } });
    const posts = await Post.find();
    posts.reverse();

    res.status(201).json({
        success:true,
        message:"Posts Fetched!",
        posts
    })
});

export const myFeed = catchAsyncError(async(req,res,next) => {
    const followings = req.user.following;
    // const sevenDaysAgo = Date.now() - 604800000; 
    const posts = await Post.find({ 
    userId: { $in:followings }})
    res.status(201).json({
        success:true,
        message:"my Posts Fetched!",
        posts
    })
});

export const mypost=catchAsyncError( async (req,res,next)=>{
    const posts=await Post.find({userId:req.user._id});
    res.status(201).json({
        success:true,
        message:"My Posts fetched!",
        posts
    });
});


export const getUser=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    let user=await User.findById(id);
    if(!user)
        user=await Club.findById(id);
    res.status(200).json({
        success:true,
        message:"User Fetched",
        user
    });
});


export const myClub = catchAsyncError(async (req, res, next) => {
    
      const clubs = await Club.find({ members: { $in: req.user._id } });
      
      res.status(200).json({
        success: true,
        message: "User's clubs fetched successfully",
        clubs,
      });
  });

  export const friendPost=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const posts=await Post.find({userId:id});
    res.status(201).json({
        success:true,
        message:"Friend's Post",
        posts
    });
})

export const friendClub=catchAsyncError(async(req,res,next) =>{
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id))
            return next(new ErrorHandler("Id format is invalid",400));
        const clubs=await Club.find({ members: { $in: id } });
        res.status(201).json({
            success:true,
            message:"Friend's Club fetched",
            clubs
        })
})

export const allFollowers=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const user=await User.findById(id);
    let followers=await Promise.all(user.followers.map(async(u)=>{
        const newUser=await User.findById(u);
        return newUser;
    }))
    res.status(201).json({
        success:true,
        message:"Followers List",
        followers
    });
})

export const allFollowing=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const user=await User.findById(id);

    let following = await Promise.all(
        user.following.map(async (u) => {
            const newUser = await User.findById(u);
            return newUser; 
        })
    );
    res.status(201).json({
        success:true,
        message:"Following List",
        following
    });
})

export const searchPeron=catchAsyncError(async(req,res,next) =>{
    const {name}=req.query;
    const users = await User.find({ username: { $regex:name, $options: "i" } });
    res.status(201).json({
        success:true,
        message:"Person Searched",
        users
    });
})

  

