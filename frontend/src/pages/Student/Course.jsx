import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useParams } from 'react-router-dom'
import axiosInstance from "../../axiosClient";

function Course() {
  const {id} = useParams()
  const [course, setCourse] = useState({})
  useEffect(()=>{
    axiosInstance.get(`/course/${id}`)
    .then(response=>{
      setCourse(response.data)
    })
  },[])
  return (
    <section>
      <Typography variant="h3">{course.course_name}</Typography>
      <Typography variant="body1">
        This course provides a comprehensive introduction to Python programming,
        covering fundamental concepts and advanced techniques. Whether you're a
        beginner or have prior coding experience, this course will equip you
        with the skills to write efficient Python programs and solve real-world
        problems.
      </Typography>
    </section>
  );
}

export default Course;
