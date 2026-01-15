const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const DB_PATH = "mongodb+srv://root:root@airbnb.fzehhma.mongodb.net/?appName=Airbnb";

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require("./routes/authRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const storeController = require("./controllers/storeController");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('views', path.join(__dirname, 'views/store'));
// OR
app.set('views', path.join(__dirname, 'views'));

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions'
});

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerOptions = {
  storage, fileFilter
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer(multerOptions).single('photo'));
// Use __dirname to explicitly point to the public folder in the current directory
app.use(express.static(path.join(__dirname, 'public')));

app.use("/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/host/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/homes/uploads", express.static(path.join(rootDir, 'uploads')))

app.use(session({
  secret: "KnowledgeGate AI with Complete Coding",
  resave: false,
  saveUninitialized: true,
  store
}));

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn
  next();
})

app.use(authRouter)
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/host", hostRouter);

// In your app.js or route file, make sure you have this import at the top:
const Home = require('./models/home'); // Adjust path based on your structure

// Then your search route:
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    
    if (!searchQuery || searchQuery.trim() === '') {
      return res.redirect('/homes');
    }
    
    // Now Home is defined
    const homes = await Home.find({
      $or: [
        { houseName: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    
    res.render('store/search-results', { 
      homes, 
      searchQuery,
      isLoggedIn: req.session.isLoggedIn,
      user: req.user || null
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).render('error', { 
      message: 'Error performing search'
    });
  }
});

// At the top with other imports
const searchController = require('./controllers/storeController');

// Then define your route
app.get('/search', searchController.searchHomes);
// app.js or routes file
app.post('/favourites', storeController.postAddToFavourite);
// or if using router

app.use(errorsController.pageNotFound);

const PORT = 3030;

mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});
