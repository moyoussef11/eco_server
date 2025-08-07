# 🛍️ E-commerce Platform (MERN Stack)

A full-featured e-commerce web application built using the **MERN stack** (MongoDB, Express, React, Node.js) with modern tools like **Redux Toolkit**, **Tailwind CSS**, and **JWT Authentication**.

---

## 🖼️ Features

### 👤 User Side
- Register / Login / Email Verification / Password Reset
- Browse and search for products
- Add to cart / Remove from cart
- Checkout and place orders
- View order history
- Update personal profile

### 🛠️ Admin Panel
- Manage products (Add / Edit / Delete)
- Manage users and roles
- View and manage orders
- Dashboard with overview statistics

---

## 🔧 Tech Stack

| Frontend                  | Backend                         |
|---------------------------|----------------------------------|
| React.js                  | Node.js + Express.js             |
| Redux Toolkit             | MongoDB + Mongoose               |
| Tailwind CSS              | JWT Authentication               |
| Axios                     | Nodemailer (email features)      |
| React Router DOM          | Express Validator                |

---

## 📂 Project Structure

### Frontend (`eco_client`)
```
📁 src
├── components        # Reusable UI components
├── pages             # Main route-based pages
├── redux             # State management using Redux Toolkit
├── services          # Axios API calls
├── App.js / index.js # Entry points
```

### Backend (`eco_server`)
```
📁 controllers       # Route logic
📁 models            # MongoDB models
📁 routes            # API endpoints
📁 middleware        # Auth & validation
📁 utils             # Email handling etc.
server.js           # App entry point
```

---

## 🛡️ Security & Auth

- Passwords hashed with bcrypt
- JWT-based authentication for secure access
- Email verification & password reset via Nodemailer
- Protected routes for users/admins

---

## 🚀 How to Run Locally

### 1️⃣ Clone both repositories:
```bash
git clone https://github.com/moyoussef11/eco_client
git clone https://github.com/moyoussef11/eco_server
```

### 2️⃣ Setup Backend
```bash
cd eco_server
npm install
# Add .env file with required variables (see below)
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd eco_client
npm install
npm start
```

---

## 🧪 .env Sample (Backend)

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
```

---

## 📝 Notes

- You can test all endpoints using Postman.
- You may also deploy the frontend (e.g. Vercel) and backend (e.g. Render) and update the `CLIENT_URL` and `API_URL`.

---


