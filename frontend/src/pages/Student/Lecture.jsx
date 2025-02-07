import { useState } from "react";
import { Typography, Box, Paper, Button, Rating, TextField } from "@mui/material";
import OfflineBoltRoundedIcon from "@mui/icons-material/OfflineBoltRounded";

function Lecture() {

    const [value, setValue] = useState(0);
  const [comment, setComment] = useState('');
  return (
    <section className="lecture-section flex flex-col gap-5">
      <div className="flex flex-wrap gap-2 ">
        <div className="flex-grow-[2]">
          <Typography variant="h3" fontWeight="bold">
            Lecture Name
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "48%",
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              src="https://www.youtube.com/embed/p4D8-brdrZo?si=A4EN9dSP1qcRlgzk"
              title="Lecture Video"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </Box>
        </div>
        <Paper elevation={3} sx={{ flex: 1, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Lecture Summary
          </Typography>
          <Box sx={{ height: 300, mb: 2, overflow: "auto", p: 2, boxShadow: "inset 0px 1px 2px 1px rgba(0,0,0,0.2), inset 0px 4px 5px 0px rgba(0, 0, 0, 0.03)" }}>
            <Typography variant="body1" color="text.secondary">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
              eveniet, non laborum facilis atque vero eligendi nisi cum a quo ab
              possimus quaerat nihil ipsa ea tenetur? Tempore, ipsum nostrum?
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth

            startIcon={<OfflineBoltRoundedIcon />}
            onClick={() => console.log("Generate Summary")}
          >
            Summarize
          </Button>
        </Paper>
      </div>
      <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Review Lecture
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography component="legend">Rating:</Typography>
                <Rating
                  name="lecture-rating"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  precision={0.5}
                />
              </Box>

              <TextField
                fullWidth
                label="Your Review"
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                  }
                }}
              />

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => console.log({ rating: value, comment })}
              >
                Submit Review
              </Button>
            </Box>
          </Paper>
    </section>
  );
}

export default Lecture;
