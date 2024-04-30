const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/hotel',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>console.log("DB Connection Successfully"));

const hotelSchema=new mongoose.Schema({
    HotelName:{type:String,required:true},
    Description:{type:String,required:true},
    Amenities:{type:String,required:true},
    PhoneNo:{type:Number,require:true},
    Address:{type:String,required:true},
    Reviews:{type:Array,required:true},
},
{
    timestamps:{
        createdAt:true,
        updatedAt:true
    },
}
);
const hotelModel=mongoose.model('hotel',hotelSchema);

const userSchema=new mongoose.Schema({
    userId:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    address:{type:String,required:true},
    email:{type:String,required:true},
    phoneNo:{type:Number,required:true},
    password:{type:String,required:true},
    userBookings:{type:Array,required:true},
},
{
    timestamps:{
        createdAt:true,
        updatedAt:true
    },
}
);

const userModel=mongoose.model('user',userSchema);

const bookingSchema=new mongoose.Schema({
    bookingId:{type:String,required:true},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    noOfPersons:{type:Number,required:true},
    noOfRooms:{type:Number,required:true},
    typeOfRoom:{type:String,required:true},
},
{
    timestamps:{
        createdAt:true,
        updatedAt:true
    },
}
);

const bookingModel=mongoose.model('booking',bookingSchema);

module.exports={
    hotelModel,userModel,bookingModel
};