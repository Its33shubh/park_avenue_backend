# 🍽️ Park Avenue Backend API

A RESTful Backend API for a Restaurant Management System built with **Node.js**, **Express.js**, **MongoDB**, and **JWT Authentication**.

## 🚀 Live Demo

```txt
https://park-avenue-backend.onrender.com
```

---

## 📖 Overview

Park Avenue Backend provides APIs for:

* User Authentication
* Category Management
* Product Management
* Order Management
* Table Management
* User Management
* Admin Dashboard
* Reports & Analytics

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt.js
* Multer
* Cloudinary
* Render

---

## ✨ Features

### User Features

* User Registration
* User Login
* View Categories
* View Products
* Place Orders
* Table Booking Support

### Admin Features

* Dashboard Statistics
* Manage Categories
* Manage Products
* Manage Orders
* Manage Users
* Change User Roles
* Block/Unblock Users
* Manage Tables
* Generate Reports

---

## 📂 API Endpoints

### Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |

---

### Categories

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | `/api/category/get`        |
| POST   | `/api/category/add`        |
| PUT    | `/api/category/update/:id` |
| DELETE | `/api/category/delete/:id` |

---

### Products

| Method | Endpoint                  |
| ------ | ------------------------- |
| GET    | `/api/product/get`        |
| POST   | `/api/product/add`        |
| PUT    | `/api/product/update/:id` |
| DELETE | `/api/product/delete/:id` |
| PATCH  | `/api/product/toggle/:id` |

---

### Orders

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/api/order/create`     |
| GET    | `/api/order/get`        |
| PATCH  | `/api/order/accept/:id` |
| PATCH  | `/api/order/reject/:id` |

---

### Users

| Method | Endpoint                      |
| ------ | ----------------------------- |
| GET    | `/api/admin/users`            |
| PATCH  | `/api/admin/users/role/:id`   |
| PATCH  | `/api/admin/users/status/:id` |

---

### Tables

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/api/table/add`        |
| GET    | `/api/table/get`        |
| DELETE | `/api/table/delete/:id` |
| PATCH  | `/api/table/status/:id` |

---

### Reports

| Method | Endpoint      |
| ------ | ------------- |
| GET    | `/api/report` |

#### Supported Filters

```http
/api/report?year=2026&month=5

/api/report?userId=USER_ID

/api/report?startDate=2026-05-01&endDate=2026-05-10

/api/report?minAmount=200&maxAmount=500
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Its33shubh/park-avenue-backend.git
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📁 Project Structure

```bash
backend/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── utils/
├── uploads/
│
├── server.js
├── package.json
└── README.md
```

---

## 🚀 Future Enhancements

* QR Code Ordering
* Payment Gateway Integration
* Real-Time Notifications
* Advanced Analytics Dashboard
* AI-Based Restaurant Insights

---

## 👨‍💻 Author

**Shubham Kaklotar**

GitHub: https://github.com/Its33shubh

LinkedIn: https://linkedin.com/in/shubham-kaklotar

---

