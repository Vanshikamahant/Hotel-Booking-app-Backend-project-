const express=require('express');
const routing=express.Router();
const hotelController=require('../Controller/hotelcontroller');

routing.post('/register',hotelController.signUp);
routing.get('/login',hotelController.login);
routing.get('/hotels',hotelController.listOfHotel);
routing.post('/bookings/:userId/:HotelName',hotelController.bookRoom);
routing.put('/bookings/:userId',hotelController.reschedulingBooking);
routing.delete('/bookings/:userId/:bookingId',hotelController.cancelBooking);
routing.get('/bookings/:userId',hotelController.displayBookingByUser);
routing.put('/reviews',hotelController.addReview);
routing.get('/reviews/:HotelName',hotelController.getReviews);
routing.get('/logout',hotelController.logout);
routing.all('*',hotelController.invalidpath);
module.exports=routing;