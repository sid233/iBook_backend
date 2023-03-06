const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

// const mongoURI = "mongodb+srv://sid233:1234@cluster0.r3ymjza.mongodb.net/iBook?retryWrites=true&w=majority"
require('dotenv').config()
const mongoURI = process.env.REACT_APP_DB


const connectToMongo = () =>{
    mongoose.connect(mongoURI, {
        useNewUrlParser: true
    }).then(()=>{
        console.log("connected to mongo successfully");
    }).catch((err)=>console.log("no connection",err))


}

module.exports = connectToMongo;    