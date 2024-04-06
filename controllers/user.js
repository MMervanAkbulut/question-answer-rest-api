const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {
    // user'ı bulma işlemi. Daha büyük db'lerde user'ı burada bulduktan sonra databaseErrorHelpers.js klasörüne res olarak gönderebiliriz.
    const {id} = req.params;
    const user = await User.findById(id);
    
    // user var mı sorgusunu başka router'larda kontrol etmek isteyebiliriz.
    // o yüzden middleware olarak yazıp kullanmak istediğimiz yerlerde kullanabiliriz. 
    // if(!user){
    //     return next(new CustomError("there is no such user whit that id"));
    // }

    return res.status(200).json({
        success: true,
        data: user
    });
});

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {

    return res.status(200).json(res.queryResults);
});


module.exports= {
    getSingleUser,
    getAllUsers
}