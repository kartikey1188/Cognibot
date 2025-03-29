import React from 'react';
import { Typography, Card, CardContent, Avatar, Button, List, ListItem, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
function StudentProfile() {
  const user = useSelector((state)=>state.auth.user)
  return (
    <section className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <Card className="p-6 shadow-md flex flex-col items-center text-center">
        <Avatar sx={{ width: 100, height: 100 }} src="https://via.placeholder.com/100" alt="Rashmi" />
        <Typography variant="h5" className="mt-4 font-bold">
          {user.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user.email}
        </Typography>
        <Typography variant="body2" className="mt-2">
          Enthusiastic learner passionate about Python and Machine Learning.
        </Typography>
      </Card>

      <Card className="shadow-md">
        <CardContent>
          <Typography variant="h6" className="font-bold mb-3">
            Enrolled Courses
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Programming in Python" secondary="Instructor: Sudarshan Iyenagar" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Machine Learning Practices" secondary="Instructor: Arun Rajkumar" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Software Engineering" secondary="Instructor: Prajish Prasad" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </section>
  );
}

export default StudentProfile;