import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './FireBaseConfig2';
import { collection, query, where, getDocs, updateDoc, addDoc } from "firebase/firestore";
import { Container, Typography, Paper, CircularProgress, Box } from '@mui/material';
import '../utils/EmailVerificationPage.css';

function EmailVerificationPage() {
  const { token } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [success, setSuccess] = React.useState(false);

  const audittraceCollectionRef = collection(db, "audittrace");

  const randomID = Math.floor(Math.random() * 1000000);

  const currentTime = new Date().toISOString();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Query and update logic here...
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', token));
        const querySnapshot = await getDocs(q);

        let username = ""; // Default username in case no document is found

        querySnapshot.forEach((doc) => {
          const userRef = doc.ref;
          updateDoc(userRef, { flag: 1 });
          username = doc.data().userName; // Assuming that the username is stored in the user document
        });

        const userIP = "0.0.0.0"; 

        await addDoc(audittraceCollectionRef, {
          AUDITTRACEID: `trace${randomID}`, 
          CREATEDTIME: currentTime,
          DESCRIPTION: "Verified Email",
          IP: userIP,
          LASTUPDATEDTIME: currentTime,
          LASTUPDATEDUSER: username, // Updating with username
          EMAIL: token
        });

        setSuccess(true);
      } catch (error) {
        console.error("Verification error: ", error);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="verification-container">  {/* Apply CSS class */}
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
          {loading ? (
            <>
              <CircularProgress />
              <Typography component="h1" variant="h5">
                Verifying...
              </Typography>
            </>
          ) : (
            <>
              {success ? (
                <>
                  <Typography component="h1" variant="h5" gutterBottom>
                    Thank You!
                  </Typography>
                  <Typography variant="body1">
                    Your email has been successfully verified. You can now enjoy full access to our platform.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography component="h1" variant="h5" gutterBottom>
                    Oops!
                  </Typography>
                  <Typography variant="body1">
                    Something went wrong with the verification process. Please try again later or contact support.
                  </Typography>
                </>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Container>
    </div>
  );
}

export default EmailVerificationPage;
