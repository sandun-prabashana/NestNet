import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import { db } from "../../../pages/FireBaseConfig2";
import { Avatar, Button, Typography, Paper, Grid } from '@mui/material';
import UserImage from '../../../images/assets/images/avatars/avatar_4.jpg';


Modal.setAppElement('#root');

function UserProfile({ isModalOpen, handleCloseModal, userEmail }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('email', '==', userEmail));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    setUser(querySnapshot.docs[0].data());
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [userEmail]);

    const userDetails = [
        { label: 'User ID', value: user.userID },
        { label: 'Name', value: user.userName },
        { label: 'City', value: user.city },
        { label: 'Address', value: user.address },
        { label: 'Postal Code', value: user.postalCode },
        { label: 'Phone Number', value: user.phoneNumber },
        { label: 'Email', value: user.email },
        { label: 'Status', value: user.status },
        { label: 'Last Update Time', value: user.lastUpdateTime },
        { label: 'Create Time', value: user.createTime }
    ];

    return (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="User Profile"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            },
            content: {
              maxWidth: '600px',
              margin: 'auto',
              padding: '60px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '8px'
            }
          }}
        >
            <Paper elevation={3} style={{ padding: '20px', width: '100%', textAlign: 'center' }}>
                {/* Add Avatar here */}
                <Avatar 
                    src={UserImage} 
                    alt={user.userName} 
                    style={{ width: '80px', height: '80px', margin: '0 auto 20px' }}
                />

                <Typography variant="h5" gutterBottom>User Profile</Typography>
                
                <Grid container spacing={2}>
                    {userDetails.map(({ label, value }) => (
                        <Grid item xs={12} key={label}>
                            <Typography><strong>{label}:</strong> {value}</Typography>
                        </Grid>
                    ))}
                </Grid>
                
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleCloseModal} 
                    style={{ marginTop: '20px' }}
                >
                    Close
                </Button>
            </Paper>
        </Modal>
    );
}

export default UserProfile;
