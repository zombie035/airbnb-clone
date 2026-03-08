# airbnb-clone

Perfect 👍
Based on your actual project structure and the tech stack you listed, here is a polished, recruiter-ready README.md tailored exactly for your Airbnb Clone.

You can copy–paste this directly into README.md.


---

🏡 Airbnb Clone

A full-stack Airbnb Clone web application built using Node.js, Express.js, MongoDB, EJS, and Tailwind CSS.
This project replicates the core functionality of Airbnb, allowing users to browse homes, view details, make reservations, manage favourites, and host properties.


---

🚀 Features

👤 Authentication

User signup & login

Session-based authentication

Protected routes for hosts and users


🏠 Property Management

Add, edit, and delete homes (Host functionality)

View all available homes

Detailed home view with pricing & description


❤️ User Features


Add homes to favourites

View favourite homes list

Make reservations

Booking success confirmation


🧑‍💼 Host Dashboard

View hosted homes list

Edit home details

Manage listings


🎨 UI & UX

Server-side rendering with EJS

Reusable partials (Navbar, Head, Errors)

Styled using Tailwind CSS

Responsive layout



---

🛠️ Tech Stack

Frontend

HTML

CSS

JavaScript

EJS (Embedded JavaScript Templates)

Tailwind CSS


Backend

Node.js

Express.js


Database

MongoDB

Mongoose ODM


Other Tools

Nodemon

MVC Architecture



---

📂 Project Structure

```
project/
│
├── controllers/
│   ├── authController.js
│   ├── hostController.js
│   ├── storeController.js
│   └── errors.js
│
├── models/
│   ├── user.js
│   └── home.js
│
├── routes/
│   ├── authRouter.js
│   ├── hostRouter.js
│   └── storeRouter.js
│
├── views/
│   ├── auth/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   │
│   ├── host/
│   │   ├── edit-home.ejs
│   │   └── host-home-list.ejs
│   │
│   ├── store/
│   │   ├── index.ejs
│   │   ├── home-list.ejs
│   │   ├── home-detail.ejs
│   │   ├── reserve.ejs
│   │   ├── bookings.ejs
│   │   ├── booking-success.ejs
│   │   └── favourite-list.ejs
│   │
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── nav.ejs
│   │   ├── errors.ejs
│   │   └── favourite.ejs
│   │
│   └── 404.ejs
│
├── uploads/
├── utils/
├── input.css
├── tailwind.config.js
├── app.js
├── package.json
└── nodemon.json
```

---

⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-username/airbnb-clone.git
cd airbnb-clone

2️⃣ Install Dependencies

npm install

3️⃣ Setup Environment Variables

Create a .env file:

MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key

4️⃣ Run the Application

npm start

or (for development):

npm run dev

5️⃣ Open in Browser

http://localhost:3000


---

## 📸 Screenshots / Pages Included

### 🏠 Home Page
<img src="https://github.com/user-attachments/assets/a18b056e-9ad7-4b2b-a8dc-0f4037b34cd6" width="350" />

### 🔐 Login & Signup
<p align="center">
  <img src="https://github.com/user-attachments/assets/9d83f64e-4de7-4753-b902-3bb80302d887" width="350" />
  <img src="https://github.com/user-attachments/assets/c7894be7-6911-4d6d-9fae-d949513d2927" width="350" />
</p>

### 🏘️ Home Listing Page
<img src="https://github.com/user-attachments/assets/88b46f2c-e4e0-445c-b208-7c0b9592b84c" width="350" />

### 🏡 Home Detail Page
<p align="center">
  <img src="https://github.com/user-attachments/assets/d0ca4aa7-2b8c-4804-a85a-4a5bb4b2686d" width="350" />
  <img src="https://github.com/user-attachments/assets/73fecb3b-9692-42f0-8bf7-35a11a53d8d4" width="350" />
  <img src="https://github.com/user-attachments/assets/0e65e53a-bf7d-4afb-841d-e17a232a5fcd" width="350" />
</p>

### 📅 Reservation Page
<p align="center">
  <img src="https://github.com/user-attachments/assets/bfa8a908-eb49-48d1-a010-f6099bfd0915" width="350" />
  <img src="https://github.com/user-attachments/assets/fc07201e-e44f-4b97-b786-c780d68d848c" width="350" />
  <img src="https://github.com/user-attachments/assets/aa8cbb98-7f6e-49e4-90f2-aba4484f28df" width="350" />
</p>

### ✅ Booking Success Page
<img src="https://github.com/user-attachments/assets/a2eba57d-5849-4e92-9e9f-376a5e3b4001" width="350" />

### ❤️ Favourite Homes
<img src="https://github.com/user-attachments/assets/c74db24e-0879-4d2d-8cc6-6112f554479f" width="350" />

### 🧑‍💼 Host Dashboard
<p align="center">
  <img src="https://github.com/user-attachments/assets/1e757a86-b13b-48ca-b044-084c0da4b78f" width="350" />
  <img src="https://github.com/user-attachments/assets/fb87994f-0707-48c3-9aff-0ae3e117005d" width="350" />
</p>

### ❌ 404 Error Page
<img src="https://github.com/user-attachments/assets/fc0d1876-f86d-429e-84a2-66a9e7241797" width="350" />


---

🧠 Architecture

MVC (Model–View–Controller) Pattern

Route-based modular structure

Reusable EJS partials

Clean separation of concerns



---

🔮 Future Improvements

Payment gateway integration

Image upload using cloud storage

Reviews & ratings system

Admin dashboard

JWT-based authentication

API version for frontend frameworks



---

👨‍💻 Author

Surendra Purohit
📌 Full-Stack Developer
🛠️ Node.js | Express.js | MongoDB | Tailwind CSS


---

⭐ Acknowledgements

Inspired by Airbnb for learning and educational purposes only.
This project is built to demonstrate full-stack development skills.


---

<!-- CodeRabbit review trigger -->
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/zombie035/airbnb-clone?utm_source=oss&utm_medium=github&utm_campaign=zombie035%2Fairbnb-clone&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
