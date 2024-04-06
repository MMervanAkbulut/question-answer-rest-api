const User = require("../../models/User");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");

const checkUserExist = asyncErrorWrapper(async (req, res, next) =>{

    // user'ı bulma işlemi.
    const {id} = req.params;
    const user = await User.findById(id);
    
    // user var mı sorgusunu başka router'larda kontrol etmek isteyebiliriz.
    // o yüzden middleware olarak yazıp kullanmak istediğimiz yerlerde kullanabiliriz. 
    if(!user){
        return next(new CustomError("there is no such user whit that id"));
    }
    next();

});

const checkQuestionExist = asyncErrorWrapper(async (req, res, next) =>{

    // console.log(req.params.id); // undefined
    // console.log(req.params.question_id); // soru id

    const question_id = req.params.id || req.params.question_id;
    console.log(question_id);

    const question = await Question.findById(question_id);
    console.log(question);
    if(!question){
        return next(new CustomError("there is no such question whit that id"));
    }
    next();

});

const checkQuestionAndAnswerExist = asyncErrorWrapper(async (req, res, next) =>{

    const question_id = req.params.question_id;
    const answer_id = req.params.answer_id;

    const answer = await Answer.findOne({
        _id: answer_id,
        question: question_id
    });

    if(!answer){
        return next(new CustomError("There is no answer associated whit that id"), 400);
    }
    next();
});


module.exports = {
    checkUserExist,
    checkQuestionExist,
    checkQuestionAndAnswerExist
}