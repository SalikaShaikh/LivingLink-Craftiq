# API Contract Documentation For LivingLink
## Overview
This document describes the API endpoints for LivingLink, A Residential Society Management System, a comprehensive platform for managing residential society operations including authentication, bookings, complaints, finances, maintenance, notices, payments, users, and visitors.

## Base URL
http://localhost:3000/api (or your deployed server URL)

## Authentication
All endpoints (except auth endpoints) require JWT authentication via Bearer token in the Authorization header.

## Error Responses
400 Bad Request - Missing or invalid parameters

401 Unauthorized - Invalid or missing authentication token

403 Forbidden - User doesn't have required permissions

404 Not Found - Resource not found

500 Server Error - Internal server error

## API Endpoints
### Authentication
#### Register User
URL: /auth/register

Method: POST

Auth Required: No

Request Body:

json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string" // resident, secretary, security, maintenance, treasurer
}
Success Response: 201 Created

Error Response: 400 Bad Request if email already exists

#### Login User
URL: /auth/login

Method: POST

Auth Required: No

Request Body:

json
{
  "email": "string",
  "password": "string"
}
Success Response: 200 OK with JWT token and user data

Error Response: 400 Bad Request for invalid credentials

#### Bookings
##### Request Facility Booking (Resident only)
URL: /bookings

Method: POST

Auth Required: Yes (Resident role)

Request Body:

json
{
  "date": "string (YYYY-MM-DD)",
  "timeSlot": "string",
  "purpose": "string"
}
Success Response: 201 Created

##### Get Resident's Bookings
URL: /bookings/my-bookings

Method: GET

Auth Required: Yes (Resident role)

Success Response: 200 OK with array of bookings

##### Get All Bookings (Secretary only)
URL: /bookings

Method: GET

Auth Required: Yes (Secretary role)

Success Response: 200 OK with array of all bookings

##### Approve/Reject Booking (Secretary only)
URL: /bookings/{id}

Method: PUT

Auth Required: Yes (Secretary role)

Request Body:

json
{
  "status": "string" // approved or rejected
}
Success Response: 200 OK

#### Complaints
##### Submit Anonymous Complaint (Resident only)
URL: /complaints

Method: POST

Auth Required: Yes (Resident role)

Request Body:

json
{
  "content": "string"
}
Success Response: 201 Created

##### Get Complaints (Role-based)
URL: /complaints

Method: GET

Auth Required: Yes

Success Response: 200 OK with filtered complaints based on user role

##### Update Complaint Status (Secretary/Security only)
URL: /complaints/{id}

Method: PUT

Auth Required: Yes (Secretary or Security role)

Request Body:

json
{
  "status": "string" // pending, ongoing, done
}
Success Response: 200 OK

#### Finances
##### Add Finance Record (Treasurer only)
URL: /finances

Method: POST

Auth Required: Yes (Treasurer role)

Request Body:

json
{
  "description": "string",
  "amount": "number"
}
Success Response: 201 Created

##### Get Finance Summary
URL: /finances/summary

Method: GET

Auth Required: Yes

Success Response: 200 OK with financial summary

#### Maintenance
##### Submit Maintenance Request (Resident only)
URL: /maintenance

Method: POST

Auth Required: Yes (Resident role)

Request Body:

json
{
  "category": "string", // electrician, plumber, carpenter, cleaner
  "description": "string"
}
Success Response: 201 Created

##### Get Resident's Maintenance Requests
URL: /maintenance/my-requests

Method: GET

Auth Required: Yes (Resident role)

Success Response: 200 OK with array of requests

##### Get All Maintenance Requests (Maintenance staff only)
URL: /maintenance

Method: GET

Auth Required: Yes (Maintenance role)

Success Response: 200 OK with array of all requests

##### Update Maintenance Status (Maintenance staff only)
URL: /maintenance/{id}/status

Method: PUT

Auth Required: Yes (Maintenance role)

Request Body:

json
{
  "status": "string" // pending, ongoing, done
}
Success Response: 200 OK

#### Notices
##### Get Notices
URL: /notices

Method: GET

Auth Required: Yes

Query Parameters:

limit: number (optional)

Success Response: 200 OK with array of notices

##### Create Notice (Secretary only)
URL: /notices

Method: POST

Auth Required: Yes (Secretary role)

Request Body:

json
{
  "title": "string",
  "content": "string"
}
Success Response: 201 Created

#### Payments
##### Get Resident's Payment History
URL: /payments/my-payments

Method: GET

Auth Required: Yes (Resident role)

Query Parameters:

limit: number (optional)

sort: string (date or month)

Success Response: 200 OK with array of payments

##### Make Payment (Resident only)
URL: /payments

Method: POST

Auth Required: Yes (Resident role)

Request Body:

json
{
  "amount": "number",
  "month": "number (1-12)",
  "year": "number"
}
Success Response: 201 Created

##### Get All Payments (Treasurer only)
URL: /payments/all

Method: GET

Auth Required: Yes (Treasurer role)

Query Parameters:

month: number (optional)

year: number (optional)

Success Response: 200 OK with array of all payments

##### Get Payment Months (Treasurer only)
URL: /payments/months

Method: GET

Auth Required: Yes (Treasurer role)

Success Response: 200 OK with array of payment months

#### Users
##### Get Residents List (Treasurer/Secretary only)
URL: /users/residents

Method: GET

Auth Required: Yes (Treasurer or Secretary role)

Success Response: 200 OK with array of residents

#### Visitors
##### Add Expected Visitor (Resident only)
URL: /visitors

Method: POST

Auth Required: Yes (Resident role)

Request Body:

json
{
  "name": "string",
  "flatNumber": "string",
  "dateOfVisit": "string (YYYY-MM-DD)"
}
Success Response: 201 Created

##### Add Visitor Directly (Security only)
URL: /visitors/security

Method: POST

Auth Required: Yes (Security role)

Request Body:

json
{
  "name": "string",
  "flatNumber": "string",
  "dateOfVisit": "string (YYYY-MM-DD)",
  "time": "string"
}
Success Response: 201 Created

##### Get Resident's Visitors
URL: /visitors/my-visitors

Method: GET

Auth Required: Yes (Resident role)

Success Response: 200 OK with array of visitors

##### Get All Visitors (Security/Secretary only)
URL: /visitors

Method: GET

Auth Required: Yes (Security or Secretary role)

Success Response: 200 OK with array of all visitors

##### Approve Visitor (Security only)
URL: /visitors/{id}/approve

Method: PUT

Auth Required: Yes (Security role)

Success Response: 200 OK

## Data Models
### User
typescript
{
  _id: string;
  name: string;
  email: string;
  role: 'resident' | 'secretary' | 'security' | 'maintenance' | 'treasurer';
  createdAt: string; // ISO date
}
### Booking
typescript
{
  _id: string;
  resident: string; // User ID
  date: string; // ISO date
  timeSlot: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy: string; // User ID
  createdAt: string; // ISO date
}
### Complaint
typescript
{
  _id: string;
  content: string;
  anonymous: boolean;
  submittedBy: string; // User ID
  status: 'pending' | 'ongoing' | 'done';
  updatedBy: string; // User ID
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
### FinanceRecord
typescript
{
  _id: string;
  description: string;
  amount: number;
  enteredBy: string; // User ID
  date: string; // ISO date
}
### MaintenanceRequest
typescript
{
  _id: string;
  resident: string; // User ID
  category: 'electrician' | 'plumber' | 'carpenter' | 'cleaner';
  description: string;
  status: 'pending' | 'ongoing' | 'done';
  updatedBy: string; // User ID
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
### Notice
typescript
{
  _id: string;
  title: string;
  content: string;
  postedBy: string; // User ID
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
### Payment
typescript
{
  _id: string;
  resident: string; // User ID
  amount: number;
  month: number; // 1-12
  year: number;
  receiptNumber: string;
  paidAt: string; // ISO date
}
### Visitor
typescript
{
  _id: string;
  resident: string; // User ID
  name: string;
  flatNumber: string;
  dateOfVisit: string; // ISO date
  time: string; // Only for security-added visitors
  approved: boolean;
  addedBy: 'resident' | 'security';
  approvedBy: string; // User ID
  createdAt: string; // ISO date
}

## Versioning
API versioning is not currently implemented. All endpoints are under /api/ prefix.

## Testing
Use the provided Swagger documentation at /api-docs endpoint to test API endpoints interactively.

## Changelog
Initial version: Complete API specification for Society Management System

## All endpoints documented with request/response formats

## Role-based access control clearly defined

## Error handling standardized across endpoints
