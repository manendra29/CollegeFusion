import React, { useContext, useState } from 'react';
import '../Pages/ProfilePage.css'
import {Context} from "../../main"
import { 
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  
} from '@mui/material';
import { 
  Edit,
  Person,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import FollowingList from '../FollowList/FollowingList';
import FollowersList from '../FollowList/FollowersList';
import { lightGreen } from '@mui/material/colors';
import ProfileHeader from './ProfileHeader';


const ProfileInfo = ({isOwner,friend,isFollowing,setIsFollowing}) => {
  const {id}=useParams();
  const navigateTo=useNavigate();

      const [showFollowers, setShowFollowers] = useState(false);
      const [showFollowing, setShowFollowing] = useState(false);
      const [followers,setFollowers]=useState({});
      const [followings,setFollowings]=useState({});

      const {isAuthorized,user}=useContext(Context);
      const followersButton=async()=>{
      
        try {
          const userid=isOwner?user._id:friend._id;
           const response=await axios.get(`http://localhost:5000/api/v1/user/allfollowers/${userid}`,{
            withCredentials:true,
            headers:{
              "Content-Type":"application/json"
            }
           });
           setFollowers(response.data.followers);
        } catch (error) {
            console.log(error);
        }
    }
      const followingButton=async(id)=>{
        try {
          const userid=isOwner?user._id:friend._id;
          const response=await axios.get(`http://localhost:5000/api/v1/user/allfollowing/${userid}`,{
           withCredentials:true,
           headers:{
             "Content-Type":"application/json"
           }
          });
          setFollowings(response.data.following);
       } catch (error) {
           console.log(error);
       }
      }





    const followButton=async()=>{
      try {
       
        const response=await axios.put(`http://localhost:5000/api/v1/user/follow/${id}`,{
        },{
          withCredentials:true,
          headers:{
            "Content-Type":"application/json"
          }
        });
        toast.success("Followed");
        setIsFollowing(!isFollowing);
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }


    const unFollowButton=async()=>{
      try {
        const response=await axios.put(`http://localhost:5000/api/v1/user/unfollow/${id}`,{
        },{
          withCredentials:true,
          headers:{
            "Content-Type":"application/json"
          }
        });
        toast.success("UnFollowed");
        setIsFollowing(!isFollowing);
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }


  return (
    <>
    <Box className="profile-info-section">
    <div className="profile-header-container">
     
<ProfileHeader isOwner={isOwner} friend={friend} user={user} />
     </div>

    <Box className="stats-container">
      <Button 
        variant="text" 
        onClick={() => setShowFollowers(true)}
        sx={{ fontSize: '1.1rem' }}
      >
        <strong>{isOwner?user.followers.length:friend.followers?.length}</strong>&nbsp;Followers
      </Button>
      <Button 
        variant="text" 
        onClick={() => setShowFollowing(true)}
        sx={{ fontSize: '1.1rem' }}
      >
        <strong>{isOwner?user.following.length:friend.following?.length}</strong>&nbsp;Following
      </Button>
    </Box>

    {isOwner ? (
      <Button 
      onClick={()=> navigateTo(`/userprofileedit/${user._id}`)}
        variant="outlined" 
        startIcon={<Edit />}
        sx={{ mt: 2 }}
      >
        Edit Profile
      </Button>
    ) : (
      <Button
        variant={isFollowing ? "outlined" : "contained"}
        onClick={!isFollowing?followButton:unFollowButton}
        startIcon={<Person />}
        sx={{ mt: 2 }}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    )}
  </Box>
  {/* <Dialog 
  open={showFollowers} 
  onClose={() => setShowFollowers(false)}
>
  <DialogTitle onClick={followersButton}>Followers</DialogTitle>
  <DialogContent>
    <FollowersList followers={followers} />
  </DialogContent>
</Dialog> */}























      <Dialog 
        open={showFollowing} 
        onClose={() => setShowFollowing(false)}
      >
        <DialogTitle>Following</DialogTitle>
        <DialogContent onClick={followingButton}>
         <FollowingList followings={followings} />
        </DialogContent>
      </Dialog>
     </>
  )
}

export default ProfileInfo
