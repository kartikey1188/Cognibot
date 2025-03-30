import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from "@mui/material";
import AssistantIcon from "@mui/icons-material/Assistant";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axiosClient from "@/axiosClient";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton } from '@mui/material';
import { useSelector } from "react-redux";

const InstructorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState({});
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [reportLoading, setReportLoading] = useState({});
  const [lectures, setLectures] = useState({});
  const [faqLoading, setFaqLoading] = useState({});
  const [faqSuggestions, setFaqSuggestions] = useState({});
  const user = useSelector((state) => state.auth.user);
  const [expandedFaqItems, setExpandedFaqItems] = useState({});

  const handleFaqItemToggle = (lectureId) => {
    setExpandedFaqItems((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };
  const handleCourseChange = (courseId) => (event, isExpanded) => {
    setExpandedCourse(isExpanded ? courseId : false);
  };

  const handleWeekChange = (courseId, week) => async (event, isExpanded) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [`${courseId}-${week}`]: isExpanded,
    }));

    if (isExpanded && !lectures[`${courseId}-${week}`]) {
      try {
        const response = await axiosClient.get(`/lectures/${courseId}/${week}`);
        setLectures((prev) => ({
          ...prev,
          [`${courseId}-${week}`]: response.data,
        }));
      } catch (error) {
        console.error(
          `Failed to fetch lectures for course ${courseId}, week ${week}`
        );
      }
    }
  };

  const fetchFaqSuggestions = async (lectureId) => {
    setFaqLoading((prev) => ({ ...prev, [lectureId]: true }));
    try {
      const response = await axiosClient.get(`/faq_suggestions/${lectureId}`);
      setFaqSuggestions((prev) => ({
        ...prev,
        [lectureId]: response.data,
      }));
    } catch (error) {
      console.error(`Failed to fetch FAQ suggestions for lecture ${lectureId}`);
    } finally {
      setFaqLoading((prev) => ({ ...prev, [lectureId]: false }));
    }
  };

  const formatBotResponse = (text) => {
    if (!text) return "";
    const paragraphs = text.replace(/^\* /gm, "- ").split("\n\n");

    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith("## ")) {
        return (
          <Typography
            key={index}
            variant="h6"
            sx={{
              color: "primary.main",
              mt: 3,
              mb: 2,
              fontWeight: 600,
            }}
          >
            {paragraph.substring(3)}
          </Typography>
        );
      }

      if (paragraph.includes("\n- ")) {
        const items = paragraph.split("\n- ").filter(Boolean);
        return (
          <Box key={index} sx={{ mb: 2 }}>
            <ul
              style={{
                paddingLeft: "20px",
                marginBottom: "16px",
                listStyleType: "disc",
              }}
            >
              {items.map((item, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>
                  <Typography>
                    {item
                      .split(/\*\*(.*?)\*\*/)
                      .map((part, j) =>
                        j % 2 === 0 ? part : <strong key={j}>{part}</strong>
                      )}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        );
      }

      if (paragraph.includes("`")) {
        return (
          <Box key={index} sx={{ mb: 2 }}>
            {paragraph.split(/`(.*?)`/).map((part, i) =>
              i % 2 === 0 ? (
                <Typography key={i} component="span">
                  {part
                    .split(/\*\*(.*?)\*\*/)
                    .map((boldPart, j) =>
                      j % 2 === 0 ? (
                        boldPart
                      ) : (
                        <strong key={j}>{boldPart}</strong>
                      )
                    )}
                </Typography>
              ) : (
                <code
                  key={i}
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                >
                  {part}
                </code>
              )
            )}
          </Box>
        );
      }
      return (
        <Typography key={index} sx={{ mb: 2, lineHeight: 1.6 }}>
          {paragraph
            .split(/\*\*(.*?)\*\*/)
            .map((part, i) =>
              i % 2 === 0 ? part : <strong key={i}>{part}</strong>
            )}
        </Typography>
      );
    });
  };

  const fetchWeekReport = async (courseId, week) => {
    const loadingKey = `${courseId}-${week}`;
    setReportLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await axiosClient.post("/lecture_review_report", {
        course_id: courseId,
        week: week,
      });

      if (response.data?.lecture_review_report) {
        setReports((prev) => ({
          ...prev,
          [courseId]: {
            ...prev[courseId],
            weeks: [
              ...(prev[courseId]?.weeks || []).filter((w) => w.week !== week),
              {
                week,
                report: response.data.lecture_review_report,
              },
            ],
          },
        }));
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setReports((prev) => ({
          ...prev,
          [courseId]: {
            ...prev[courseId],
            weeks: [
              ...(prev[courseId]?.weeks || []).filter((w) => w.week !== week),
              {
                week,
                report: "No review available for this week",
              },
            ],
          },
        }));
      }
    } finally {
      setReportLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesResponse = await axiosClient.get("/all_courses");
        setCourses(coursesResponse.data);
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const renderLectures = (courseId, week) => {
    const lecturesList = lectures[`${courseId}-${week}`] || [];

    return lecturesList.map((lecture) => (
      <Box
        key={lecture.lecture_id}
        sx={{
          mt: 2,
          p: 2,
          backgroundColor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            {lecture.title || `Lecture ${lecture.lecture_id}`}
          </Typography>
          {!faqSuggestions[lecture.lecture_id] ? (
            <Button
              size="small"
              variant="outlined"
              onClick={() => fetchFaqSuggestions(lecture.lecture_id)}
              startIcon={
                faqLoading[lecture.lecture_id] ? (
                  <CircularProgress size={20} />
                ) : (
                  <AssistantIcon />
                )
              }
              disabled={faqLoading[lecture.lecture_id]}
            >
              Generate FAQ
            </Button>
          ) : (
            <IconButton
              size="small"
              onClick={() => handleFaqItemToggle(lecture.lecture_id)}
            >
              {expandedFaqItems[lecture.lecture_id] ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          )}
        </Box>

        {faqLoading[lecture.lecture_id] && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {faqSuggestions[lecture.lecture_id] && (
          <Box
            sx={{
              mt: 1,
              overflow: "hidden",
              maxHeight: expandedFaqItems[lecture.lecture_id]
                ? "2000px"
                : "0px",
              transition: "all 0.3s ease",
              opacity: expandedFaqItems[lecture.lecture_id] ? 1 : 0,
            }}
          >
            {formatBotResponse(
              faqSuggestions[lecture.lecture_id].faq_suggestions
            )}
          </Box>
        )}
      </Box>
    ));
  };
  const renderWeekSection = (course) => {
    return [1, 2].map((week) => {
      const loadingKey = `${course.course_id}-${week}`;
      const weekData = reports[course.course_id]?.weeks?.find(
        (w) => w.week === week
      );

      return (
        <Accordion
          key={`${course.course_id}-week-${week}`}
          expanded={expandedWeeks[loadingKey] || false}
          onChange={handleWeekChange(course.course_id, week)}
          disableGutters
          sx={{
            "&:before": { display: "none" },
            boxShadow: "none",
            bgcolor: "transparent",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              pl: 3,
              minHeight: "48px",
              "& .MuiAccordionSummary-content": { my: 0 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Week {week}
              </Typography>
              {!weekData && (
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchWeekReport(course.course_id, week);
                  }}
                  startIcon={
                    reportLoading[loadingKey] ? (
                      <CircularProgress size={20} />
                    ) : (
                      <AssistantIcon />
                    )
                  }
                  disabled={reportLoading[loadingKey]}
                >
                  Generate Review Report
                </Button>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 3, py: 1 }}>
            {reportLoading[loadingKey] ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                {weekData && (
                  <Box
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.03)",
                      p: 2,
                      borderRadius: 1,
                      mb: 3,
                    }}
                  >
                    {formatBotResponse(weekData.report)}
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Lecture FAQ Suggestions
                </Typography>
                {renderLectures(course.course_id, week)}
              </>
            )}
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  return (
    <>
      <Box sx={{ maxWidth: "1200px", mx: "auto", p: 5, mt: 16 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Typography
              variant="h3"
              component="h1"
              color="primary"
              fontWeight="bold"
              gutterBottom
            >
              Instructor Dashboard - {user.name}
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Review reports for your courses
            </Typography>

            <Box sx={{ mt: 3 }}>
              {courses.map((course) => (
                <Accordion
                  key={course.course_id}
                  expanded={expandedCourse === course.course_id}
                  onChange={handleCourseChange(course.course_id)}
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      borderBottom:
                        expandedCourse === course.course_id
                          ? "1px solid rgba(0,0,0,0.1)"
                          : "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        pr: 2,
                      }}
                    >
                      <Typography variant="h6" component="h3" fontWeight="bold">
                        {course.course_name}
                      </Typography>
                      <Tooltip title="AI Generated Reports">
                        <AssistantIcon color="primary" sx={{ ml: 2 }} />
                      </Tooltip>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    {renderWeekSection(course)}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default InstructorDashboard;
