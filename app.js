const express=require('express');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const logger=require('./Utilities/logger');
const route=require('./Routes/routing');

const app=express();
app.use(logger);
app.use(cookieParser());
app.use(bodyparser.json());
app.use('/',route);

const port=process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Hotel Booking App Running in Port ${port}....`);
})
