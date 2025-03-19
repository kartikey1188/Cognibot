## **Endpoint Being Tested:** `http://127.0.0.1:5000/all_students`

---

### ***Case:*** *Get all students*

**Request Method:** `GET`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and a list of students
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: [{"id": 1, "user": {"id": 1, "role": "student", "name": "John Doe", "email": "john.doe@example.com"}, "courses": []}, {"id": 2, "user": {"id": 2, "role": "student", "name": "Jane Smith", "email": "jane.smith@example.com"}, "courses": []}]
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/student/1`

---

### ***Case:*** *Get an individual student*

**Request Method:** `GET`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and student details
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"id": 1, "user": {"id": 1, "role": "student", "name": "John Doe", "email": "john.doe@example.com"}, "courses": []}
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/student/1`

---

### ***Case:*** *Update an individual student*

**Request Method:** `PUT`  

**Inputs:**
```json
{
  "name": "Updated Student Name",
  "email": "updated_email@example.com"
}
```

**Expected Output:**
```
HTTP Status Code: 200 and student updated successfully
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"message": "Student details updated successfully"}
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/student/1`

---

### ***Case:*** *Delete an individual student*

**Request Method:** `DELETE`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and student deleted successfully
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"message": "Student deleted successfully"}
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/student/1/courses`

---

### ***Case:*** *Get all courses of a student*

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
JSON: []
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/student/1/course/1`

---

### ***Case:*** *Enroll a student in a course*

**Request Method:** `POST`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 201 and student enrolled successfully
```

**Actual Output:**
```
HTTP Status Code: 201
JSON: {"message": "Student enrolled in course successfully"}
```

**Result:** `Success`

---

## **Endpoint Being Tested:** `http://127.0.0.1:5000/student/1/course/1/grade`

---

### ***Case:*** *Get a student's grade in a course*

**Request Method:** `GET`  

**Inputs:**
```json
{}
```

**Expected Output:**
```
HTTP Status Code: 200 and grade details
```

**Actual Output:**
```
HTTP Status Code: 200
JSON: {"grade_obtained": "A"}
```

**Result:** `Success`

---

