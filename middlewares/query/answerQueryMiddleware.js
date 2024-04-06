const asyncErrorWrapper = require("express-async-handler");
const { 
    populateHelper,
    paginationHelper
} = require("./queryMiddlewareHelper");


const answerQueryMiddleware = function(model, options) {
    return asyncErrorWrapper(async (req, res, next) => {
        const {id} = req.params;

        const arrayName = "answers";

        const total = (await model.findById(id)["answerCount"]);

        const paginationResult = await paginationHelper(total, undefined, req);

        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;

        // array parçalama, mongodb property slice
        let queryObject = {};
        queryObject[arrayName] = {$slice: [startIndex, limit]};

        let query = model.find({_id: id}, queryObject);
        
        // populate
        query = populateHelper(query, options.population);
        
        
        const queryResults = await query;
        res.queryResults = {
            success: true,
            pagination: paginationResult.pagination,
            data: queryResults
        }
        

        next();
    });
}

module.exports = {answerQueryMiddleware};
