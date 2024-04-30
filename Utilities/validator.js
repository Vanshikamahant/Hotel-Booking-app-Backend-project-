exports.ValidateName=function(name){
    if(name.length>=3) return true;
    return false;
}
exports.ValidatePassword=function(password){
    if(password.length>=8 && password.length<=12) return true;
    return false;
}
exports.ValidatePhoneNo=function(phonenum){
    if(phonenum.toString().length==10){return true}
    else{return false}
}

exports.ValidateEmail=function(emailAddress) {
        const atSymbol = emailAddress.indexOf("@");
        const dotSymbol = emailAddress.lastIndexOf(".");
        const spaceSymbol = emailAddress.indexOf(" ");

        if ((atSymbol != -1) &&
            (atSymbol != 0) &&
            (dotSymbol != -1) &&
            (dotSymbol != 0) &&
            (dotSymbol > atSymbol + 1) &&
            (emailAddress.length > dotSymbol + 1) &&
            (spaceSymbol == -1)) {
            return true;
        } return false;
}
exports.validateStartDate=function(sdate){
    const startdate=new Date(sdate);
    const currentdate=new Date();
    if(startdate>=currentdate){
        return true;
    }return false;
}

exports.validateEndDate=function(sdate,edate){
    const startdate=new Date(sdate);
    const enddate=new Date(edate);
    if(enddate>=startdate) return true;
    return false;
}

exports.validateNoOfPersons=function(no){
    if(no.toString()>0 && no.toString()<=5) return true;
    return false;
}

exports.validateNoOfRooms=function(no){
    if(no.toString()>0 && no.toString()<=5) return true;
    return false;
}