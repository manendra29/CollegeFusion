import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './ContestCard.css';
import axios from 'axios';
import { Context } from '../../main';
import toast from 'react-hot-toast';

export const ContestCard = ({ contest,clubId}) => {
    const {isAuthorized,user}=useContext(Context);
  const navigate = useNavigate();
  const [clubLead,setClubLead]=useState({});
  const [isOwner,setIsOwner]=useState(false);
  useEffect(() =>{
    const fetch=async()=>{
        const response=await axios.get(`http://localhost:5000/api/v1/club/clublead/${clubId}`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        });
        setClubLead(response.data.clubLead);
    }
    fetch();
  },[])


  useEffect(() => {
    if (clubLead._id === user?._id) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [clubLead, user]);

  const handleDeleteButton=async()=>{
    try {
        console.log(contest._id);
        await axios.delete(`http://localhost:5000/api/v1/contest/delete/${clubId}/${contest._id}`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        })
        toast.success("Contest has been deleted");
    } catch (error) {
        console.log(error);
    }
  }


  return (
    <Card className="contest-card">
      <img 
        src={contest.contestPicture?.url || '/api/placeholder/300/200'} 
        alt={contest.title} 
        className="contest-image"
      />
      <CardContent>
        <Typography variant="h5" component="div" className="contest-title">
          {contest.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {contest.date}
        </Typography>
        <Typography variant="body2" className="contest-description">
          {contest.description.substring(0, 100)}...
        </Typography>
      </CardContent>
      <CardActions className="contest-actions">
        <Button size="small" onClick={() => navigate(`/thiscontest/${contest._id}`)}>
          View Details
        </Button>
        {isOwner && <Button size="small" onClick={(e)=> navigate(`/editcontest/${clubId}/${contest._id}`,{ state: { contest } }) }>
          Edit
        </Button> }
        { isOwner && <Button size="small" color="error" onClick={handleDeleteButton} >
          Delete
        </Button> }
      </CardActions>
    </Card>
  );
};