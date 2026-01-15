const Home = require("../models/home");
const fs = require("fs");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

// FIX 1: Added 'async' keyword
exports.postAddHome = async (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;

  if (!req.file) {
    return res.status(422).send("Error: No image provided");
  }

  // FIX 2: Replace backslashes with forward slashes for Windows compatibility
  const photo = req.file.path.replace(/\\/g, "/");

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });

  try {
    // FIX 3: Wait for the database to finish saving BEFORE redirecting
    await home.save();
    console.log("Home Saved successfully");
    res.redirect("/host/host-home-list");
  } catch (err) {
    console.log("Error saving home:", err);
    res.status(500).send("Error saving home to database.");
  }
};

// FIX 4: Added 'async' keyword for Edit as well
exports.postEditHome = async (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;

  try {
    const home = await Home.findById(id);
    if (!home) {
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
        if (err) console.log("Error deleting old file:", err);
      });
      // Fix Windows path for new photo
      home.photo = req.file.path.replace(/\\/g, "/");
    }

    await home.save();
    console.log("Home updated successfully");
    res.redirect("/host/host-home-list");
  } catch (err) {
    console.log("Error updating home:", err);
    res.redirect("/host/host-home-list");
  }
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
      res.redirect("/host/host-home-list");
    });
};
