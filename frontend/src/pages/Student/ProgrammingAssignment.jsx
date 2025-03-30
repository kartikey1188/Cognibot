import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosClient";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

function ProgrammingAssignment() {
  const [code, setCode] = useState("# Write your solution here\n");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [compileError, setCompileError] = useState(null);
  const [skulptReady, setSkulptReady] = useState(false);

  // Dynamically load Skulpt from public folder
  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

    const loadSkulpt = async () => {
      try {
        await loadScript("/skulpt.min.js");
        await loadScript("/skulpt-stdlib.js");
        console.log("✅ Skulpt loaded");
        setSkulptReady(true);
      } catch (err) {
        console.error("❌ Failed to load Skulpt", err);
        setCompileError("Failed to load Python engine. Please refresh or try again.");
      }
    };

    loadSkulpt();
  }, []);

  const validateCode = () => {
    if (!code || typeof code !== "string" || code.trim() === "" || code.trim() === "# Write your solution here") {
      setError("Code cannot be empty.");
      return false;
    }
    return true;
  };

  const handleCompile = () => {
    setCompileError(null);
    if (!validateCode()) return;

    const outputElement = document.getElementById("python-output");
    if (outputElement) outputElement.innerHTML = "";

    const outf = (text) => {
      outputElement.innerHTML += text + "<br />";
    };

    window.Sk.configure({
      output: outf,
      read: (x) => {
        if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles["files"][x] === undefined) {
          throw "File not found: '" + x + "'";
        }
        return window.Sk.builtinFiles["files"][x];
      },
    });

    window.Sk.misceval
      .asyncToPromise(() => window.Sk.importMainWithBody("<stdin>", false, code, true))
      .catch((err) => {
        console.error("Skulpt Error:", err);
        setCompileError(err.toString());
      });
  };

  const handleSubmit = async () => {
    if (!validateCode()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/assignment_feedback", {
        user_id: 1,
        code,
      });
      setResult(response.data);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      const errMsg = err?.response?.data?.message;
      setError(typeof errMsg === "string" ? errMsg : "An error occurred while submitting your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", pb: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Programming Assignment
      </Typography>

      <Paper sx={{ p: 3, mb: 3, backgroundColor: "background.paper", borderRadius: 2 }}>
        <Typography variant="h6">{sampleQuestion.title}</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>{sampleQuestion.description}</Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic", mb: 2 }}>
          Example: {sampleQuestion.example}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" gutterBottom>Write your Python code below:</Typography>
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your Python code here..."
          sx={{ mb: 2 }}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const textarea = e.target;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const updatedCode = code.substring(0, start) + "\t" + code.substring(end);
              setCode(updatedCode);
              setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 1;
              }, 0);
            }
          }}
        />

        <SyntaxHighlighter language="python" style={materialDark} showLineNumbers>
          {code}
        </SyntaxHighlighter>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCompile} disabled={!skulptReady}>
            Compile
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Box>

        {!skulptReady && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Loading Python environment...
          </Alert>
        )}

        {compileError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {compileError}
          </Alert>
        )}

        <Typography variant="h6" sx={{ mt: 3 }}>Output:</Typography>
        <div
          id="python-output"
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            marginTop: "10px",
            minHeight: "100px",
            maxHeight: "200px",
            overflowY: "auto",
            fontFamily: "monospace",
          }}
        ></div>

        {submitted && result && (
          <Paper sx={{ mt: 3, p: 2, bgcolor: "primary.light", color: "primary.contrastText" }}>
            <Typography variant="h6">Execution Output:</Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {result.execution_result || "No output."}
            </Typography>

            {result.error && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" color="error">Error:</Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {result.error.type}: {result.error.message}
                </Typography>
              </>
            )}

            {result.feedback && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">AI Feedback:</Typography>
                <Box sx={{ mt: 1, pl: 1 }}>
                  <ReactMarkdown>{result.feedback}</ReactMarkdown>
                </Box>
              </>
            )}
          </Paper>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}

const sampleQuestion = {
  title: "Sum of Two Numbers",
  description: "Write a function `sum(a, b)` that takes two numbers as input and returns their sum.",
  example: "Input: a = 5, b = 3\nOutput: 8",
};

export default ProgrammingAssignment;
