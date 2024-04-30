const {userModel,bookingModel}=require('../Model/hotelSchema');


exports.generateUserId=async ()=>{
    const user=await userModel.find({});
    const id="U-00"+user.length;
    // console.log(id);
    return id;
}

exports.bookingId=async ()=>{
    const booking=await bookingModel.find({});
    const id="B-00"+booking.length;
    return id;
}