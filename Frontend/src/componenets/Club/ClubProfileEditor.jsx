import React, { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Email,
  Phone,
  Category,
  Description
} from '@mui/icons-material';
import '../Profile/ProfileEditor.css';

const ClubProfileEditor = () => {
  const [profile, setProfile] = useState({
    clubName: '',
    description: '',
    email: '',
    phone: '',
    category: ''
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

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhone = (phone) => {
    const phonePattern = /^\+?[\d\s-]{10,}$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (profile.email && !validateEmail(profile.email)) {
      setSnackbar({
        open: true,
        message: 'Invalid email address',
        severity: 'error'
      });
      return;
    }

    if (profile.phone && !validatePhone(profile.phone)) {
      setSnackbar({
        open: true,
        message: 'Invalid phone number',
        severity: 'error'
      });
      return;
    }

    console.log('Saving club profile:', profile);
    setSnackbar({
      open: true,
      message: 'Club profile updated successfully!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="profile-container">
      <Paper className="profile-card" elevation={3}>
        <div className="profile-header">
          <Typography variant="h4" className="profile-title">
            Edit Club Profile
          </Typography>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-with-icon">
              <Description className="icon-wrapper" />
              <TextField
                fullWidth
                label="Club Name"
                name="clubName"
                value={profile.clubName}
                onChange={handleChange}
                variant="outlined"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <Description className="icon-wrapper" />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={profile.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                className="description-field"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <Email className="icon-wrapper" />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                variant="outlined"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <Phone className="icon-wrapper" />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                variant="outlined"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <Category className="icon-wrapper" />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={profile.category}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="cultural">Cultural</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="social">Social</MenuItem>
                </Select>
              </FormControl>
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

export default ClubProfileEditor;