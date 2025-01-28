import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton 
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';

import './ClubMemberAdd.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const ClubMemberAdd = ({ open, onClose,clubs,isAdmin }) => {
  const [email, setEmail] = useState('');
  const [members, setMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

 

  const handleAddMemberButton = async() => {
  
      if(!isAdmin){
        try {
         const response=await axios.put(`http://localhost:5000/api/v1/club/addmember/${clubs._id}`,{email},{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      console.log(response.data);
      toast.success("User Added!");
    } 
  catch (error) {
      console.log(error);
      toast.error("No User Found");
      }
    }
    else{
      try {
        const response=await axios.put(`http://localhost:5000/api/v1/admin/assignmentor/${clubs._id}`,{email},{
       withCredentials:true,
       headers:{
         "Content-Type":"application/json"
       }
     });
     console.log(response.data);
     toast.success("Mentor Added!");
   } 
 catch (error) {
     console.log(error);
     toast.error("No User Found");
     }

    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      className="club-member-add-dialog"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="dialog-title">
        {isAdmin?"Add Mentor to Club":"Add Member to Club"}
        <IconButton 
          onClick={onClose} 
          className="close-button"
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="dialog-content">
        <div className="search-container">
          <TextField 
            fullWidth
            variant="outlined"
            label="Search by Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-search-input"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddMemberButton}
            className="search-button"
          >
            {isAdmin?"Add Mentor":"Add Member"}
          </Button>
        </div>
           
      </DialogContent>
    </Dialog>
  );
};

export default ClubMemberAdd;