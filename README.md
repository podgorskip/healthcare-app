# **Healthcarre appointment system**

## **Table of contents**
1. [Project overview](#project-overview)  
2. [Features](#features)  
3. [Technology stack](#technology-stack)
4. [Project structure](#project-structure)  
5. [Backend setup](#backend-setup)  
6. [Frontend setup](#frontend-setup)  
7. [Database](#database)  
8. [API Endpoints](#api-endpoints)  
9. [Libraries used](#libraries-used)  

---

## **Project overview**

This project is a web-based **Healthcarre appointment system** that facilitates interaction between doctors, patients, and an admin. The system provides different roles with unique functionalities such as managing doctor schedules, scheduling appointments, leaving reviews, and managing the system through admin privileges.

---

## **Features**

### **Patient**
- **Browse doctors and reviews and schedule visits** (with a cart and payment process simulation). <br><br>
  <img src="https://github.com/user-attachments/assets/135e690e-089b-4bae-aa94-2733c6e0b84f" alt="doctors" width="1470"/>

  <img src="https://github.com/user-attachments/assets/9cd70334-83c5-457e-8484-7200e6874c37" alt="cart-2" width="1470"/>
  <img src="https://github.com/user-attachments/assets/d2357ccf-cce7-4a97-9fbc-69c2ad067600" alt="payment" width="1470"/>

- **Schedule visits.** <br><br>
  Scheduler panel uses **web sockets** for real-time updates when doctors specify absence - slots are immediately marked as unavailable. <br><br>

  <img src="https://github.com/user-attachments/assets/655f754b-98d2-4980-bc44-964068537a70" alt="scheduler-1" width="1470"/>
  <img src="https://github.com/user-attachments/assets/5c6ac425-16e5-45bf-970c-b39261f48840" alt="scheduler-2" width="1470"/>
  <img width="1470" alt="scheduler-3" src="https://github.com/user-attachments/assets/e12510d5-44e7-43d0-affe-f0615d548845" />
  
- **Check historical visits and scheduled visits.** <br><br>
  <img width="1470" alt="history-1" src="https://github.com/user-attachments/assets/f87de412-45e0-475b-a747-36c6577d9d00" />

- **Leave reviews** (only allowed if they have visited the doctor). <br><br>
  <img width="1470" alt="history-2" src="https://github.com/user-attachments/assets/9abbf605-9e6c-4918-8e9a-7a73aa3996f5" />

- **Add comments on reviews.** <br><br>
  <img width="1470" alt="comment" src="https://github.com/user-attachments/assets/8c947f39-d6e8-4442-bfd3-01500a409175" />

- **View a dashboard with alerts** related to their visits and appointments. <br><br>
  This dashboard uses **web sockets** for real-time updates when doctors specify absence, which intersects with scheduled visits. <br><br>

  <img width="1470" alt="dashboard-1" src="https://github.com/user-attachments/assets/032f41ea-d32b-45bd-a0ae-b30b53ac2264" />
  <img width="1470" alt="alert" src="https://github.com/user-attachments/assets/357ff104-2581-4dc6-b75f-2bfb581e2a24" />
  
### **Doctor** 
- **Respond to comments in reviews.**
- **Add presence/absence to their calendar** (absence overrides presence). <br><br>
  <img width="1470" alt="calendar-1" src="https://github.com/user-attachments/assets/d1f82956-c038-41f3-9678-244ccdac8ac7" />
  <img width="1470" alt="calendar-2" src="https://github.com/user-attachments/assets/f35614ca-a3f5-407e-b160-c06705742ef7" />
  <img width="1470" alt="availability-1" src="https://github.com/user-attachments/assets/e0aefdaa-5f7d-49e0-b8cf-b0f567db8020" />
  <img width="1470" alt="availability-2" src="https://github.com/user-attachments/assets/2e45436d-79b7-439c-bdcf-477ff374e6a1" />

### **Admin**
- **Ban users.** <br><br>
  <img width="1470" alt="users" src="https://github.com/user-attachments/assets/31d97011-9cdf-4535-b5a5-93c1062ee16f" />

- **Remove comments.**
- **Change the database type** (MongoDB/Firebase).
  
- **Add and remove doctors.** <br><br>
  <img width="1470" alt="doctor-creator" src="https://github.com/user-attachments/assets/770f3e14-0237-48c3-89c3-a78b6fd7067e" />
  <img width="1470" alt="doctors-admin" src="https://github.com/user-attachments/assets/52b5f872-8867-419b-a405-52f4a40b2a7c" />

### **Authentication** <br><br>
  <img src="https://github.com/user-attachments/assets/46145df3-398b-43cc-8dff-2726f236ecc1" alt="sign-in" width="1470"/>
  <img src="https://github.com/user-attachments/assets/2e1e7e8b-1f9d-4e2a-be16-922f0e713268" alt="sign-up" width="1470"/>

---

## **Technology stack**

### **Frontend**
- Angular 17  
- Bootstrap 5.3  
- RxJS  
- Angular Fire (Firebase integration)  

### **Backend**
- Node.js (Express.js)  
- MongoDB  
- JSON Web Tokens (JWT) for authentication  
- bcrypt.js for password hashing  

### **Database**
- MongoDB (with an option to switch to Firebase)

---

## **Project structure**

- **/backend**: contains the Node.js backend application.
- **/frontend**: contains the Angular frontend application.
- **docker-compose.yml**: Docker Compose file used to configure and run both the frontend and backend services.

### Prerequisites

Before you begin, ensure you have the following installed:

- Docker
- Docker Compose

## **Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/podgorskip/healthcare-app
   cd healthcare-app
2. Build the Docker images
   Run the following command to build the images for both the backend and frontend services:
   ```bash 
   docker-compose build
4. Run the application
   Once the images are built, you can run the application with Docker Compose:
   ```bash
   docker-compose up
5. Stopping the application
   To stop the running services, use:
   ```bash
   docker-compose down
   
### **Backend setup**

1. Create a .env file with the following variables:
   ```bash
   MONGO_URI=
   SECRET_KEY=
   REFRESH_SECRET_KEY=

## **Database**

### **MongoDB**
Used as the primary database for storing user, doctor, and appointment data.
Ensure your connection string is correctly configured in the .env file.

### **Firebase (Optional)**
Admins can switch to Firebase for specific functionalities, with seamless integration through @angular/fire.

## **API Endpoints** 

| Endpoint                          | HTTP Method | Description                          | Middleware             |
|-----------------------------------|-------------|--------------------------------------|------------------------|
| **User routes** `/api/users`       |             |                                      |                        |
| `/api/users/`                     | GET         | Get all users                       | `verifyToken`          |
| `/api/users/:id`                  | PATCH       | Toggle user ban status              | `verifyToken`          |
| **Doctor routes** `/api/doctors`   |             |                                      |                        |
| `/api/doctors/`                   | GET         | Get all doctors                     |                        |
| `/api/doctors/:id`                | GET         | Get doctor by ID                    | `verifyToken`          |
| `/api/doctors/`                   | POST        | Create a new doctor                 | `verifyToken`          |
| `/api/doctors/`                   | DELETE      | Delete a doctor                     | `verifyToken`          |
| `/api/doctors/:id/availability`   | GET         | Get doctor availability             | `verifyToken`          |
| `/api/doctors/:id/availability`   | POST        | Add doctor availability             | `verifyToken`          |
| **Patient routes** `/api/patients`|             |                                      |                        |
| `/api/patients/`                  | POST        | Create a new patient                |                        |
| `/api/patients/:id`               | GET         | Get patient by user ID              | `verifyToken`          |
| **Cart routes** `/api/cart`        |             |                                      |                        |
| `/api/cart/:id`                   | POST        | Add item to cart                    | `verifyToken`          |
| `/api/cart/:id`                   | GET         | Get cart items                      | `verifyToken`          |
| `/api/cart/:id`                   | DELETE      | Remove item from cart               | `verifyToken`          |
| **Visit routes** `/api/visits`     |             |                                      |                        |
| `/api/visits/patients/:id`        | GET         | Get visits for a patient            | `verifyToken`          |
| `/api/visits/doctors/:id`         | GET         | Get visits for a doctor             | `verifyToken`          |
| `/api/visits/`                    | POST        | Add a new visit                     | `verifyToken`          |
| `/api/visits/:id/cancel`          | PUT         | Cancel a visit                      | `verifyToken`          |
| `/api/visits/:id`                 | DELETE      | Delete a visit                      | `verifyToken`          |
| `/api/visits/:id/reviews`         | POST        | Add a review for a visit            | `verifyToken`          |
| **Review routes** `/api/reviews`   |             |                                      |                        |
| `/api/reviews/doctors/:id`        | GET         | Get reviews for a doctor            |                        |
| `/api/reviews/:id/comments`       | POST        | Add a review comment                | `verifyToken`          |
| `/api/reviews/comments/:id`       | DELETE      | Remove a review comment             | `verifyToken`          |
| **Authentication routes** `/api/auth` |          |                                      |                        |
| `/api/auth/authenticate`          | POST        | Authenticate user                   |                        |
| `/api/auth/account`               | GET         | Get account details                 | `verifyToken`          |
| `/api/auth/refresh-token`         | POST        | Refresh authentication token        |                        |

## **Libraries**
### **Backend libraries**

| Library        | Version | Description                                        |
|----------------|---------|----------------------------------------------------|
| bcryptjs       | 2.4.3   | Used for hashing passwords.                        |
| cors           | 2.8.5   | Enables Cross-Origin Resource Sharing.             |
| dotenv         | 16.4.7  | Loads environment variables from a .env file.      |
| express        | 4.21.2  | Web framework for Node.js.                         |
| jsonwebtoken   | 9.0.2   | Used for user authentication using JWTs.           |
| mongoose       | 8.9.4   | MongoDB object modeling for Node.js.               |
| ws             | 8.18.0  | WebSocket implementation for real-time communication. |

### **Frontend libraries**

| Library          | Version | Description                                        |
|------------------|---------|----------------------------------------------------|
| @angular/core    | 17.3.0  | Core framework for building Angular applications.  |
| @angular/fire    | 17.1.0  | Angular library for Firebase integration.          |
| rxjs             | 7.8.0   | Reactive programming library for handling async streams. |
| zone.js          | 0.14.3  | Required by Angular for change detection.          |
| bootstrap        | 5.3.3   | CSS framework for building responsive web interfaces. |
| firebase         | 11.2.0  | JavaScript SDK for Firebase services.             |
