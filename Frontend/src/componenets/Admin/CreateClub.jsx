import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Card, 
  CardContent, 
  Typography 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import './CreateClub.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CreateClub = () => {
  const [clubData, setClubData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    category: '',
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const navigateTo=useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClubData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
        const response=await axios.post("http://localhost:5000/api/v1/admin/createclub",{
            name:clubData.name,
            description:clubData.description,
            email:clubData.email,
            phone:clubData.phone,
            category:clubData.category,
            clubImage:clubData.image
        },{
            withCredentials:true,
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        navigateTo("/");
    } catch (error) {
        console.log(error.response.data);
    }
  };

  return (
    <div className="club-creation-container">
      <Card className="club-creation-card">
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Create a New College Club
          </Typography>
          <form onSubmit={handleSubmit} className="club-form">
            <TextField
              fullWidth
              label="Club Name"
              name="name"
              value={clubData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={clubData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={clubData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              type="tel"
              value={clubData.phone}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Club Category</InputLabel>
              <Select
                name="category"
                value={clubData.category}
                label="Club Category"
                onChange={handleChange}
                required
              >
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="cultural">Cultural</MenuItem>
                <MenuItem value="technical">Technical</MenuItem>
                <MenuItem value="arts">Arts</MenuItem>
              </Select>
            </FormControl>
            
            <div className="image-upload-container">
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                className="upload-button"
              >
                Upload Club Image
                <VisuallyHiddenInput 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              
              {previewImage && (
                <div className="image-preview">
                  <img 
                    src={previewImage} 
                    alt="Club Preview" 
                    className="preview-image"
                  />
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              className="submit-button"
            >
              Create Club
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
  );
};

export default CreateClub;