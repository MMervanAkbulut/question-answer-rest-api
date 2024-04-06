const mongoose = require("mongoose");

const connnectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Mongodb connection successful");
    })
    .catch(err => {
        console.log(err);
    })
};


module.exports = connnectDatabase;