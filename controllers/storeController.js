const Home = require("../models/home");
const User = require("../models/user");
// Assuming you have a Booking model or a way to store bookings in your User model
const mongoose = require('mongoose'); // Add at top of file
const Booking = require("../models/booking"); // Add this import

exports.getReserve = async (req, res, next) => {
  const homeId = req.params.homeId;
  try {
    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).render('404', { pageTitle: 'Home Not Found', isLoggedIn: req.session.isLoggedIn });
    }
    res.render('store/reserve', {
      home: home,
      pageTitle: 'Confirm and Book',
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
      currentPage: 'reserve'
    });
  } catch (err) {
    console.log(err);
  }
};



exports.getIndex = (req, res, next) => {
  console.log("Session Value: ", req.session);
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};


exports.getBookings = async (req, res, next) => {
  try {
    // 1. Fetch User and populate the 'home' details inside their bookings
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('bookings.home');

    // 2. Map the data to a clean format for the EJS file
    const bookings = user.bookings.map(booking => {
      // Safety check: if a home was deleted from DB, skip it
      if (!booking.home) return null; 

      return {
        id: booking._id.toString(),
        houseName: booking.home.houseName,
        photoUrl: "/" + booking.home.photo, // Fix path for display
        location: booking.home.location,
        price: booking.home.price,
        checkIn: booking.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        checkOut: new Date(booking.date.getTime() + 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), // Example +1 day
        guests: 1 
      };
    }).filter(b => b !== null); // Remove any null entries

    // 3. Render the page with the bookings data
    res.render("store/bookings", {
      pageTitle: "My bookings",
      currentPage: "bookings",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      bookings: bookings // <--- This fixes the "bookings is not defined" error
    });
  } catch (err) {
    console.log("Error fetching bookings:", err);
    res.redirect("/");
  }
};


exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn, 
        user: req.session.user,
      });
    }
  });
};


exports.postConfirmBooking = async (req, res, next) => {
  console.log('=== POST /confirm-booking called ===');
  console.log('Request body:', req.body);
  console.log('Session user:', req.session.user);
  
  try {
    // 1. Auth Check
    if (!req.session.user) {
      console.log('No user session');
      return res.status(401).json({ 
        success: false, 
        message: 'Please login first' 
      });
    }

    const { homeId, checkIn, checkOut, guests, totalPrice } = req.body;
    const userId = req.session.user._id;

    // 2. Validate required fields
    if (!homeId || !checkIn || !checkOut || !guests || !totalPrice) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields' 
      });
    }

    // 3. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(homeId)) {
      console.log('Invalid homeId:', homeId);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid home ID' 
      });
    }

    // 4. Find the home
    const home = await Home.findById(homeId);
    if (!home) {
      console.log('Home not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Home not found' 
      });
    }

    // 5. Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const now = new Date();
    
    if (checkInDate <= now) {
      return res.status(400).json({ 
        success: false, 
        message: 'Check-in date must be in the future' 
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Check-out must be after check-in' 
      });
    }

    // 6. Calculate nights
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // 7. Create booking using Booking model
    const booking = new Booking({
      home: homeId,
      user: userId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: parseInt(guests),
      totalPrice: parseFloat(totalPrice),
      status: 'confirmed'
    });

    console.log('Booking object created:', booking);

    // 8. Save booking
    await booking.save();
    
    console.log('Booking saved successfully. ID:', booking._id);

    // 9. Return JSON success response
    return res.status(200).json({ 
      success: true,
      message: 'Booking confirmed successfully',
      bookingId: booking._id,
      redirectUrl: '/bookings'
    });
    
  } catch (err) {
    console.error("ERROR in postConfirmBooking:", err);
    
    return res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + err.message 
    });
  }
};



// Add 'async' here so you can use 'await' inside
exports.postBooking = async (req, res, next) => {
  const { homeId, checkIn, checkOut, guests } = req.body;
  const Booking = require("../models/booking");
  
  try {
    const newBooking = new Booking(homeId, checkIn, checkOut, guests);
    
    // Save the new booking
    await newBooking.save();

    // Fetch the updated list of bookings to pass to the view
    // Ensure your model/DB query logic matches your DB setup
    const bookings = await Booking.find({ userId: req.user._id });

    // Render the success page
    res.render("store/booking-success", {
      pageTitle: "Booking Successful",
      currentPage: "bookings",
      // PASS THE VARIABLE, NOT A STRING
      bookings: bookings 
    });
    
  } catch (error) {
    console.error("Booking Error:", error);
    res.redirect("/homes");
  }
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;

  if (!req.file) {
    return res.status(422).send("No image provided");
  }

  const photo = req.file.path;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });

  // FIX: Redirect is now INSIDE the .then() block
  home.save().then(() => {
    console.log("Home Saved successfully");
    res.redirect("/host/host-home-list"); 
  }).catch(err => {
    console.log("Error saving home:", err);
    res.redirect("/host/add-home"); // Optional: redirect back on error
  });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;
  
  Home.findById(id)
    .then((home) => {
      if (!home) {
        console.log("Home not found");
        return res.redirect("/host/host-home-list");
      }

      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.file) {
        // Delete old photo
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("Error while deleting file ", err);
          }
        });
        home.photo = req.file.path;
      }

      // Return the save promise to chain the next .then()
      return home.save();
    })
    .then((result) => {
      console.log("Home updated");
      // FIX: Redirect happens only after update is successful
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error while updating ", err);
      res.redirect("/host/host-home-list");
    });
};

// controllers/searchController.js


exports.searchHomes = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    
    if (!searchQuery || searchQuery.trim() === '') {
      return res.redirect('/homes');
    }
    
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
      isLoggedIn: req.isAuthenticated(),
      user: req.user || null
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).render('error', { 
      message: 'Error performing search'
    });
  }
};
