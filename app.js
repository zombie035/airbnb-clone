// ========== IMPORTS ==========
require('dotenv').config(); 
const path = require('path');

// External Modules
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const multer = require('multer');

// Local Modules
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const errorsController = require("./controllers/errors");
const storeController = require("./controllers/storeController");

// ========== CONFIGURATION ==========
const app = express();
const DB_PATH = process.env.DB_URL || "mongodb://localhost:27017/airbnb-dev";
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';

// ========== SECURITY MIDDLEWARE ==========
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ========== VIEW ENGINE SETUP ==========
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========== BODY PARSING & FILE UPLOADS ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced file upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

app.use(upload.single('photo'));

// ========== STATIC FILES ==========
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========== SESSION CONFIGURATION ==========
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions',
  ttl: 24 * 60 * 60 // 24 hours
});

store.on('error', (error) => console.error('Session store error:', error));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Changed to false for security
  store,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ========== CUSTOM MIDDLEWARE ==========
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.user = req.session.user || null;
  next();
});

// ========== ROUTES ==========
app.use(authRouter);
app.use(storeRouter);

// Protected host routes
app.use("/host", (req, res, next) => {
  req.session.isLoggedIn ? next() : res.redirect("/login");
}, hostRouter);

// Search route (single implementation)
app.get('/search', storeController.searchHomes);

// ========== ERROR HANDLING ==========
app.use(errorsController.pageNotFound);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', {
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// ========== DATABASE & SERVER START ==========
const PORT = process.env.PORT || 3030;

mongoose.connect(DB_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
