## **Endpoint Being Tested:** http://127.0.0.1:5000/api/feedback-recommendations

---

### ***Case:*** *Successful feedback generation*

**Request Method:** POST  

**Inputs:**
```json
{
  "submitted_answers": [
    {
      "qid": 1,
      "answer": [
        "D"
      ]
    },
    {
      "qid": 2,
      "answer": [
        "B"
      ]
    },
    {
      "qid": 3,
      "answer": [
        "B",
        "D"
      ]
    },
    {
      "qid": 4,
      "answer": [
        "B",
        "C"
      ]
    },
    {
      "qid": 5,
      "answer": [
        "B"
      ]
    },
    {
      "qid": 6,
      "answer": [
        "1020"
      ]
    }
  ]
}
```

**Expected Output:**
```
HTTP Status Code: 200 and JSON with 'comprehensive_feedback'
```

**Actual Output:**
```
HTTP Status Code: 500
JSON: {
    "error": "Internal server error: 403 Request had insufficient authentication scopes. [reason: \"ACCESS_TOKEN_SCOPE_INSUFFICIENT\"\ndomain: \"googleapis.com\"\nmetadata {\n  key: \"service\"\n  value: \"generativelanguage.googleapis.com\"\n}\nmetadata {\n  key: \"method\"\n  value: \"google.ai.generativelanguage.v1beta.GenerativeService.GenerateContent\"\n}\n]"
}

```

**Result:** Failed

---

### ***Case:*** *Missing submitted_answers field*

**Request Method:** POST  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 500 and error message
```

**Actual Output:**
```
HTTP Status Code: 500
JSON: {
    "error": "Internal server error: division by zero"
}

```

**Result:** Success

---

### ***Case:*** *Internal server error due to invalid answer format*

**Request Method:** POST  

**Inputs:**
```json
{
  "submitted_answers": [
    {
      "qid": 1,
      "answer": "INVALID FORMAT"
    }
  ]
}
```

**Expected Output:**
```
HTTP Status Code: 400 and error message
```

**Actual Output:**
```
HTTP Status Code: 400
JSON: {
    "error": "answer must be a list of strings"
}

```

**Result:** Success

---

