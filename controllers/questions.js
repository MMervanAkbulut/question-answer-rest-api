const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");



const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
  const information = req.body;

  const question = await Question.create({
    // title: information.title
    // content: information.content
    ...information,
    user: req.user.id
    
  });
  res.status(200).json({
    success: true,
    data: question
  });
});

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {
  // filitreleme işlemleri
  // console.log(req.query.search);

  // const questions = await Question.find(); // all questions
  // let query = Question.find();
  // const populate = true;
  // const populateObject = {
  //   path: "user",
  //   select: "name projile__image"
  // };
  // // Search
  // if(req.query.search){
  //   const searchObject = {};
  //   // query by title
  //   const regex = new RegExp(req.query.search, "i");
  //   searchObject["title"] = regex;
  //   query = query.where(searchObject);
  // }
  // if(populate){
  //   query = query.populate(populateObject);
  // }
  // const questions = await Question.find().where({
  //   title: "Questions 1 - Title"
  // });

  // // Pagination
  // // Derste pageInt yaptı req.query.page string gelmiş.Ben hata almadım.
  // const page = req.query.page || 1;
  // const limit = req.query.limit || 5;
  // // atlanacak değerler = mongoose => skip(); limit();
  // const startIndex = (page -1) * limit; // 0, 5
  // const endIndex = page * limit; // 5, 10
  // const total = await Question.countDocuments(); // kaç soru var?
  // const pagination = {};
  // if(startIndex>0){
  //   pagination.previous = {
  //     page: page-1,
  //     limit: limit
  //   }
  // }
  // if(endIndex < total){
  //   pagination.next = {
  //     page: page + 1,
  //     limit: limit
  //   }
  // }
  // query = query.skip(startIndex).limit(limit);

  // Sort: req.query.sortBy most-answered most-liked createdAt
  // const sortKey = req.query.sortBy;
  // if(sortKey === "most-answered"){
  //   query = query.sort("-answerCount -createdAt");
  // }
  // if(sortKey === "most-liked"){
  //   query = query.sort("-likeCount -createdAt");
  // }
  // else{
  //   query = query.sort("-createdAt");
  // }

  return res.status(200).json(res.queryResults);
  
});

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
  // const {id} = req.params;
  // const question = await Question.findById(id);
  return res.status(200).json(res.queryResults);
});

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
  const {id} = req.params;
  
  const {title, content} = req.body;

  let question = await Question.findById(id);


  question.title = title;
  question.content = content;
  
  question = await question.save();

  return res.status(200).json({
    success:true,
    data: question
  });

});

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
  const {id} = req.params;

  await Question.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Question delete operation is successful"
  });
});


const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const {id} = req.params;

  const question = await  Question.findById(id);

  // Like true
  if(question.likes.includes(req.user.id) === true){
    return next(new CustomError("You are already liked this question", 400));
  }
  question.likes.push(req.user.id);
  question.likeCount = question.likes.length;


  await question.save();
  return res.status(200).json({
    success: true,
    data: question
  });
  
});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const {id} = req.params;

  const question = await  Question.findById(id);

  if(!question.likes.includes(req.user.id))
  {
    return next(new CustomError("You cannot undo like operation for this question", 400));
  }

  const index = question.likes.indexOf(req.user.id);

  question.likes.splice(index, 1);
  question.likeCount = question.likes.length;


  await question.save();

  return res.status(200).json({
    success: true,
    data: question
  });
  
});


module.exports = {
  askNewQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion
};