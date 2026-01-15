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

📸 Screens / Pages Included

Home Page

Login & Signup

Home Listing Page

Home Detail Page

Reservation Page

Booking Success Page

Favourite Homes Page

Host Dashboard

404 Error Page



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
