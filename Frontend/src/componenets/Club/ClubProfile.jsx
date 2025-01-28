// ProfilePage.jsx
import React, { useContext, useEffect, useState } from 'react';
import './ClubProfile.css'
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
import ProfileInfo from '../Profile/ProfileInfo';
import Leadership from "./Leadership"
import ClubDetails from './ClubDetails';
import ClubMemberAdd from './ClubMemberAdd';

const ClubProfile = () => {
    const [isOwner,setIsOwner]=useState(false);
    const {id}=useParams();
    const [posts,setPosts]=useState([]);
    const [cover,setCover]=useState(null);
    const navigateTo=useNavigate();
    const [dp,setDp]=useState(null);
    const [clubs,setClubs]=useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isAdmin,setIsAdmin]=useState(false);


 
    //Cover Change (Do add this into backend then come to frontend part).

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

     const fetchClubs=async()=>{
        try {
            const response=await axios.get(`http://localhost:5000/api/v1/club/show/${id}`,{
                withCredentials:true,
                headers:{
                    "Content-Type":"application/json"
                }
            });
            setClubs(response.data.club);
        } catch (error) {
            console.log(error);
        }
     }

  const {isAuthorized,user}=useContext(Context);



const clubsPost=async()=>{
    const response=await axios.get(`http://localhost:5000/api/v1/club/allposts/${id}`,{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    });
    setPosts(response.data.ClubPost);
}

useEffect(() =>{
    try {
        fetchClubs();
        clubsPost();
        }    
     catch (error) {
        console.log(error);
    }
},[]);

useEffect(() => {
  if (clubs.clubLead === user?._id) {
    setIsOwner(true);
  } else {
    setIsOwner(false);
  }
  if(user.role==="Admin")
    setIsAdmin(true);
}, [clubs, user]);

const handleDeleteClub=async()=>{
  try {
    const firstConfirmation = window.confirm(
      "Are you sure you want to delete this Club?"
    );
    if (!firstConfirmation) return;
    const secondConfirmation = window.confirm(
      "This action is irreversible. Are you absolutely sure?"
    );

    if (!secondConfirmation) return;
     await axios.delete(`http://localhost:5000/api/v1/admin/deleteclub/${id}`,{
    withCredentials:true,
    headers:{
      "Content-Type":"application/json"
    }
  });
  toast.success("Club Deleted!");
  } catch (error) {
    console.log(error);
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
          src={clubs.coverPicture?.url  ?? "/images/cover.png"}
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
            src={clubs.clubImage?.url  ??  "/images/noPP.jpg"} 
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
          {/* <ProfileInfo isOwner={isOwner} clubs={clubs} isFollowing={isFollowing}setIsFollowing={setIsFollowing} /> */}
          <ClubDetails clubs={clubs} />

          <Leadership id={id} />
          
          {/* {isOwner && clubs && Object.keys(clubs).length > 0 && (
  <NewPost isOwner={isOwner} clubs={clubs} />
)} */}
            {isOwner && <Button onClick={()=> navigateTo(`/newcontest/${id}`)}>Create Contest</Button> }

            <Button onClick={()=> navigateTo(`/contest/${id}`)}>All Contest</Button> 

          {(isOwner || isAdmin) &&  <div>
      <Button onClick={() => setIsAddMemberOpen(true)}>
        {isAdmin?"Add Mentor":"Add Member"}
      </Button>
      <ClubMemberAdd 
        open={isAddMemberOpen} 
        onClose={() => setIsAddMemberOpen(false)} 
        clubs={clubs}
        isAdmin={isAdmin}
      />
    </div>
          }

         <Button onClick={()=> navigateTo(`/club/allmembers/${id}`,{state:{isOwner:isOwner}})}>All Members</Button>
         { isAdmin && <Button onClick={handleDeleteClub}>Delete Club</Button> }     

      {isOwner && <NewPost isOwner={isOwner} clubs={clubs} />}

      <div className="feed">
      <h1 style={{display:"flex",justifyContent:"center",marginBottom:"50px"}}>Posts</h1>
  {posts.length===0 && <h1 style={{display:"flex",justifyContent:"center",alignItems:"center",height:"70vh"}}>No Post Availabel !</h1>}
    {posts.map(post => (
      <Post key={post._id} post={post} isOwner={isOwner} />
    ))}
  </div>

     
    </Container>
  );
};

export default ClubProfile;