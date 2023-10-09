import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import Swal from 'sweetalert2';
import { TextField, Button, CircularProgress, Box, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state
  
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const audittraceCollectionRef = collection(db, "audittrace");

  const randomID = Math.floor(Math.random() * 1000000);

  const currentTime = new Date().toISOString();

  useEffect(() => {
    document.title = 'NestNet | SignIn';
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    try {
      // Authenticate User
      await signInWithEmailAndPassword(auth, email, password);

      // Query Firestore for user data using email
      const usersCol = collection(db, 'users');
      const q = query(usersCol, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No user found");
      }

      let userData = null;
      querySnapshot.forEach((doc) => {
        userData = doc.data();
      });

      // Check if user is verified
      if (userData.flag === 1) {
        sessionStorage.setItem('fullName', userData.userName)
        console.log(userData.userName)
        sessionStorage.setItem('userType', userData.userType)
        sessionStorage.setItem('email', userData.email)
        sessionStorage.setItem('name', userData.userName)
        if(userData.userType === "USER"){
          navigate('/user');
        }else{
          navigate('/admin');
        }
       

        const userIP = "0.0.0.0"; 

        await addDoc(audittraceCollectionRef, {
          AUDITTRACEID: `trace${randomID}`, 
          CREATEDTIME: currentTime,
          DESCRIPTION: "Login successfully",
          IP: userIP,
          LASTUPDATEDTIME: currentTime,
          LASTUPDATEDUSER: userData.userName, // Updating with username
          EMAIL: userData.email
        });
        
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Verification Needed',
          text: 'You need to verify your account. Please check your email.',
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Invalid email or password.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleForgotPassword = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire('Success', 'Password reset email sent!', 'success');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <TextField 
        label="Email" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        disabled={loading}
        fullWidth
      />
      <TextField 
        label="Password" 
        type={showPassword ? "text" : "password"}  
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        disabled={loading}
        fullWidth
        sx={{ mt: 2, mb: 3 }}
        InputProps={{  
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleLogin} 
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
      <Button 
        variant="text" 
        color="secondary" 
        onClick={handleForgotPassword} 
        disabled={loading || !email}
        fullWidth
        sx={{ mt: 2 }}
      >
        Forgot Password?
      </Button>
    </Box>
  );
}