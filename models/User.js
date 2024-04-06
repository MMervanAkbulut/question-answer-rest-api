const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const cyrpto = require("crypto");
const Schema = mongoose.Schema;
const Question = require("./Question");


const UserSchema = new Schema({
    name :{
        type: String,
        required: [true,"Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email"
        ]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    password: {
        type: String,
        minlength: [6,"Please provide a password with min length 6"],
        required: [true,"Please provide a password"],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    place: {
        type: String
    },
    website: {
        type: String
    },
    profile_image: {
        type: String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken : {
        type: String
    },
    resetPasswordExpire : {
        type: Date
    }

});


//UserSchema Methods
UserSchema.methods.generateJwtFromUser = function () {
    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env;
    const payload = {
        id: this._id,
        name: this.name
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY,{
        expiresIn: JWT_EXPIRE,
    });
    return token;

}

// Reset password
UserSchema.methods.getResetPasswordTokenFromUser = function() {
    const randomHexString = cyrpto.randomBytes(15).toString("hex"); // random 15 tane random byte üretecek
    // console.log(randomHexString);
    const {RESET_PASSWORD_EXPIRE} = process.env;

    const resetPasswordToken = cyrpto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
    // console.log("Password token:", resetPasswordToken);

    this.resetPasswordToken = resetPasswordToken;
    // 1 saat geçerli
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;

}


// Pre Hooks, hashing password
UserSchema.pre("save", function(next){
    // console.log("pre hooks: save");
    // console.log(this.password);
    
    // parola değişmemişse
    if(!this.isModified("password")){
        next();
    }
    bcrypt.genSalt(10, (err, salt) => { // arrow function olarak yazmamız gerekiyordu.
        if(err){
            next(err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            // Store hash in your password DB.
            if(err){
                next(err);
            }
            this.password = hash;
            next();
        });
    });
});

UserSchema.post("deleteOne", async function(param1, param2) {
    console.log("this.user: ", this.user);

    // console.log("this: ", this); //user is Undefined here
    // console.log("this._id: " + this._id); // undefined
    const result = await Question.deleteMany({
        user : this._id
    });
    console.log("this._id: " + this._id); // undefined
    // console.log("user: " + user); user is not defined
    console.log("result: ", JSON.stringify(result)); // [object Object]
});


module.exports = mongoose.model("User", UserSchema);
// users collection oluşacak
