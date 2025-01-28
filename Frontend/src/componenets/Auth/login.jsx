import React, { useContext, useEffect, useState } from 'react';
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
  Lock
} from '@mui/icons-material';
import './login.css';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const {isAuthorized,setIsAuthorized,setUser}=useContext(Context);
  const navigateTo=useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  useEffect(() =>{
    if(isAuthorized)
      navigateTo("/");
  },[])
    

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response=await axios.post("http://localhost:5000/api/v1/user/login",{email:formData.email,password:formData.password},{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      toast.success("Login Successfully!");
      setIsAuthorized(true);
      setUser(response.data.user);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardContent>
          <Typography variant="h5" component="h1" className="auth-title">
            Login
          </Typography>

          <form onSubmit={handleSubmit} className="form-container">
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
              Login
            </Button>
          </form>

          <div className="auth-footer">
            <Typography variant="body2" component="span">
              Don't have an account?
              <a href="/register" className="auth-link">
                Register here
              </a>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;