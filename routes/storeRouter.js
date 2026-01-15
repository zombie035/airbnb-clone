// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

// Main Browsing Routes
storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavouriteList);

// Home Details Route
storeRouter.get("/homes/:homeId", storeController.getHomeDetails);

// Favourites Logic
storeRouter.post("/favourites", storeController.postAddToFavourite);
storeRouter.post("/favourites/delete/:homeId", storeController.postRemoveFromFavourite);

// --- NEW RESERVATION ROUTES ---

// 1. Route to show the 'Confirm and Pay' UI for a specific home
storeRouter.get("/reserve/:homeId", storeController.getReserve);

// 2. Route to process the booking form submission
storeRouter.post("/bookings/confirm", storeController.postConfirmBooking);

module.exports = storeRouter;
