const {hotelModel,userModel,bookingModel}=require('../Model/hotelSchema');
const validator=require('../Utilities/validator');
const dbvalidator=require('../Utilities/dbvalidator');

exports.signUp=async (req,res)=>{
    try{
        if(
            validator.ValidateName(req.body.name) && (validator.ValidatePassword(req.body.password)) &&
            validator.ValidatePhoneNo(req.body.phoneNo) && validator.ValidateEmail(req.body.email)
        ) {
            const user= await userModel.find({email:req.body.email});
            if(user.length>0){
                res.status(400).json({
                    "status": "error",
                    "data": {
                        "message": "User exists with this email id"
                    }
                });
            }else{
                const id=await dbvalidator.generateUserId();
                const user=await userModel.create({
                userId:id,
                name:req.body.name,
                address:req.body.address,
                email:req.body.email,
                phoneNo:req.body.phoneNo,
                password:req.body.password,
                userBookings:[],
                 });
            res.status(201).json({
                "status":"success",
                "data":{
                    user,
                    "message":`Successfully registered with user id ${id}`
                }
              });
            }

        } else if(!validator.ValidateName(req.body.name)){
            res.status(400).json({
                "status":"error",
                "data":{
                    "message":"Enter a valid name with at least 3 characters"
                }
            });
        } else if(!validator.ValidatePhoneNo(req.body.phoneNo)){
            res.status(400).json({
                "status": "error",
                "data": {
                    "message": "Enter a valid phone no. with 10 digits"
                }
            });
        } else if(!validator.ValidateEmail(req.body.email)){
            res.status(400).json({
                "status": "error",
                "data": {
                    "message": "Enter a valid email id"
                }
            });
        } else if(!validator.ValidatePassword(req.body.password)){
            res.status(400).json({
                "status": "error",
                "data": {
                    "message": "Enter a valid password with at least 8 and not more than 12 characters"
                }
            });
        }
    }
    catch (err) {
       //console.log(err);
        res.status(404).json({
          status: 'fail',
          message: err,
        });
      }
}

exports.login=async (req,res)=>{
    try{
       if(validator.ValidatePassword(req.body.password)){
            const user=await userModel.find({userId:req.body.userId});
            if(user.length>0 && user[0].password==req.body.password){
                res.status(201).cookie("username",req.body.userId);
                res.send("username added to cookies");
                //res.send(req.cookies);
            }else{
                res.status(400).json({
                    "status": "error",
                    "data": {
                        "message": "Incorrect user id or password"
                    }
                })
            }

        }else{
            res.status(400).json({
                "status": "error",
                "data": {
                    "message": "Enter a valid password with at least 8 and not more than 12 characters"
                }
            })
        }
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err,
          });
    }
    
}

exports.listOfHotel=async (req,res)=>{
    try{
        const hotel=await hotelModel.find({});
        if(hotel.length>0){
            res.status(200).json({
                "status":"success",
                "results":2,
                "data":hotel
            })
        }
    }catch(err){
        res.status(404).json({
            status:'fail',
            data:"No Data Found in Database",
            message:err,
        });
    }
}   
exports.bookRoom=async (req,res)=>{
   try{
      if((validator.validateStartDate(req.body.startDate)) && (validator.validateEndDate(req.body.startDate,req.body.endDate))
      && (validator.validateNoOfPersons(req.body.noOfPersons)) && (validator.validateNoOfRooms(req.body.noOfRooms))  
      ){
        const user=await userModel.find({userId:req.params.userId});
        const hotel=await hotelModel.find({HotelName:req.params.HotelName});
        if(user.length>0 && hotel.length>0){
            const bookings=await bookingModel.find({startDate:req.body.startDate,endDate:req.body.endDate});
            const user=await userModel.find({userId:req.params.userId});
            if(bookings.length>0 && user[0].userBookings.length>0){
                res.status(400).json({
                    "status": "error",
                    "data": {
                        "message": "You have a booking on the same date"
                    }
                })
            }else{
                const Id=await dbvalidator.bookingId();
                const bookings=await bookingModel.create({
                    bookingId:Id,
                    startDate:req.body.startDate,
                    endDate:req.body.endDate,
                    noOfPersons:req.body.noOfPersons,
                    noOfRooms:req.body.noOfRooms,
                    typeOfRoom:req.body.typeOfRoom
                });
                const user=await userModel.findOneAndUpdate(
                    { userId:req.params.userId},
                    {userBookings:bookings},
                    {
                        new:true,
                        runValidators:true
                    }
                );
                res.status(201).json({
                    "status": "success",
                    "data": {
                        data:user,
                        "message": `Successfully made a booking with booking id ${Id}`
                    }
                })
            }
        }else if(!user.length>0){
            res.status(400).json({
                "status": "error",
                "data": {
                    "message": "Not a valid User Id"
                }
            });
        }else if(!hotel.length>0){
            res.status(400).json({
                "status": "error",
                "data": {
                    "message": "Not a valid Hotel Name"
                }
            });
        }
      }else if(!validator.validateStartDate(req.body.startDate)){
        res.status(400).json({
            "status": "error",
            "data": {
                "message": "Start Date should be a date greater than or equal to today"
            }
        });
      }else if(!validator.validateEndDate(req.body.startDate,req.body.endDate)){
        res.status(400).json({
            "status": "error",
            "data": {
                "message": "End Date should be a date greater than or equal to start date"
            }
        });
      }else if(!validator.validateNoOfPersons(req.body.noOfPersons)){
        res.status(400).json({
            "status": "error",
            "data": {
                "message": "Number of Persons should be a valid number greater than 0 and less than or equal to 5"
            }
        });
      }else if(!validator.validateNoOfRooms(req.body.noOfRooms)){
        res.status(400).json({
            "status": "error",
            "data": {
                "message": "Number of rooms should be a valid number greater than 0 and less than or equal to 3"
            }
        });
      }
   }catch(err){
    res.status(404).json({
        status: 'fail',
        message: err,
      });
   }
}

exports.reschedulingBooking=async (req,res)=>{
    try{
        if((validator.validateStartDate(req.body.startDate)) && (validator.validateEndDate(req.body.startDate,req.body.endDate))){
            const user=await userModel.find({userId:req.params.userId});
            if(user.length>0 && (user[0].userBookings[0].bookingId==req.body.bookingId)){
                const booking=await bookingModel.findOneAndUpdate(
                    {bookingId:req.body.bookingId},
                    req.body,
                    {
                        new:true,
                        runValidators:true
                    }
                );
                const user=await userModel.findOneAndUpdate(
                    {userId:req.params.userId},
                    {userBookings:booking},
                    {
                        new:true,
                        runValidators:true
                    }
                    
                )
                res.status(200).json({
                    "status": "success",
                    "data": {
                        data:user,
                        "message": `Successfully rescheduled the booking with booking id ${req.body.bookingId}`
                    }
                })
            }else{
                res.status(400).json({
                    "status": "error",
                    "data": {
                        "message": "Not a valid Booking Id or User Id"
                    }
                });
            }
       }else if(!validator.validateStartDate(req.body.startDate)){
        res.status(400).json({
            "status": "error",
            "data": {
                "message": "Start Date should be a date greater than or equal to today"
            }
        });

      }else if(!validator.validateEndDate(req.body.startDate,req.body.endDate)){
        res.status(400).json({
            "status": "error",
            "data": {
                "message": "End Date should be a date greater than or equal to start date"
            }
        }); 
      }
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
}

exports.cancelBooking=async (req,res)=>{
    try{
        const user=await userModel.find({userId:req.params.userId});        
        if(user.length>0 && user[0].userBookings[0].bookingId==req.params.bookingId){
            const delBooking=await bookingModel.deleteOne({bookingId:req.params.bookingId});
            if(delBooking.deletedCount>0){
                
                const user=await userModel.findOneAndUpdate(
                    {userId:req.params.userId},
                    {userBookings:[]},
                    {
                        new:true,
                        runValidators:true
                    }
                ) ;
                res.status(201).json({
                    "status": "success",
                    "data": {
                        "message": `Successfully deleted the booking with booking id ${req.params.bookingId}`
                    }
                });
            }
        }else{
            res.status(400).json({
                "status": "error",
                "data": {
                    "message": "Could not delete the booking"
                }
            });
        }
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        })
    }
}

exports.displayBookingByUser=async (req,res)=>{
    try{
        const user=await userModel.find({userId:req.params.userId});
        if(user[0].userBookings.length>0){
            res.status(201).json({
                "status": "success",
                "results": 1,
                "data":{
                    "userBookings":user[0].userBookings,}
            });
        }else{
            res.status(400).json({
                "status": "success",
                "data": {
                    "message": "No Bookings done yet"
                }
            });
        }
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
    }
}

exports.addReview=async (req,res)=>{
    try{
        const hotel=await hotelModel.find({HotelName:req.body.HotelName});
        if(hotel.length>0){            
            const hotel=await hotelModel.findOneAndUpdate(
                {HotelName:req.body.HotelName},
                {Reviews:req.body.Reviews},
                {
                    new:true,
                    runValidators:true
                }
            )
            res.status(201).json({
                "status": "success",
                "data": {
                    "message": `Successfully added the review for ${req.body.HotelName}`
                }
            });
        }else{
            res.status(400).json({
                "status": "error",
                "data": {
                    "message": "Not a valid Hotel Name"
                }
            });
        }
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
    }
}

exports.getReviews=async (req,res)=>{
    try{
        const hotel=await hotelModel.find({HotelName:req.params.HotelName});
        if(hotel.length>0){
            if(hotel[0].Reviews.length>0){
                res.status(201).json({
                    "status": "success",
                    "results": 1,
                    "data": [
                        {
                            "Reviews": hotel[0].Reviews[0],
                        }
                    ]
                });
            }else{
                res.status(400).json({
                    "status": "error",
                    "data": {
                        "message": `No reviews added yet for ${req.params.HotelName}`
                    }
                })
            }
        }else{
            res.status(400).json({
                "status": "success",
                "results": 1,
                "data": {
                   "message": `${req.params.HotelName} is not a valid hotel`
                }
            });
        }
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err,
        });
    }
}

exports.logout=async (req,res)=>{
    res.status(201).clearCookie('username');
    res.send({"message": "You are logged out!!"});
}

exports.invalidpath=async (req,res)=>{
    res.status(404).json({
        "status": "fail",
        "message": "Invalid path"
    });
}