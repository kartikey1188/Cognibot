import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import CourseCard from "../../components/CourseCard";
import { Link } from "react-router-dom";
function Courses() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section className="flex flex-col gap-4 p-3">
      <Typography
        variant="h4"
        component="div"
        sx={{ flexGrow: 1, fontWeight: "bold" }}
      >
        COURSES
      </Typography>
      <div className="self-end text-sm flex gap-2 text-gray-400 italic">
        <span>{formatDate(currentDateTime)}</span>
        <span>{currentDateTime.toLocaleTimeString()}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
      <Link to="/course" style={{ textDecoration: 'none' }}>
          <div>
            <CourseCard />
          </div>
        </Link>
        <Link to="/course" style={{ textDecoration: 'none' }}>
          <div>
            <CourseCard />
          </div>
        </Link>
        <Link to="/course" style={{ textDecoration: 'none' }}>
          <div>
            <CourseCard />
          </div>
        </Link>
      </div>
    </section>
  );
}

export default Courses;
