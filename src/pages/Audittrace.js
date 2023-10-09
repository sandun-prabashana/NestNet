import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "./FireBaseConfig2";
import {Typography ,TextField} from '@mui/material';
import { Container, Card, CardContent } from '@mui/material';
import Timeline from "@mui/lab/Timeline"; 
import TimelineItem from "@mui/lab/TimelineItem"; 
import TimelineSeparator from "@mui/lab/TimelineSeparator"; 
import TimelineConnector from "@mui/lab/TimelineConnector"; 
import TimelineContent from "@mui/lab/TimelineContent"; 
import TimelineDot from "@mui/lab/TimelineDot"; 

const Audittrace = () => {
    const [activities, setActivities] = useState([]);
    const [email, setEmail] = useState(""); // new state variable for email
  
    useEffect(() => {
        console.log('Email for filtering:', email); // Log 1
    
        const fetchData = async () => {
          try {
            const auditTraceQuery = query(
              collection(db, "audittrace"),
              where("EMAIL", "==", email),
              orderBy("CREATEDTIME")
            );
            const auditTraceDocs = await getDocs(auditTraceQuery);
            
            console.log('Docs fetched from Firestore:', auditTraceDocs); // Log 2
            
            const auditTraceData = auditTraceDocs.docs.map(doc => ({...doc.data(), id: doc.id}));
            console.log('Mapped data:', auditTraceData); // Log 3
    
            setActivities(auditTraceData);
          } catch (error) {
            console.error("Error fetching data: ", error);
            setActivities([]);
          }
        };
        fetchData();
    }, [email]);
  
    const handleEmailChange = (e) => { // new handler for input change
      setEmail(e.target.value);
    };

    return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Users Audittrace
            </Typography>
            {/* Email input using Material-UI */}
            <TextField 
              type="email" 
              value={email} 
              onChange={handleEmailChange} 
              label="Filter by email" 
              variant="outlined" 
              fullWidth
              margin="normal"
            />
            <Timeline position="alternate">
              {activities.map((activity, index) => (
                <TimelineItem key={activity.AUDITTRACEID}>
                  <TimelineSeparator>
                    <TimelineDot color={index % 2 === 0 ? "primary" : "secondary"} />
                    {index !== activities.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {activity.DESCRIPTION}
                    </Typography>
                    <Typography>
                      {new Date(activity.CREATEDTIME).toLocaleString()}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>
      );
    };
    
    export default Audittrace;