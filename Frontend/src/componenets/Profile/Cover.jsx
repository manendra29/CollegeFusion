import { CameraAlt } from '@mui/icons-material'
import React, { useContext, useState } from 'react'
import '../Pages/ProfilePage.css'
import { Context } from '../../main';
import { Box } from 'lucide-react';





const Cover = (isOwner) => {
const [cover,setCover]=useState(null);
const {isAuthorized,user}=useContext(Context);

const handleCoverChange = (e) => {
    const file=e.target.files[0];
    setCover(file);
    if(file)
        handleCoverChangeButton(file);
  };

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
    <Box className="cover-section">
        <img 
          src={user.coverPicture?.url  ?? "/images/cover.png"}
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
  )
}

export default Cover
