const fs=require('fs');

const {promisify}=require('util');

const append=promisify(fs.appendFile);

async function reqlogger(req,res,next){
    try{
        const message=`${new Date()} - ${req.url} - ${req.method} \n`;
        await append("Logger.log",message);
        next();
    }
    catch(err){
        next(err);
    }
}

module.exports=reqlogger;