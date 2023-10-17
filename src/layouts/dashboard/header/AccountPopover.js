import React, { useState } from 'react';
import { Avatar, Box, Divider, IconButton, MenuItem, Popover, Stack, Typography } from '@mui/material';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../pages/FireBaseConfig2";
import { useNavigate } from 'react-router-dom';
import UserProfile from '../profile/UserProfile';
import AvatarImage from '../../../images/assets/images/avatars/avatar_default.jpg';


export default function AccountPopover() {
    const [open, setOpen] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const navigate = useNavigate();
    const displayName = sessionStorage.getItem('name');
    const email = sessionStorage.getItem('email');

    const audittraceCollectionRef = collection(db, "audittrace");

    const randomID = Math.floor(Math.random() * 1000000);
  
    const currentTime = new Date().toISOString();

    const handleOpen = (event) => setOpen(event.currentTarget);
    const handleClose = () => setOpen(null);

    const handleLogout = () => {

        const userIP = "0.0.0.0"; 

         addDoc(audittraceCollectionRef, {
          AUDITTRACEID: `trace${randomID}`, 
          CREATEDTIME: currentTime,
          DESCRIPTION: "Log Out",
          IP: userIP,
          LASTUPDATEDTIME: currentTime,
          LASTUPDATEDUSER: sessionStorage.getItem("name"),
          EMAIL: sessionStorage.getItem("email"),
        });

        sessionStorage.clear();
        navigate('/login');
        
    };

    const handleOpenProfile = () => {
        setIsProfileModalOpen(true);
        handleClose(); // Close the account popover when opening the profile modal
    };

    const handleCloseProfile = () => setIsProfileModalOpen(false);

    return (
        <>
            <IconButton onClick={handleOpen}>
                <Avatar src={AvatarImage} alt={displayName} />
            </IconButton>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Box sx={{ my: 2, px: 2.5 }}>
                    <Typography variant="subtitle2" noWrap>{displayName}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>{email}</Typography>
                </Box>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <Stack sx={{ p: 1 }}>
                <MenuItem onClick={() => navigate('/user/dashboard')}>
                        Home
                    </MenuItem>
                    <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>

                </Stack>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <MenuItem onClick={handleLogout} sx={{ m: 1 }}>Logout</MenuItem>
            </Popover>

            {/* UserProfile modal */}
            <UserProfile isModalOpen={isProfileModalOpen} handleCloseModal={handleCloseProfile} userEmail={email} />
        </>
    );
}
