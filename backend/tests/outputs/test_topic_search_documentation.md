## **Endpoint Being Tested:** http://127.0.0.1:5000/topic_search

---

### ***Case:*** *Successful topic search query*

**Request Method:** `POST`  

**Inputs:**
```json
{
  "quest": "If-else statement"
}
```

**Expected Output:**
```
HTTP Status Code: 200 and JSON with 'results'
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"search_query": "If-else statement", "results": [{"Lecture Link": "https://www.youtube.com/watch?v=-dBqiRCHbNw&list=PLZ2ps__7DhBb2cXAu5PevO_mzgS3Fj3Fs&index=22", "Lecture Title": "Tutorial on if, else and else-if (elif) conditions", "Name Of Course": "Programming in Python", "Week Number": "2"}, {"Lecture Link": "https://www.youtube.com/watch?v=FTX5wF_3J9Q&list=PLZ2ps__7DhBb2cXAu5PevO_mzgS3Fj3Fs&index=21", "Lecture Title": "Introduction to the if statement", "Name Of Course": "Programming in Python", "Week Number": "2"}, {"Lecture Link": "https://www.youtube.com/watch?v=tDaXdoKfX0k&list=PLZ2ps__7DhBb2cXAu5PevO_mzgS3Fj3Fs&index=6", "Lecture Title": "Variables and Literals", "Name Of Course": "Programming in Python", "Week Number": "1"}]}
```

**Result:** `Success`

---

### ***Case:*** *Missing input field 'quest'*

**Request Method:** `POST`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 400 and error message 'A query is required'
```

**Actual Output:**
```
HTTP Status Code: 500
JSON: {"Error": "Failed to conclude topic search"}
```

**Result:** `Failed`

---

### ***Case:*** *Internal server error on topic search*

**Request Method:** `POST`  

**Inputs:**
```json
{
  "quest": null
}
```

**Expected Output:**
```
HTTP Status Code: 500 and error message
```

**Actual Output:**
```
HTTP Status Code: 500
JSON: {"Error": "Failed to conclude topic search"}
```

**Result:** `Success`

---

