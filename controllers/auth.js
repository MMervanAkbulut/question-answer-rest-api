const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers");
const { validateUserInput, comparePassword } = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

const register = asyncErrorWrapper(async (req, res, next) => {
    // Post Data
    console.log(req.body);
    
    const {name, email, password, role} = req.body;

    // try catch block her zaman böyle kullanmamız gerekecek. değişiklik 
    // async, await
    const user = await User.create({
        name,
        // yeni sürümde aynı değişken adına sahipse bu şekilde kullanmaya gerek kalmıyor
        email: email, 
        password,
        role
    });
    
    sendJwtToClient(user, res);

    
});


// login operation
const login = asyncErrorWrapper(async (req, res, next) => {
    const {email, password} = req.body;
    if(!validateUserInput(email, password)){
        return next(new CustomError("Please check your input.", 400));
    }
    const user = await User.findOne({email}).select("+password");

    if(!comparePassword(password,user.password)){
        return next(new CustomError("please check your credentials", 400));
    }
    
    sendJwtToClient(user, res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {
    
    const { NODE_ENV} = process.env;

    return res.status(200)
    .cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "develeopment" ? false : true,
    }).json({
        success: true,
        message: "logout successfull"
    });

});

const getUser = (req, res, next) =>{
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    });
};


const imageUpload = asyncErrorWrapper(async (req, res, next) => {

    // profile image db update
    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image": req.savedProfileImage
    },
    // const user olarak aldığımız zaman eski kullanıcı geliyor. güncel olmayan bilgi geliyor
    // güncel kullanıcı gelmesi için aşağıdaki kodları eklememiiz gerekiyor 
    {
        new: true,
        runValidators: true
    })

    // image upload success
    res.status(200).json({
        success: true,
        message: "Image Upload Successful",
        data: user
    })

});

// Forgot Password
const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email;
    // console.log(resetEmail);
    const user = await User.findOne({email: resetEmail}); // await ile beklemezsek user boş dönüyor. Yani Promise olarak kalıyor.
    // console.log(user);
    if(!user){
        return next(new CustomError("There is no user whit this email", 400));
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser();
    // console.log(resetPasswordToken); undefined

    await user.save();
    
    // Mail process
    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemlate = `
    <h3>Reset Your Password</h3>
    <p> This <a href '${resetPasswordUrl}' target = '_blank'>link</a> will expire in 1 hour</p>
    `;

    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemlate
        });
       return res.status(200).json({
        success: true,
        message: "Token sent to your email"
        }); 
    }catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return next(new CustomError("Email Could Not Be Sent", 500))
    }
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
    
    const {resetPasswordToken} = req.query;
    const {password} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError("Please provide a valid token", 400));
    }

    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: {$gt : Date.now()} // mongoDb özelliği
    });
    if(!user){
        return next(new CustomError("Invalid Token or Session Expired", 400));
    }

    user.password == password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Reset Password Process Successful"
    })
});

const editDetails = asyncErrorWrapper(async (req, res, next) => {
    const editInformations = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, editInformations, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        success: true,
        data: user
    })

});



// ERROR TEST
// const errorTest = (req, res, next) =>{
//     // some code
    
//     // question does not exist
//     // return next(new customErrorHandler("question does not"));

//     return next(new TypeError("TypeError Message", 400));
//     // some code
// }

module.exports = {
    register,
    getUser,
    login,
    imageUpload,
    logout,
    forgotPassword,
    resetPassword,
    editDetails
};