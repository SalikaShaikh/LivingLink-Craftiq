#  API Contract – LivingLink (Craftiq)

This document defines the contract between the **frontend** and **backend** for the LivingLink Residential Society Management System.

---

## **1. Core Features**
1. User Authentication (Residents, Admins, Security, Maintenance Staff)
2. Complaint Management
3. Notice Board & Announcements
4. Maintenance Billing & Payments
5. Visitor Management
6. Event Booking
7. Document Sharing

---

## **2. Data Models**

### **User**
```json
{
  "id": 1,
  "name": "Ankith Binagekar",
  "email": "ankithbinagekar2002@gmail.com",
  "password": "hashed_password",
  "role": "resident", 
  "flatNumber": "A-101",
  "phone": "+91 9876543210"
}
```

### **Complaint**
```json
{
  "id": 101,
  "userId": 1,
  "title": "Water leakage in bathroom",
  "description": "Leak detected near the sink",
  "status": "open",
  "createdAt": "2025-08-11T09:00:00Z",
  "updatedAt": "2025-08-11T09:00:00Z"
}
```

### **MaintenanceBill**
```json
{
  "id": 501,
  "userId": 1,
  "amount": 1500,
  "dueDate": "2025-09-01",
  "status": "pending"
}
```

### **Visitor**
```json
{
  "id": 301,
  "name": "Rahul",
  "purpose": "Guest visit",
  "flatNumber": "A-101",
  "approvedByResident": true,
  "entryTime": "2025-08-11T10:30:00Z"
}
```

### **Notice**
```json
{
  "id": 401,
  "title": "Water Supply Disruption",
  "description": "No water supply from 10 AM to 3 PM due to maintenance work.",
  "createdAt": "2025-08-11T08:00:00Z"
}
```

---

## **3. API Endpoints**

### **Authentication**

#### 1. Register User
- **Method:** POST  
- **Path:** `/api/auth/register`  
- **Description:** Register a new user  
- **Request Body:**
```json
{
  "name": "Ankith Binagekar",
  "email": "ankithbinagekar2002.com",
  "password": "123456",
  "role": "resident",
  "flatNumber": "A-101",
  "phone": "+91 9876543210"
}
```
- **Success (200):**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```
- **Error (400):**
```json
{
  "error": "Email already exists"
}
```

#### 2. Login
- **Method:** POST  
- **Path:** `/api/auth/login`  
- **Description:** User login & JWT token generation  
- **Request Body:**
```json
{
  "email": "ankithbinagekar2002@gmail.com",
  "password": "123456"
}
```
- **Success (200):**
```json
{
  "token": "jwt_token_here",
  "role": "resident"
}
```
- **Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### **Complaint Management**

#### 3. Create Complaint
- **Method:** POST  
- **Path:** `/api/complaints`  
- **Description:** Create a new complaint  
- **Request Body:**
```json
{
  "title": "Water leakage",
  "description": "Leak in kitchen sink"
}
```
- **Success (200):**
```json
{
  "message": "Complaint submitted successfully",
  "complaintId": 101
}
```

#### 4. Get All Complaints (Admin)
- **Method:** GET  
- **Path:** `/api/complaints`  
- **Description:** Get all complaints for admin  
- **Success (200):**
```json
[
  {
    "id": 101,
    "userId": 1,
    "title": "Water leakage",
    "status": "open"
  }
]
```

---

### **Maintenance Billing**

#### 5. Generate Bill (Admin)
- **Method:** POST  
- **Path:** `/api/bills`  
- **Description:** Generate a new maintenance bill for a user  
- **Request Body:**
```json
{
  "userId": 1,
  "amount": 1500,
  "dueDate": "2025-09-01"
}
```
- **Success (200):**
```json
{
  "message": "Bill generated successfully"
}
```

#### 6. Get User Bills
- **Method:** GET  
- **Path:** `/api/bills/:userId`  
- **Description:** Get all bills for a specific user  
- **Success (200):**
```json
[
  {
    "id": 501,
    "amount": 1500,
    "dueDate": "2025-09-01",
    "status": "pending"
  }
]
```

---

### **Visitor Management**

#### 7. Log Visitor
- **Method:** POST  
- **Path:** `/api/visitors`  
- **Description:** Log a new visitor entry  
- **Request Body:**
```json
{
  "name": "Shawn",
  "purpose": "Guest visit",
  "flatNumber": "A-101"
}
```
- **Success (200):**
```json
{
  "message": "Visitor log created successfully",
  "visitorId": 301
}
```

---

### **Notice Board**

#### 8. Post Notice (Admin)
- **Method:** POST  
- **Path:** `/api/notices`  
- **Description:** Post a new announcement  
- **Request Body:**
```json
{
  "title": "Water Supply Disruption",
  "description": "No water supply from 10 AM to 3 PM due to maintenance work."
}
```
- **Success (200):**
```json
{
  "message": "Notice posted successfully",
  "noticeId": 401
}
```

#### 9. Get All Notices
- **Method:** GET  
- **Path:** `/api/notices`  
- **Description:** Retrieve all posted notices  
- **Success (200):**
```json
[
  {
    "id": 401,
    "title": "Water Supply Disruption",
    "description": "No water supply from 10 AM to 3 PM.",
    "createdAt": "2025-08-11T08:00:00Z"
  }
]
```

---

