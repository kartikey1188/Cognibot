import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function ImgMediaCard({course}) {
  return (
    <Card
      sx={{
        boxShadow: 3,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 8,
          "& .MuiCardMedia-root": {
            transform: "scale(1.1)",
          },
        },
        cursor: "pointer",
      }}
    >
      <Box sx={{ position: "relative" , overflow: "hidden"}}>
        <CardMedia
          component="img"
          alt="course image"
          height="140"
          image="/card-image.jpg"
          sx={{
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
            },
          }}
        />
      </Box>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          
          sx={{
           
            textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          {course.course_name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
         {course.type}
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small">Share</Button>
        <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}
