delpoyment link :- https://hrms-8y8d.vercel.app

# WhiteCircle Group HRMS (Human Resource Management System)

## Overview
The **WhiteCircle Group HRMS** is a web-based application built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
It simplifies HR operations by managing authentication, timesheets, and leave requests in one place.

## Key Features
- **Secure Authentication:** JWT-based login, bcrypt password hashing, role-based access  
- **Timesheet Management:** Daily hour logs, weekend auto-zero, manager review, weekly lock  
- **Leave Management:** Paid/Unpaid/Sick/Casual leaves, auto-approval, leave balance tracking  
- **Email Notifications:** Auto emails on approvals and important updates  
- **Data Validation:** Frontend (React) + Backend (Node) + DB (MongoDB schema)  
- **Deployment Ready:** Node/Express backend, React frontend, MongoDB Atlas

## User Roles
| Role | Permissions |
|------|--------------|
| Intern / Employee | Log hours, apply leave |
| Manager | Review and approve timesheets |
| Admin | Manage users, projects, leave balances |

## Tech Stack
- **Frontend:** React.js, Axios, React Router  
- **Backend:** Node.js, Express.js, JWT  
- **Database:** MongoDB (Mongoose)  

## Setup
```bash
# Clone repo
git clone https://github.com/Himanshu-tayade/WCG-HRMS.git

