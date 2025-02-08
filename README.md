# **Healthcarre appointment system**

## **Table of contents**
1. [Project overview](#project-overview)
2. [Technology stack](#technology-stack) 
3. [Features](#features)
4. [Setup](#setup)
6. [API Endpoints](#api-endpoints)  
7. [Libraries](#libraries)  

---

## **Project overview**

This project is a web-based **Healthcarre appointment system** that facilitates interaction between doctors, patients, and an admin. The system provides different roles with unique functionalities such as managing doctor schedules, scheduling appointments, leaving reviews, and managing the system through admin privileges.

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
- **MongoDB** <br>
  Used as the primary database for storing user, doctor, and appointment data.
  Ensure your connection string is correctly configured in the .env file. <br><br>
- **Firebase** (Optional) <br>
  Admins can switch to Firebase for specific functionalities, with seamless integration through @angular/fire.
  
---

## **Features**

### **Patient**
- Browse doctors and reviews and schedule visits (with a cart and payment process simulation).
- Schedule visits. <br>
  Panel uses **web sockets** for real-time updates when doctors specify absence - slots are immediately marked as unavailable. <br>
- Check historical visits and scheduled visits.
- Leave reviews (only allowed if they have visited the doctor).
- Add comments on reviews.
- View a dashboard with alerts related to their visits and appointments.  <br>
  This dashboard uses **web sockets** for real-time updates when doctors specify absence, which intersects with scheduled visits.

![patient-panel](https://github.com/user-attachments/assets/89892318-057e-432a-b4a6-26db81d62b61)

### **Doctor** 
- Respond to comments in reviews.
- Add presence/absence to their calendar (absence overrides presence).

![doctor-panel](https://github.com/user-attachments/assets/aa7fe866-4fba-4799-af58-ddfdb24d7f95)

### **Admin**
- Ban users.
- Remove comments.
- Change the database type (MongoDB/Firebase).  
- Add and remove doctors.

![admin](https://github.com/user-attachments/assets/28957dc2-2ee3-4c67-9397-9d28d0e09fb0)

---

## **Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/podgorskip/healthcare-app
   cd healthcare-app
2. Build the Docker images 
   ```bash 
   docker-compose build
4. Run the application
   ```bash
   docker-compose up
5. Stopping the application
   To stop the running services, use:
   ```bash
   docker-compose down
   
### **Backend setup**

1. Create a **.env** file with the following variables:
   ```bash
   MONGO_URI=
   SECRET_KEY=
   REFRESH_SECRET_KEY=

### **Frontend setup**

1. Create a **environment.ts** file inside **environments** directory:
   ```typescript
   export const environment = {
      production: true,
      firebaseConfig: {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
      },
      mongoConfig: {
        baseUrl: "http://localhost:3000/api"
      }
    }


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
