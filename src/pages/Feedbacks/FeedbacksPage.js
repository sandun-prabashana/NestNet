import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Container, Grid } from "@mui/material";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../pages/FireBaseConfig2";

const FeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbacksCollection = collection(db, "feedbacks"); // use your collection name
        const q = query(feedbacksCollection, where("read", "==", "0"));
        const feedbacksSnapshot = await getDocs(q);

        const feedbacksList = feedbacksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedbacks(feedbacksList);
      } catch (error) {
        console.error("Error fetching feedbacks: ", error);
      }
    };

    fetchData();
  }, []);

  const StarRating = ({ starCount }) => {
    return (
      <div>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ color: i < starCount ? "gold" : "gray" }}>
            ☆
          </span>
        ))}
      </div>
    );
  };

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const handleCardClick = async (feedbackId) => {
    try {
      // Reference to the feedback document
      const feedbackRef = doc(db, 'feedbacks', feedbackId);

      // Update the read field to 1
      await updateDoc(feedbackRef, { read: "1" });

      // Optionally, you might want to remove the feedback from the UI
      setFeedbacks(feedbacks => feedbacks.filter(feedback => feedback.id !== feedbackId));
    } catch (error) {
      console.error("Error updating feedback: ", error);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Feedbacks
      </Typography>
      <Grid container spacing={3}>
        {feedbacks.map((feedback) => (
          <Grid item xs={12} md={12} key={feedback.id}>
            <Card
              sx={{
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
              onClick={() => handleCardClick(feedback.id)}  // Handle card click
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  <StarRating starCount={feedback.star} />
                </Typography>
                <Typography variant="h6" component="h2">
                  {feedback.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="right"
                  style={{ padding: "0 16px 16px" }}
                >
                  {timeSince(feedback.createTime)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default FeedbacksPage;