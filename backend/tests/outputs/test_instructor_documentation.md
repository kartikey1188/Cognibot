## **Endpoint Being Tested:** `http://127.0.0.1:5000/all_instructors`

---

### ***Case:*** *Get all instructors*

**Request Method:** `GET`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and a list of instructors
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: [{"id": 1, "user": {"id": 1, "role": "instructor", "name": "John Doe", "email": "john.doe@example.com"}, "courses": [], "description": "No description provided."}, {"id": 2, "user": {"id": 2, "role": "instructor", "name": "Jane Smith", "email": "jane.smith@example.com"}, "courses": [], "description": "No description provided."}]
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/instructor/1`

---

### ***Case:*** *Get an individual instructor*

**Request Method:** `GET`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and instructor details
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"id": 1, "user": {"id": 1, "role": "instructor", "name": "John Doe", "email": "john.doe@example.com"}, "courses": [], "description": "No description provided."}
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/instructor/1`

---

### ***Case:*** *Delete an individual instructor*

**Request Method:** `DELETE`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and instructor deleted successfully
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"message": "Instructor deleted successfully"}
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/instructor/1/courses`

---

### ***Case:*** *Get all courses assigned to an instructor*

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
JSON: [{"course_id": 1, "course_name": "Test Course", "course_code": "TC101", "description": "No description provided.", "level": "Foundational", "type": "Programming", "image": null, "instructors": [1], "students": [], "assignments": null}]
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/instructor/1/course/1`

---

### ***Case:*** *Assign an instructor to a course*

**Request Method:** `POST`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 201 and instructor assigned successfully
```

**Actual Output:**
```
HTTP Status Code: 201
JSON: {"message": "Instructor assigned to course successfully"}
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/instructor/1/course/1`

---

### ***Case:*** *Remove an instructor from a course*

**Request Method:** `DELETE`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and instructor removed successfully
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"message": "Instructor removed from course successfully"}
```

**Result:** `Success`

---

