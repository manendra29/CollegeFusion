import React, { useState } from 'react';
import { Box, Input } from '@mui/material';
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography
} from '@mui/material';
import './CreateContest.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const CreateContest = () => {
    const {id}=useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    contestPicture:null,
    contestLink: ''
  });
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      contestPicture: e.target.files[0],
    });
  };

  const handleSubmit = async(e) => {
    console.log(formData.date);
    e.preventDefault();
    try {
         const response=await axios.post(`http://localhost:5000/api/v1/contest/${id}/create`,{
        title:formData.title,
        description:formData.description,
        date:formData.date,
        contestLink:formData.contestLink,
        contestPicture:formData.contestPicture
    },{
        withCredentials:true,
        headers:{
            "Content-Type":"applimultipart/form-data"
        }
    })
    } catch (error) {
        console.log(error);
    }
   
  };

  return (
    <Container maxWidth="md"  className="create-contest-container">
      <Paper elevation={3} className="create-contest-paper">
        <Typography variant="h4" className="form-title">
        Create New Contest
          {/* {contest ? 'Edit Contest' : 'Create New Contest'} */}
        </Typography>
        <form onSubmit={handleSubmit} className="contest-form">
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          {/* <TextField
          type='file'
            label="Contest Picture URL"
            value={formData.contestPicture}
            onChange={(e) => setFormData({...formData, contestPicture: e.target.value})}
            margin="normal"
          >Contest Picture</TextField> */}




















      

<Box sx={{ marginY: 2 }}>
  <Typography variant="subtitle1" sx={{ marginBottom: 1, fontWeight: 'bold' }}>
    Contest Picture
  </Typography>
  <label htmlFor="contest-picture">
    <Input
      id="contest-picture"
      type="file"
      onChange={handleFileChange}
      sx={{
        display: 'none',
      }}
    />
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        padding: '10px 16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#f5f5f5',
        '&:hover': {
          backgroundColor: '#e0e0e0',
        },
      }}
    >
      {formData.contestPicture ? formData.contestPicture.name : 'Upload Contest Picture'}
    </Box>
  </label>
</Box>















          <TextField
            fullWidth
            label="Contest Link"
            value={formData.contestLink}
            onChange={(e) => setFormData({...formData, contestLink: e.target.value})}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit-button"
          >
          Create Contest
            {/* {contest ? 'Update Contest' : 'Create Contest'} */}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
