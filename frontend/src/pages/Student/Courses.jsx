import { useState, useEffect } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import CourseCard from "../../components/CourseCard";
import { Link } from "react-router-dom";
import axiosClient from "@/axiosClient";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/all_courses")
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <section className="flex flex-col gap-4 p-3">
      <Typography
        variant="h4"
        component="div"
        sx={{ flexGrow: 1, fontWeight: "bold" }}
      >
        COURSES
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
        {courses.map(course=> (
          <Link to={`/course/${course.course_id}`} style={{ textDecoration: "none" }} key={course.course_id}>
            <div>
              <CourseCard course={course}/>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Courses;