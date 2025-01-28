// ProfilePage.jsx
import React, { useContext, useEffect, useState } from 'react';
import './ProfilePage.css'
import {Context} from "../../main"
import { 
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { 
  CameraAlt,
  Edit,
  Person,
} from '@mui/icons-material';
import axios from "axios";
import toast from 'react-hot-toast';
import Post from '../Post/Post';
import { useNavigate, useParams } from 'react-router-dom';
import NewPost from '../Profile/NewPost';
import MyClubs from '../Profile/MyClubs';
import ProfileInfo from '../Profile/ProfileInfo';

const ProfilePage = ({ isOwner }) => {
    const {id}=useParams();
    const [posts,setPosts]=useState([]);
    const [cover,setCover]=useState(null);
    const navigateTo=useNavigate();
    const [dp,setDp]=useState(null);
    const [friend,setFriend]=useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [isAdmin,setIsAdmin]=useState(false);



    const HandleDeleteUser=async()=>{
      try {
        const firstConfirmation = window.confirm(
          "Are you sure you want to delete this user?"
        );
        if (!firstConfirmation) return;
        const secondConfirmation = window.confirm(
          "This action is irreversible. Are you absolutely sure?"
        );
    
        if (!secondConfirmation) return;


        await axios.delete(`http://localhost:5000/api/v1/admin/deleteuser/${id}`,{
          withCredentials:true,
          headers:{
            "Content-Type":"application/json"
          }
        });
        toast.success("User Deleted!");
      } catch (error) {
        console.log(error);
      }
    }




      const handleCoverChange = (e) => {
        const file=e.target.files[0];
        setCover(file);
        if(file)
            handleCoverChangeButton(file);
      };

      const handleDpChange=(e)=>{
        const file=e.target.files[0];
        setDp(file);
        if(file)
            handleDpChangeButton(file);
      }

      const handleDpChangeButton=async(file)=>{
        try {
            const response=await axios.put("http://localhost:5000/api/v1/user/dp",{
                profilePicture:file
            },{
                withCredentials:true,
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            });
            console.log("Done Bro");
            toast.success("Profile picture updated successfully");
            navigateTo("/myprofile");
        } catch (error) {
            console.log(error);
            toast.error("uploading profile picture fail");
        }
      }

     const friendUser=async()=>{
        try {
            const response=await axios.get(`http://localhost:5000/api/v1/user/getuser/${id}`,{
                withCredentials:true,
                headers:{
                    "Content-Type":"application/json"
                }
            });
            setFriend(response.data.user);
            if(user.following.includes(response.data.user._id))
                setIsFollowing(true);
        } catch (error) {
            console.log(error);
        }
     }

  const {isAuthorized,user}=useContext(Context);

  const myposts=async()=>{
    const response=await axios.get("http://localhost:5000/api/v1/user/myposts",{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    });
    setPosts(response.data.posts);
}

const friendPost=async()=>{
    const response=await axios.get(`http://localhost:5000/api/v1/user/friendpost/${id}`,{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    });
    setPosts(response.data.posts);
}

useEffect(() =>{
    try {
        if(isOwner)
            myposts();
        else{
        friendPost();
        friendUser();
        }
        if(user.role==="Admin")
          setIsAdmin(true);
        
    } catch (error) {
        console.log(error);
    }
},[]);

const followersButton=async()=>{
    try {
       
    } catch (error) {
        
    }
}




const handleCoverChangeButton=async(file)=>{
    try {
        const response=await axios.put("http://localhost:5000/api/v1/user/cover",{
            coverPicture:file
        },{
            withCredentials:true,
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        console.log("Done Bro");
        toast.success("Cover picture updated successfully");
        navigateTo("/myprofile");
    } catch (error) {
        console.log(error);
        toast.error("uploading cover picture fail");
    }
}



  return (
    <Container className="profile-container">
      <Box className="cover-section">
        <img 
          src={isOwner ? user.coverPicture?.url  ?? "/images/cover.png":friend.coverPicture?.url ?? "/images/cover.png"}
          alt="Cover"
          className="cover-image"
        />
        <div className="cover-overlay" />
        {isOwner && (
            <div>
  <label
    htmlFor="cover-upload"
    style={{
      position: 'absolute',
      top: 16,
      right: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '8px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    }}
  >
    <CameraAlt style={{ fontSize: '24px' }} />
    <input
      id="cover-upload"
      type="file"
      name="cover"
      onChange={handleCoverChange}
      style={{ display: 'none' }} 
    />
  </label>

  <button
    type="button"
    style={{
      marginTop: '80px',
      padding: '10px 16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    Submit
  </button>
</div>
        )}
      </Box>

      <Box className="profile-picture-section">
        <div className="profile-picture-container">
          <img 
            src={isOwner ? user.profilePicture?.url  ??  "/images/noPP.jpg" : friend.profilePicture?.url ?? "/images/noPP.jpg" } 
            alt="Profile"
            className="profile-picture"
          />
          {isOwner && (
            <div>
  <label
    htmlFor="dp-upload"
    style={{
      position: 'absolute',
      top: 110,
      right: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '4px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    }}
  >
    <CameraAlt style={{ fontSize: '24px' }} />
    <input
      id="dp-upload"
      type="file"
      name="dp"
      onChange={handleDpChange}
      style={{ display: 'none' }} 
    />
  </label>
</div>
          )}
        </div>
      </Box>
          <ProfileInfo isOwner={isOwner} friend={friend} isFollowing={isFollowing}setIsFollowing={setIsFollowing} />
    
     <MyClubs isOwner={isOwner} />

      {isOwner && <NewPost isOwner={isOwner} />}
      {isAdmin &&  <div style={{display:"flex",justifyContent:"center",textAlign:"center"}}>
     <Button onClick={HandleDeleteUser}>Delete User</Button>
      </div>

     
      }

      <div className="feed">
      <h1 style={{display:"flex",justifyContent:"center",marginBottom:"50px"}}>Posts</h1>
  {posts.length===0 && <h1 style={{display:"flex",justifyContent:"center",alignItems:"center",height:"70vh"}}>No Post Availabel !</h1>}
    {posts.map(post => (
      <Post key={post._id} post={post} isOwner={isOwner} />
    ))}
  </div>

      {/* Dialogs */}
     
    </Container>
  );
};

export default ProfilePage;