import React, { useContext, useState } from 'react';
import { 
  TextField,
  Button,
  Paper,
  Typography,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Code,
  Person
} from '@mui/icons-material';
import './ProfileEditor.css';
import { Context } from '../../main';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfileEditor = () => {
const {isAuthorized,user}=useContext(Context);
const {id}=useParams();
const navigateTo=useNavigate();

  const [profile, setProfile] = useState(user || {
    username: '',
    leetcode: '',
    github: '',
    linkedin: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUrls = () => {
    const urlPattern = /^https?:\/\/.+/;
    
    if (!urlPattern.test(profile.leetcode) && profile.leetcode) {
      return 'Invalid LeetCode URL';
    }
    if (!urlPattern.test(profile.github) && profile.github) {
      return 'Invalid GitHub URL';
    }
    if (!urlPattern.test(profile.linkedin) && profile.linkedin) {
      return 'Invalid LinkedIn URL';
    }
    return '';
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
         await axios.put(`http://localhost:5000/api/v1/user/update/${id}`,{
            username:profile.username,
            leetcode:profile.leetcode,
            linkedIn:profile.linkedin,
            github:profile.github
    },{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    })
    toast.success("Profile Updated !");
    navigateTo("/myprofile");
    } catch (error) {
        console.log(error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="profile-container">
      <Paper className="profile-card" elevation={3}>
        <div className="profile-header">
          <Typography variant="h4" className="profile-title">
            Edit User Profile
          </Typography>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-with-icon">
              <Person className="icon-wrapper" />
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                variant="outlined"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <Code className="icon-wrapper" />
              <TextField
                fullWidth
                label="LeetCode Profile"
                name="leetcode"
                value={profile.leetcode}
                onChange={handleChange}
                variant="outlined"
                placeholder="https://leetcode.com/username"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <GitHub className="icon-wrapper" />
              <TextField
                fullWidth
                label="GitHub Profile"
                name="github"
                value={profile.github}
                onChange={handleChange}
                variant="outlined"
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <LinkedIn className="icon-wrapper" />
              <TextField
                fullWidth
                label="LinkedIn Profile"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
                variant="outlined"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="submit-button"
            fullWidth
          >
            Save Changes
          </Button>
        </form>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </div>
  );
};

export default ProfileEditor;