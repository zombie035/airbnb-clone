const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");

const bookingDataPath = path.join(rootDir, "data", "bookings.json");

module.exports = class Booking {
  constructor(homeId, checkIn, checkOut, guests) {
    this.homeId = homeId;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.guests = guests;
    this.id = Math.random().toString();
  }

  save(callback) {
    fs.readFile(bookingDataPath, (err, data) => {
      let bookings = [];
      if (!err && data.length > 0) {
        bookings = JSON.parse(data);
      }
      bookings.push(this);
      fs.writeFile(bookingDataPath, JSON.stringify(bookings), (error) => {
        callback(error);
      });
    });
  }

  static fetchAll(callback) {
    fs.readFile(bookingDataPath, (err, data) => {
      callback(!err && data.length > 0 ? JSON.parse(data) : []);
    });
  }
};
