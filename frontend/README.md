# 🚀 EduNova – AI-Powered Live Classroom Question Organizer

## 1. Project Overview

**EduNova** is an AI-powered live classroom platform designed to solve the problem of repeated and unorganized questions during live classes.

### Problem P11

During a live class, students ask questions at different times and use different words for the same doubt.

For example:

* "What is inheritance?"
* "Can you explain inheritance?"
* "I don't understand inheritance."
* "What does inheritance mean?"

Although these are different messages, they represent almost the same doubt.

EduNova uses AI to:

* Detect similar questions
* Group repeated questions
* Categorize questions
* Identify important questions
* Detect possible class-wide doubts
* Prioritize questions for the teacher
* Allow the teacher to answer one grouped question
* Send the answer to related students
* Provide a class summary

The official P11 problem identifies repeated wording, scattered questions, administrative messages, and unresolved conceptual misunderstandings as the central problem.

---

# 2. 🎯 Main Goal

Build a working live classroom system where:

```text
Student asks question
        ↓
Question goes to backend
        ↓
AI analyzes question
        ↓
Similar questions are found
        ↓
Questions are grouped
        ↓
Question is categorized
        ↓
Priority is calculated
        ↓
Question saved in MongoDB
        ↓
Teacher dashboard updates
        ↓
Teacher answers grouped doubt
        ↓
Related students receive answer
```

---

# 3. 🛠 Technology Stack

## Frontend

* React
* Vite
* JavaScript
* HTML
* CSS
* Axios
* Socket.IO Client

Optional:

* Lucide React
* WebRTC

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* CORS
* dotenv
* bcryptjs
* JSON Web Token

## AI Service

* Python
* FastAPI
* Sentence Transformers
* scikit-learn
* NumPy
* Pydantic

## Database

* MongoDB Atlas

## Development Tools

* VS Code
* Git
* GitHub
* Postman
* MongoDB Atlas

---

# 4. 📁 Final Project Structure

```text
EduNova/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── VideoPanel.jsx
│   │   │   ├── QuestionInput.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── QuestionGroup.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   ├── CategoryBadge.jsx
│   │   │   ├── AnswerBox.jsx
│   │   │   └── Loading.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── StudentHome.jsx
│   │   │   ├── TeacherHome.jsx
│   │   │   ├── CreateClass.jsx
│   │   │   ├── JoinClass.jsx
│   │   │   ├── LiveClass.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── ClassSummary.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   │
│   └── package.json
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── classController.js
│   │   ├── questionController.js
│   │   ├── answerController.js
│   │   └── summaryController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Class.js
│   │   ├── Question.js
│   │   ├── QuestionGroup.js
│   │   └── Answer.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── classRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── answerRoutes.js
│   │   └── summaryRoutes.js
│   │
│   ├── services/
│   │   └── aiService.js
│   │
│   ├── socket/
│   │   └── socketHandler.js
│   │
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── ai-service/
│   │
│   ├── main.py
│   ├── similarity.py
│   ├── grouping.py
│   ├── classifier.py
│   ├── priority.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── .env
│
├── README.md
└── .gitignore
```

---

# 5. 👥 Team Division

There are 4 team members.

## Member 1 – Student Frontend

Responsible for:

```text
frontend/src/pages/
├── Login.jsx
├── StudentHome.jsx
├── JoinClass.jsx
└── LiveClass.jsx

frontend/src/components/
├── Navbar.jsx
├── QuestionInput.jsx
├── QuestionCard.jsx
├── QuestionGroup.jsx
├── PriorityBadge.jsx
└── CategoryBadge.jsx
```

---

## Member 2 – Teacher Frontend

Responsible for:

```text
frontend/src/pages/
├── TeacherHome.jsx
├── CreateClass.jsx
├── TeacherDashboard.jsx
└── ClassSummary.jsx

frontend/src/components/
├── AnswerBox.jsx
├── VideoPanel.jsx
└── Loading.jsx
```

---

## Member 3 – Backend

Responsible for:

```text
backend/
├── config/
├── controllers/
├── models/
├── routes/
├── services/
├── socket/
└── server.js
```

---

## Member 4 – AI

Responsible for:

```text
ai-service/
├── main.py
├── similarity.py
├── grouping.py
├── classifier.py
├── priority.py
├── schemas.py
└── requirements.txt
```

---

# 6. 🗄 MongoDB Atlas Setup

## Project

Create:

```text
Project Name:
EduNova
```

## Cluster

```text
Cluster Name:
EduNovaCluster
```

## Database

```text
Database Name:
EduNova
```

## Collections

Create:

```text
users
classes
questions
questionGroups
answers
```

MongoDB Atlas provides the application connection string through the cluster's **Connect → Drivers** flow. The Node.js application uses that URI to connect to Atlas.

---

# 7. Database Design

## users

```text
_id
name
email
password
role
createdAt
```

Role:

```text
student
teacher
```

---

## classes

```text
_id
className
classCode
subject
topic
teacherId
students
status
createdAt
```

---

## questions

```text
_id
classId
studentId
text
category
priority
groupId
status
createdAt
```

---

## questionGroups

```text
_id
classId
mainQuestion
category
studentCount
priority
classWide
status
createdAt
```

---

## answers

```text
_id
groupId
teacherId
answer
createdAt
```

---

# 8. 🔐 Environment Variables

Never upload passwords or API keys to GitHub.

## backend/.env

```env
PORT=5000

MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/EduNova

AI_SERVICE_URL=http://localhost:8000

JWT_SECRET=YOUR_SECRET_KEY
```

## ai-service/.env

```env
PORT=8000
```

## .gitignore

```gitignore
node_modules/
.env
__pycache__/
.venv/
```

---

# 9. Backend Setup

Go to backend:

```bash
cd backend
```

Initialize:

```bash
npm init -y
```

Install:

```bash
npm install express mongoose cors dotenv socket.io bcryptjs jsonwebtoken axios
```

Development:

```bash
npm install --save-dev nodemon
```

---

# 10. Backend Server

Create:

```text
backend/server.js
```

Responsibilities:

* Start Express
* Connect MongoDB
* Enable CORS
* Enable JSON
* Register routes
* Start Socket.IO
* Start server

Target:

```text
Backend:
http://localhost:5000
```

---

# 11. MongoDB Connection

Create:

```text
backend/config/db.js
```

Responsibilities:

```text
Connect Node.js
      ↓
MongoDB Atlas
      ↓
EduNova database
```

Test that the backend prints:

```text
MongoDB Connected
Server running on port 5000
```

MongoDB's official Node.js documentation uses an Atlas connection URI to establish the connection.

---

# 12. Authentication

Implement:

```text
Register
Login
Logout
```

### Register

```http
POST /api/auth/register
```

Input:

```json
{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "password": "123456",
  "role": "student"
}
```

### Login

```http
POST /api/auth/login
```

Return:

```text
JWT token
User information
Role
```

---

# 13. Class Management

Teacher can:

```text
Create Class
Start Class
End Class
```

Student can:

```text
Join Class
```

API:

```text
POST /api/classes
POST /api/classes/join
GET  /api/classes/:id
POST /api/classes/:id/start
POST /api/classes/:id/end
```

---

# 14. Student Question System

Student enters:

```text
What is inheritance?
```

Frontend sends:

```http
POST /api/questions
```

Request:

```json
{
  "classId": "CLASS_ID",
  "studentId": "STUDENT_ID",
  "text": "What is inheritance?"
}
```

---

# 15. Backend Question Processing

When the backend receives a question:

```text
Receive question
      ↓
Validate question
      ↓
Send to AI
      ↓
Receive AI result
      ↓
Find/create question group
      ↓
Save question
      ↓
Update group
      ↓
Send Socket.IO event
```

---

# 16. 🤖 AI Service

AI runs separately:

```text
Python + FastAPI
```

Target:

```text
http://localhost:8000
```

FastAPI supports defining API endpoints in Python and running a development server; this is suitable for the separate AI service.

---

# 17. AI Endpoint

Create:

```http
POST /analyze
```

Input:

```json
{
  "question": "I don't understand inheritance",
  "existing_questions": []
}
```

Output:

```json
{
  "category": "conceptual",
  "similarity": 0.91,
  "group": "inheritance",
  "priority": "high",
  "classWide": false
}
```

---

# 18. AI – Similarity Detection

File:

```text
similarity.py
```

Purpose:

Determine whether two questions have the same meaning.

Example:

```text
What is inheritance?

Explain inheritance.

I don't understand inheritance.
```

Expected:

```text
Similar = YES
```

Use:

```text
Sentence Transformers
+
Cosine Similarity
```

---

# 19. AI – Question Grouping

File:

```text
grouping.py
```

Input:

```text
Question 1 → inheritance
Question 2 → explain inheritance
Question 3 → inheritance meaning
Question 4 → polymorphism
```

Output:

```text
Group 1
Inheritance
3 students

Group 2
Polymorphism
1 student
```

---

# 20. AI – Classification

File:

```text
classifier.py
```

Categories:

```text
CONCEPTUAL
ADMINISTRATIVE
TECHNICAL
HOMEWORK
OTHER
```

Examples:

```text
"What is inheritance?"
→ CONCEPTUAL

"When is assignment due?"
→ ADMINISTRATIVE

"My microphone is not working."
→ TECHNICAL
```

---

# 21. AI – Priority

File:

```text
priority.py
```

Priority:

```text
HIGH
MEDIUM
LOW
```

Consider:

```text
Number of related students
+
Conceptual importance
+
Class-wide impact
+
Unanswered status
+
Time unresolved
```

Do NOT use only the number of students.

A question with many students may still be administrative, while a conceptual question affecting fewer students can be more important. This distinction matches the P11 problem statement.

---

# 22. Class-Wide Doubt Detection

Example:

```text
20 students
      ↓
Ask similar inheritance questions
      ↓
AI detects common misunderstanding
      ↓
classWide = true
```

Teacher sees:

```text
🚨 CLASS-WIDE DOUBT

What is inheritance?

20 students affected

Priority: HIGH
```

---

# 23. Teacher Dashboard

Teacher dashboard must show:

```text
Students
Total Questions
Question Groups
Answered
Unanswered
```

Then groups:

```text
🚨 CLASS-WIDE

🧠 CONCEPTUAL

📅 ADMINISTRATIVE

🔧 TECHNICAL

📚 HOMEWORK
```

Sort:

```text
HIGH
MEDIUM
LOW
```

---

# 24. Teacher Answer

Teacher clicks:

```text
ANSWER
```

Writes:

```text
Inheritance allows a child class
to reuse properties and methods
of a parent class.
```

Backend:

```http
POST /api/questions/:id/answer
```

Save answer in:

```text
answers
```

---

# 25. Real-Time Communication

Use:

```text
Socket.IO
```

Events:

```text
questionUpdated
questionGrouped
answerReceived
studentJoined
classUpdated
```

Workflow:

```text
Student submits question
       ↓
Backend
       ↓
AI
       ↓
MongoDB
       ↓
Socket.IO
       ↓
Teacher Dashboard
```

No page refresh.

---

# 26. Answer Real-Time Workflow

```text
Teacher answers group
       ↓
Backend
       ↓
Save answer
       ↓
Socket.IO
       ↓
Related students
       ↓
Answer appears
```

---

# 27. Student UI

Student should see:

```text
================================
        LIVE JAVA CLASS
================================

Topic: Inheritance

[ Video ]

Ask your question:

[________________________]
        [ ASK ]

--------------------------------

🔥 IMPORTANT DOUBTS

👥 15
What is inheritance?

🔴 HIGH

👥 8
Inheritance vs Polymorphism?

🟡 MEDIUM

--------------------------------
```

---

# 28. Teacher UI

```text
================================
       TEACHER DASHBOARD
================================

Students: 50
Questions: 42
Groups: 15

--------------------------------

🚨 CLASS-WIDE DOUBT

What is inheritance?

👥 20 students

Category: Conceptual
Priority: HIGH

[ ANSWER ]

--------------------------------

🧠 IMPORTANT QUESTION

Inheritance vs Polymorphism?

👥 8 students

[ ANSWER ]

--------------------------------

📅 ADMINISTRATIVE

When is assignment due?

👥 3

Priority: LOW
```

---

# 29. Class Summary

After class:

```text
================================
          CLASS SUMMARY
================================

Total Questions       60

Question Groups       22

Repeated Questions    38

Answered              20

Unanswered             2

Most Confusing Topic
Inheritance

Students Affected
15
```

---

# 30. API List

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Classes

```text
POST /api/classes
POST /api/classes/join
GET /api/classes/:id
POST /api/classes/:id/start
POST /api/classes/:id/end
```

## Questions

```text
POST /api/questions
GET /api/classes/:id/questions
POST /api/questions/:id/vote
```

## Answers

```text
POST /api/questions/:id/answer
GET /api/questions/:id/answer
```

## Summary

```text
GET /api/classes/:id/summary
```

## AI

```text
POST http://localhost:8000/analyze
```

---

# 31. Frontend Setup

```bash
npm create vite@latest frontend
```

Select:

```text
React
JavaScript
```

Then:

```bash
cd frontend
npm install
```

Install:

```bash
npm install axios socket.io-client
```

Optional:

```bash
npm install lucide-react
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 32. Frontend API Connection

Create:

```text
frontend/src/services/api.js
```

This file handles:

```text
Login
Register
Create Class
Join Class
Questions
Answers
Summary
```

Backend:

```text
http://localhost:5000
```

---

# 33. Socket Connection

Create:

```text
frontend/src/services/socket.js
```

Connect to:

```text
http://localhost:5000
```

Listen for:

```text
questionUpdated
answerReceived
classUpdated
```

---

# 34. Complete Question Flow

Example:

### Student 1

```text
What is inheritance?
```

### Student 2

```text
Explain inheritance.
```

### Student 3

```text
I don't understand inheritance.
```

### Backend

```text
Receive 3 questions
```

### AI

```text
Similarity:
0.92

Category:
Conceptual

Group:
Inheritance

Priority:
High

Class-wide:
Yes
```

### MongoDB

```text
questionGroups

Inheritance
3 students
HIGH
CLASS-WIDE
```

### Teacher

```text
🚨 What is inheritance?
👥 3 students
[ANSWER]
```

### Teacher answers

```text
Inheritance is a mechanism where
one class can acquire properties
and methods of another class.
```

### Students

All related students receive the answer.

---

# 35. 🔄 Complete System Architecture

```text
                         EDUNOVA
                            │
                            ▼
                    ┌───────────────┐
                    │ React Frontend│
                    └───────┬───────┘
                            │
                    Axios / Socket.IO
                            │
                            ▼
                    ┌───────────────┐
                    │ Node + Express│
                    └───────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
          MongoDB       Python AI     Socket.IO
           Atlas         FastAPI          │
              │             │             │
              │       ┌─────┴─────┐       │
              │       │           │       │
              │  Similarity  Classification│
              │       │           │       │
              │       └─────┬─────┘       │
              │             │             │
              │          Priority         │
              │             │             │
              │          Grouping         │
              │             │             │
              └─────────────┴─────────────┘
                            │
                            ▼
                    Teacher Dashboard
                            │
                            ▼
                     Teacher Answer
                            │
                            ▼
                    Related Students
```

---

# 36. 🧪 Testing Plan

## Test 1 – Login

```text
Teacher login
Student login
```

Expected:

```text
Correct dashboard opens
```

---

## Test 2 – Create Class

Teacher:

```text
Java Programming
JAVA101
```

Expected:

```text
Class created
```

---

## Test 3 – Join Class

Student:

```text
JAVA101
```

Expected:

```text
Successfully joined
```

---

## Test 4 – Submit Question

```text
What is inheritance?
```

Expected:

```text
Question appears in database
```

---

## Test 5 – Similarity

Submit:

```text
What is inheritance?

Explain inheritance.

I don't understand inheritance.
```

Expected:

```text
Same group
```

---

## Test 6 – Classification

Test:

```text
What is inheritance?
```

Expected:

```text
CONCEPTUAL
```

Test:

```text
When is assignment due?
```

Expected:

```text
ADMINISTRATIVE
```

---

## Test 7 – Priority

Multiple students ask the same conceptual question.

Expected:

```text
HIGH
```

---

## Test 8 – Teacher Answer

Teacher answers group.

Expected:

```text
All related students receive answer
```

---

## Test 9 – Real-Time

Open:

```text
Browser 1 → Student
Browser 2 → Teacher
```

Student asks question.

Expected:

```text
Teacher dashboard updates automatically
```

---

# 37. 🚨 MVP Checklist

Do not move to advanced features until these are complete.

```text
[ ] React frontend running

[ ] Node backend running

[ ] MongoDB Atlas connected

[ ] User registration working

[ ] Login working

[ ] Teacher can create class

[ ] Student can join class

[ ] Student can ask question

[ ] Question stored in MongoDB

[ ] Python AI running

[ ] Similarity detection working

[ ] Question grouping working

[ ] Classification working

[ ] Priority working

[ ] Class-wide detection working

[ ] Teacher dashboard working

[ ] Socket.IO working

[ ] Teacher can answer

[ ] Student receives answer

[ ] Class summary working
```

---

# 38. ⭐ Optional Features

Only implement these after the MVP works.

```text
[ ] Upvote / Same Doubt

[ ] Anonymous Questions

[ ] Search Questions

[ ] Filter by Category

[ ] Filter by Priority

[ ] AI-generated representative question

[ ] AI-generated answer suggestion

[ ] Question history

[ ] Student notification

[ ] Teacher notifications

[ ] WebRTC video

[ ] Class analytics

[ ] Export class report
```

---

# 39. ❌ Do NOT Waste Time On

For the hackathon MVP, don't build:

```text
❌ Full Zoom clone
❌ Payment system
❌ Complete LMS
❌ Complex examination system
❌ Attendance management
❌ Assignment management
❌ Chat application
❌ Social media features
```

The main value is:

```text
REPEATED QUESTIONS
        ↓
AI UNDERSTANDS THEM
        ↓
GROUPS THEM
        ↓
PRIORITIZES THEM
        ↓
TEACHER ANSWERS ONCE
        ↓
MANY STUDENTS BENEFIT
```

---

# 40. 🏁 Final Demo Flow

For the hackathon presentation, demonstrate this exact scenario.

### Step 1

Teacher logs in.

```text
Teacher Dashboard
```

### Step 2

Teacher creates:

```text
Java Programming
Class Code: JAVA101
Topic: OOP
```

### Step 3

Open 4 student browser windows.

Students join:

```text
JAVA101
```

### Step 4

Students ask:

```text
Student 1:
What is inheritance?

Student 2:
Explain inheritance.

Student 3:
I don't understand inheritance.

Student 4:
What is inheritance in Java?
```

### Step 5

AI processes them.

```text
4 Related Questions

Topic: Inheritance

Category: Conceptual

Priority: HIGH

Class-wide: YES
```

### Step 6

Teacher dashboard shows:

```text
🚨 CLASS-WIDE DOUBT

What is inheritance?

👥 4 students

HIGH PRIORITY

[ANSWER]
```

### Step 7

Teacher answers once.

```text
Inheritance allows one class
to acquire properties and methods
from another class.
```

### Step 8

All 4 students receive:

```text
✅ Teacher Answer
```

### Step 9

Show class summary:

```text
Total Questions: 4
Question Groups: 1
Repeated Questions: 3
Most Confusing Topic: Inheritance
```

---

# 41. 📅 Recommended Development Order

## Day/Phase 1

```text
[ ] GitHub repository
[ ] Folder structure
[ ] React setup
[ ] Node setup
[ ] Python setup
[ ] MongoDB Atlas
```

## Day/Phase 2

```text
[ ] User model
[ ] Authentication
[ ] Class model
[ ] Create class
[ ] Join class
```

## Day/Phase 3

```text
[ ] Question model
[ ] Submit question
[ ] Question display
[ ] MongoDB storage
```

## Day/Phase 4

```text
[ ] Python FastAPI
[ ] Similarity
[ ] Grouping
[ ] Classification
[ ] Priority
```

## Day/Phase 5

```text
[ ] Teacher dashboard
[ ] Socket.IO
[ ] Real-time questions
[ ] Answer system
```

## Day/Phase 6

```text
[ ] Class summary
[ ] Testing
[ ] UI improvement
[ ] Error handling
```

## Final

```text
[ ] Full demo
[ ] README update
[ ] GitHub cleanup
[ ] Presentation
[ ] Demo video/screenshots
```

---

# 42. ✅ Definition of "Project Completed"

EduNova is considered complete when this works without manually refreshing:

```text
Teacher creates class
        ↓
Student joins
        ↓
Student asks question
        ↓
Backend receives question
        ↓
AI analyzes question
        ↓
AI finds similar questions
        ↓
AI creates/updates group
        ↓
AI classifies question
        ↓
AI calculates priority
        ↓
MongoDB stores everything
        ↓
Teacher dashboard updates
        ↓
Teacher answers group
        ↓
Related students receive answer
        ↓
Class summary is generated
```

**This is the complete P11 MVP.**

---

# 43. 🔗 Important Documentation

MongoDB Atlas connection setup:

https://www.mongodb.com/docs/drivers/node/current/get-started/

FastAPI tutorial:

https://fastapi.tiangolo.com/tutorial/

---

# 44. Final Goal

The final EduNova system should transform:

```text
                    BEFORE

Student 1 → What is inheritance?
Student 2 → Explain inheritance
Student 3 → I don't understand inheritance
Student 4 → What does inheritance mean?
Student 5 → When is assignment due?
Student 6 → Explain inheritance
Student 7 → What is inheritance?

                  ↓ EDU NOVA AI ↓

                    AFTER

🚨 CLASS-WIDE DOUBT
Inheritance
👥 6 students
Category: Conceptual
Priority: HIGH

📅 ADMINISTRATIVE
Assignment deadline
👥 1 student
Priority: LOW

                  ↓

              TEACHER ANSWERS

                  ↓

          RELATED STUDENTS RECEIVE
                  ANSWER
```

This directly addresses the P11 goal of reducing scattered/repeated questions, helping teachers identify class-wide blockers, and keeping important conceptual doubts from getting buried in the live stream.
