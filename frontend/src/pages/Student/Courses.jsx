import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import CourseCard from "../../components/CourseCard";
import { Link } from "react-router-dom";
import axiosClient from "@/axiosClient";
function Courses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    axiosClient.get("/all_courses").then((response) => {
      setCourses((c) => response.data);
    });
  }, []);
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
        )
        )}
      </div>
    </section>
  );
}

export default Courses;
