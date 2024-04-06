const express = require("express");
// merge params ile question_id buraya geliyor
const router = express.Router({mergeParams: true});
const {addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswers, editAnswer, deleteAnswer, likeAnswer, undoLikeAnswer} = require("../controllers/answer")
const {getAccessToRoute} = require("../middlewares/authorization/auth");
const {checkQuestionAndAnswerExist} = require("../middlewares/database/databaseErrorHelpers");
const {getAnswerOwnerAccess} = require("../middlewares/authorization/auth");

// router.get("/", (req, res, next) => {
//     console.log(req.params); // şuan boş
//     res.send("Answers route");
// });
router.post("/", getAccessToRoute, addNewAnswerToQuestion);
router.get("/", getAllAnswersByQuestion);
router.get("/:answer_id", checkQuestionAndAnswerExist, getSingleAnswers);
router.put("/:answer_id/edit", [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], editAnswer);
router.delete(
    "/:answer_id/delete", 
    [checkQuestionAndAnswerExist, 
    getAccessToRoute, 
    getAnswerOwnerAccess], 
    deleteAnswer
    );
router.get(
    "/:answer_id/like", 
    [checkQuestionAndAnswerExist, 
    getAccessToRoute], 
    likeAnswer
    );    
router.get(
    "/:answer_id/undo_like", 
    [checkQuestionAndAnswerExist, 
    getAccessToRoute], 
    undoLikeAnswer
    ); 



module.exports = router;