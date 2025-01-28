import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  InputAdornment, 
  Button
} from '@mui/material';
import { Search } from '@mui/icons-material';
import './ClubMembersPage.css';
import {  useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';



const ClubMembersPage = () => {
  const {id}=useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const isOwner = location.state?.isOwner;
  const [members,setMembers]=useState([{}]);

  useEffect(()=>{
    const fetch=async()=>{
      try {
        const response=await axios.get(`http://localhost:5000/api/v1/club/clubmembers/${id}`,{
          withCredentials:true,
          headers:{
            "Content-Type":"application/json"
          }
        });
       setMembers(response.data.members);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  },[]);


  const handleRemoveButton=async(userid)=>{
    try {
        await axios.put(`http://localhost:5000/api/v1/club/removemember/${id}/${userid}`,{},{
    withCredentials:true,
    headers:{
      "Content-Type":"application/json"
    }
  });
  toast.success("Member Removed!");
    } catch (error) {
      console.log(error.response.data);
    }


  }


  return (
    <div className="club-members-container">
      <div className="page-header">
        <h1>College Club Members</h1>
        {/* <TextField 
          variant="outlined"
          placeholder="Search members"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          className="search-input"
        />*/}
      </div> 

      <Grid container spacing={4} className="members-grid">
        {members.map(member => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={member._id}>
            <Card className="member-card">
              <CardContent className="member-card-content">
                <div className="member-avatar-container">
                  <img 
                    src={member.profilePicture?.url} 
                    alt={member.username} 
                    className="member-avatar" 
                  />
                </div>
                <Typography variant="h6" className="member-name">
                  {member.username}
                </Typography>
                <Typography variant="subtitle1" className="member-role">
                  Team Member
                </Typography>
                { isOwner && <Button onClick={() => handleRemoveButton(member._id)}>Remove</Button> }
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ClubMembersPage;