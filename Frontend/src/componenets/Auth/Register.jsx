import React, { useContext, useState } from 'react';
import axios from "axios";
import {toast} from "react-toastify"
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import {
  Email,
  Lock,
  Person,
  School,
  Class
} from '@mui/icons-material';
import './login.css';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const {isAuthorized,setIsAuthorized,user,setUser}=useContext(Context);
  const navigateTo=useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    username: '',
    college: '',
    department: '',
    password: '',
  });
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response=await axios.post("http://localhost:5000/api/v1/user/register",{
        email: formData.email,
        otp: formData.otp,
        username: formData.username,
        college: formData.college,
        department: formData.department,
        password: formData.password,
      },{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      toast.success("Registerd Successfully!");
      setIsAuthorized(true);
      setUser(response.data.user);
      navigateTo("/");


    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  const handleSendOTP = async() => {
    try{
    const response=await axios.post("http://localhost:5000/api/v1/user/otp",{email:formData.email},{
      withCredentials:true,
      headers:{
        "Content-Type":"application/json"
      }
    });
    toast.success("OTP sent !");
    setOtpSent(true);
    setFormData({otp:response.data.otp});
  }
  catch(error){
    toast.error(error.response.data.message);
    console.log(error.response.data.message);
  }

  };

  return (
    <div className="auth-container" style={{minHeight:"100vh"}}>
      <Card className="auth-card">
        <CardContent>
          <Typography variant="h5" component="h1" className="auth-title">
            Register
          </Typography>

          <form onSubmit={handleSubmit} className="form-container">
            <div className="input-group">
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendOTP}
                disabled={!formData.email || otpSent}
                className="otp-button"
                sx={{ ml: 1 }}
              >
                Send OTP
              </Button>
            </div>

            {/* {otpSent && ( */}
              <TextField
                fullWidth
                label="OTP"
                name="otp"
                type="text"
                variant="outlined"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            {/* )} */}

            <TextField
              fullWidth
              label="Username"
              name="username"
              type="text"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="College"
              name="college"
              type="text"
              variant="outlined"
              value={formData.college}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <School />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Department"
              name="department"
              type="text"
              variant="outlined"
              value={formData.department}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Class />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="auth-submit-button"
            >
              Register
            </Button>
          </form>

          <div className="auth-footer">
            <Typography variant="body2" component="span">
              Already have an account?
              <a href="/login" className="auth-link">
                Login here
              </a>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;