import React from 'react'
import { Typography } from '@mui/material'
function Courses() {
    const currDate = new Date().toLocaleDateString();
const currTime = new Date().toLocaleTimeString();
  return (
    <section>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold'}}>
            COURSES
        </Typography>
        Date : {currDate} <br/>
        Time : {currTime}
    </section>
  )
}

export default Courses