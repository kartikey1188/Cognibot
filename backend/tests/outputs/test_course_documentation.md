### **Endpoint Being Tested:** `http://127.0.0.1:5000/all_courses`

---

### ***Case:*** *Successful course listing*

**Request Method:** `GET`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and a list of courses
```

**Actual Output:**
```
HTTP Status Code: 200
Response: [
    {
        "course_id": 1,
        "course_name": "Programming in Python",
        "course_code": "BSCS1002",
        "description": null,
        "level": "Foundational",
        "type": "Programming",
        "image": null,
        "instructors": [],
        "students": [],
        "assignments": null
    },
    {
        "course_id": 2,
        "course_name": "Software Enginnering",
        "course_code": "BSCS3001",
        "description": null,
        "level": "Degree",
        "type": "Programming",
        "image": null,
        "instructors": [],
        "students": [],
        "assignments": null
    },
    {
        "course_id": 3,
        "course_name": "Machine Learning Practice",
        "course_code": "BSCS2008",
        "description": null,
        "level": "Diploma",
        "type": "Data Science",
        "image": null,
        "instructors": [],
        "students": [],
        "assignments": null
    }
]

```

**Result:** `Success`

---

### **Endpoint Being Tested:** `http://127.0.0.1:5000/all_courses`

---

### ***Case:*** *Invalid method used for course listing*

**Request Method:** `POST`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 405 and method not allowed error
```

**Actual Output:**
```
HTTP Status Code: 405
JSON: {"message": "The method is not allowed for the requested URL."}
```

**Result:** `Success`

---

### **Endpoint Being Tested:** `http://127.0.0.1:5000/course`

---

### ***Case:*** *Create a new course*

**Request Method:** `POST`  

**Inputs:**
```json
{
  "course_name": "Test Course",
  "course_code": "TC101",
  "level": "Diploma",
  "type": "Programming",
  "description": "This is a test course."
}
```

**Expected Output:**
```
HTTP Status Code: 201 and course created successfully
```

**Actual Output:**
```
HTTP Status Code: 201
JSON: {"message": "Course created successfully", "course_id": 1}
```

**Result:** `Success`

---

### **Endpoint Being Tested:** `http://127.0.0.1:5000/course/1`

---

### ***Case:*** *Get an individual course*

**Request Method:** `GET`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and course details
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"course_id": 1, "course_name": "Machine Learning Practice", "course_code": "BSCS2008", "description": null, "level": "Diploma", "type": "Data Science", "image": null, "instructors": [], "students": [], "assignments": null}
```

**Result:** `Success`

---

### **Endpoint Being Tested:** `http://127.0.0.1:5000/course/1`

---

### ***Case:*** *Update an existing course*

**Request Method:** `PUT`  

**Inputs:**
```json
{
  "course_name": "Updated Test Course",
  "description": "Updated description"
}
```

**Expected Output:**
```
HTTP Status Code: 200 and course updated successfully
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"message": "Course details updated successfully"}
```

**Result:** `Success`

---

### **Endpoint Being Tested:** `http://127.0.0.1:5000/course/1`

---

### ***Case:*** *Delete an existing course*

**Request Method:** `DELETE`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and course deleted successfully
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"message": "Course deleted successfully"}
```

**Result:** `Success`

---

