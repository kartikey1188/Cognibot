## **Endpoint Being Tested:** http://127.0.0.1:5000/clarification

---

### ***Case:*** *Successful clarification generation*

**Request Method:** `POST`  

**Inputs:**
```json
{
  "user_id": 125,
  "quest": "What are variables and literals in Python?"
}
```

**Expected Output:**
```
HTTP Status Code: 200 and JSON with 'response'
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"query": "What are variables and literals in Python?", "response": "In Python, a variable is a named storage location that holds a value.  The value can be changed during the program's execution.  A literal, on the other hand, is a fixed value directly written into the code.  For example, `name = \"Alice\"` declares a variable named `name` and assigns it the literal string value \"Alice\".  The variable `name` can later be assigned a different literal value, such as `\"Bob\"`.  Literals are the actual values stored in variables.  Variables can store different literal values, and these values can be modified as needed.  Literals are typically used on the right-hand side of an assignment, whereas variables can be used on either side.  The choice between using a variable or a literal depends on whether the value is expected to change during the program's execution. If the value is constant, a literal is appropriate; if the value might change, a variable is preferred."}
```

**Result:** `Success`

---

### ***Case:*** *Missing query in request payload*

**Request Method:** `POST`  

**Inputs:**
```json
{
  "user_id": 125,
  "quest": ""
}
```

**Expected Output:**
```
HTTP Status Code: 400 and error message
```

**Actual Output:**
```
HTTP Status Code: 400
JSON: {"Error": "A query is required"}
```

**Result:** `Success`

---

### ***Case:*** *Internal server error during clarification generation*

**Request Method:** `POST`  

**Inputs:**
```json
{
  "user_id": -999,
  "quest": "This should trigger a server-side failure"
}
```

**Expected Output:**
```
HTTP Status Code: 500 and error message
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"query": "This should trigger a server-side failure", "response": "I can only answer syllabus-related questions. Please ask something relevant to the syllabus."}
```

**Result:** `Failed`

---

