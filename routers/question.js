const express = require("express");
const { 
    askNewQuestion, 
    getAllQuestions, 
    getSingleQuestion, 
    editQuestion, 
    deleteQuestion, 
    likeQuestion, 
    undoLikeQuestion 
} = require("../controllers/questions");
const {getAccessToRoute, getQuestionOwnerAccess} = require("../middlewares/authorization/auth");
const {checkQuestionExist} = require("../middlewares/database/databaseErrorHelpers")
const router = express.Router();// api/question
const answer = require("./answer");
const questionsQuery = require("../middlewares/query/questionsQueryMiddleware");
const Question = require("../models/Question");
const {answerQueryMiddleware} = require("../middlewares/query/answerQueryMiddleware");


router.get("/", questionsQuery(
    Question,
    {
        population: {
            path: "user",
            select: "name profile_image"
        }
    }
),getAllQuestions);
router.get("/:id/like", [getAccessToRoute,checkQuestionExist], likeQuestion);
router.post("/ask", getAccessToRoute, askNewQuestion);
router.get("/:id", checkQuestionExist, answerQueryMiddleware(Question,{
    population: [{
        path: "user",
        select: "name profile_image"
    },
    {
        path: "answers",
        select: "content"
    }
]
}), getSingleQuestion);
router.put("/:id/edit", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);
router.delete("/:id/delete", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion);
router.get("/:id/undo_like", [getAccessToRoute, checkQuestionExist], undoLikeQuestion);


// Answer 
// question_id bir alt router'a (answer) gitmiyor.
router.use("/:question_id/answers", checkQuestionExist, answer);

module.exports = router;
