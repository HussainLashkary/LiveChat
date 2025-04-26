const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv")
dotenv.config();

if (process.env.NODE_ENV === "development") {
    mongoose.connect(process.env.DB_STRING).then(() => {
        console.log("connect to mongodb")
    }).catch(err => {
        console.log(`${err} connect to mongodb failed`)
    });    
} else {
    mongoose.connect().then(() => {
        console.log("connect to mongodb")
    }).catch(err => {
        console.log(`${err} connect to mongodb failed`)
    });    
}