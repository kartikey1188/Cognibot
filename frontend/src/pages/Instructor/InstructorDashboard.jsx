import React, { useEffect, useState } from 'react';
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails, Grid, Tooltip, CircularProgress, Alert, Button, } from '@mui/material';
import AssistantIcon from "@mui/icons-material/Assistant";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosClient from '@/axiosClient';
import { useSelector } from 'react-redux';

const InstructorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState({});
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [reportLoading, setReportLoading] = useState({});
  const user = useSelector(state => state.auth.user);

  const handleCourseChange = (courseId) => (event, isExpanded) => {
    setExpandedCourse(isExpanded ? courseId : false);
  };

  const handleWeekChange = (courseId, week) => (event, isExpanded) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [`${courseId}-${week}`]: isExpanded
    }));
  };

  const formatBotResponse = (text) => {
    if (!text) return "";

    const paragraphs = text
      .replace(/^\* /gm, '- ')
      .split('\n\n');

    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <Typography 
            key={index}
            variant="h6" 
            sx={{ 
              color: 'primary.main',
              mt: 3,
              mb: 2,
              fontWeight: 600 
            }}
          >
            {paragraph.substring(3)}
          </Typography>
        );
      }

      if (paragraph.includes('\n- ')) {
        const items = paragraph
          .split('\n- ')
          .filter(Boolean);
        return (
          <Box key={index} sx={{ mb: 2 }}>
            <ul style={{ 
              paddingLeft: '20px',
              marginBottom: '16px',
              listStyleType: 'disc' 
            }}>
              {items.map((item, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>
                  <Typography>
                    {item.split(/\*\*(.*?)\*\*/).map((part, j) => 
                      j % 2 === 0 ? part : <strong key={j}>{part}</strong>
                    )}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        );
      }

      if (paragraph.includes('`')) {
        return (
          <Box key={index} sx={{ mb: 2 }}>
            {paragraph.split(/`(.*?)`/).map((part, i) => 
              i % 2 === 0 ? (
                <Typography key={i} component="span">
                  {part.split(/\*\*(.*?)\*\*/).map((boldPart, j) => 
                    j % 2 === 0 ? boldPart : <strong key={j}>{boldPart}</strong>
                  )}
                </Typography>
              ) : (
                <code key={i} style={{
                  backgroundColor: '#f5f5f5',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}>
                  {part}
                </code>
              )
            )}
          </Box>
        );
      }

      return (
        <Typography key={index} sx={{ mb: 2, lineHeight: 1.6 }}>
          {paragraph.split(/\*\*(.*?)\*\*/).map((part, i) => 
            i % 2 === 0 ? part : <strong key={i}>{part}</strong>
          )}
        </Typography>
      );
    });
  };

  const fetchWeekReport = async (courseId, week) => {
    const loadingKey = `${courseId}-${week}`;
    setReportLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await axiosClient.post('/lecture_review_report', {
        course_id: courseId,
        week: week
      });

      if (response.data?.lecture_review_report) {
        setReports(prev => ({
          ...prev,
          [courseId]: {
            ...prev[courseId],
            weeks: [
              ...(prev[courseId]?.weeks || []).filter(w => w.week !== week),
              {
                week,
                report: response.data.lecture_review_report
              }
            ]
          }
        }));
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setReports(prev => ({
          ...prev,
          [courseId]: {
            ...prev[courseId],
            weeks: [
              ...(prev[courseId]?.weeks || []).filter(w => w.week !== week),
              {
                week,
                report: "No review available for this week"
              }
            ]
          }
        }));
      }
    } finally {
      setReportLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesResponse = await axiosClient.get('/all_courses');
        setCourses(coursesResponse.data);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const renderWeekSection = (course) => {
    return [1, 2].map((week) => {
      const loadingKey = `${course.course_id}-${week}`;
      const weekData = reports[course.course_id]?.weeks?.find(w => w.week === week);
      
      return (
        <Accordion
          key={`${course.course_id}-week-${week}`}
          expanded={expandedWeeks[loadingKey] || false}
          onChange={handleWeekChange(course.course_id, week)}
          disableGutters
          sx={{ 
            '&:before': { display: 'none' },
            boxShadow: 'none',
            bgcolor: 'transparent'
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              pl: 3,
              minHeight: '48px',
              '& .MuiAccordionSummary-content': { my: 0 }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%'
            }}>
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
                  startIcon={reportLoading[loadingKey] ? 
                    <CircularProgress size={20} /> : 
                    <AssistantIcon />}
                  disabled={reportLoading[loadingKey]}
                >
                  Generate Report
                </Button>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 3, py: 1 }}>
            {reportLoading[loadingKey] ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : weekData ? (
              <Box 
                sx={{ 
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  p: 2,
                  borderRadius: 1
                }}
              >
                {formatBotResponse(weekData.report)}
              </Box>
            ) : null}
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  return (
    <>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 5, mt: 8 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : (
          <>
            <Typography variant="h3" component="h1" color="primary" fontWeight="bold" gutterBottom>
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
                      borderBottom: expandedCourse === course.course_id ? 
                        '1px solid rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      width: '100%',
                      pr: 2
                    }}>
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