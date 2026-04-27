# Team 5 Project - Service Request Tracker

## Team Members
- Shelby Crosby - shelbs-prog
- Tugba Agdas - tugbaagdas
- Matthew Ingram - Matthew-Ingram
- Xander Parker - Have not recieved handle from student
- Khangai Altangerel - kaltangerel

The different **Scrum Masters** throughout the sprints so far are as follows:
- Sprint 1 - Matthew Ingram
- Sprint 2 - Shelby Crosby
- Sprint 3 - Khangai Altangerel
- Sprint 4 - Tugba Agdas

## Local Dev Setup

### What now works
- FastAPI backend is connected to SQLite and seeded from `datasets/`.
- React frontend calls live backend endpoints for login, list, details, create, and status updates.
- Docker Compose runs both frontend and backend locally.

### Run with Docker
1. `docker compose up --build`
2. Open `http://localhost:5173`

### Run without Docker
1. Backend:
   - `python -m pip install -r requirements.txt`
   - `python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000`
2. Frontend (new terminal):
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. Open `http://localhost:5173`
  
## Tech Stack
- Backend: Python
- Database: SQLite
- Frontend: Vite + React
- IDE/Tools: Visual Studio (or VS Code), GitHub Codespaces
- Version Control: Git + GitHub (PR-based workflow)

## Project Idea
The idea for this project is for a service request tracker, such as one for an IT or maintenance department.

### The Problem
Many requests for service happen in computer-related fields, and trying to keep track of these requests by hand, or by using software not intended for this purpose, could lead to problems. Such problems could include losing track of the transaction dates of requests, leading to some requests not being serviced in a reasonable amount of time, or losing track of the status of requests, leading to some requests needing to be checked again to make sure that they have or have not been serviced.

## The Mission Statement
Our piece of software would be able to help track and manage service requests. The intended users of this software would those working in an IT or maintenance department, who need to work with service requests.

### The Solution
Our project, as a piece of software dedicated to being for tracking service requests, would help to alleviate the pain points of less specialized methods of tracking requests. This would be achieved by having relatively easy-to-use options for interacting with a service request database, such as being able to create service requests, close requests, view and sort requests, update requests, and more.

## Team Workflow
To simulate a real-world Scrum environment, our team will follow a structured workflow.

### Definition of Done (DoD)
A task will be considered “Done” when:
- The feature is fully implemented.
- The code is pushed to a feature branch.
- A Pull Request (PR) is created.
- At least one teammate reviews and approves it.
- The feature works without errors.
- The README.md is updated if necessary.

Only after approval will the feature be merged into the `main` branch.

### Communication & Meeting Cadence
We will use Slack as our main communication platform and maintain a dedicated channel for Team 5. All updates, questions, and important information will be shared there to keep everyone informed.

Our team will meet once per week via Slack or Zoom. Our weekly meeting time is **11:30 AM on Monday**. During these meetings, we will review what each member worked on and discuss overall progress. If necessary, we may schedule additional meetings, but we will meet at least once per week.

### Branching Strategy
To avoid merge conflicts, we will use a feature branch strategy.
- The `main` branch will always remain stable.
- Each feature will be developed in its own branch.
- Example branch names:
  - `feature/user-login`
  - `feature/create-ticket`
  - `feature/dashboard`
  - `19-user-login`
  - `23-create-ticket`
  - `22-dashboard`
  - `create-user-login`
  - `setup-create-ticket`
  - `build-dashboard`

After completing a feature, a Pull Request will be created to merge it into `main`.

### Pull Request Policy
- No one will push directly to the `main` branch.
- Every change must go through a Pull Request.
- Pull Requests must pass all GitHub Actions tests. This project uses pytest for unit testing.
- At least one team member must review and approve the PR.
- Feedback must be addressed before merging.

## User Personas

### User (Employee)
**Description:**
An employee who submits service requests when they need technical or maintenance help.

**Goals:**
- Submit a service request
- Track the status of their request
- Know when their issue has been resolved

---

### 2. Admin/Staff (IT or Maintenance Technician)
**Description:**
A staff member responsible for reviewing, managing, and resolving submitted service requests

**Goals:**
- View all submitted service requests
- Prioritize urgent issues
- Update request status
- Close completed requests

---

## Key Features

### 1. Create a service request (ticket)
- Users can create a new request with a title and description
- Requests include a priority level (Low / Medium / High)
  
### 2. View request list
- Admin/Staff can view a list of all service requests
- Each request shows basic information like ID, title, status, and date created
  
### 3. Update request status
- Admin/Staff can update service request status (Open, In Progress, Resolved/Closed)

### 4. Sorting/Filtering
- Admin/Staff can sort or filter requests by status and/or priority to find request items quickly

### 5. View request details
- Admin/Staff can open a request to see full details including description, priority, and timestamps
