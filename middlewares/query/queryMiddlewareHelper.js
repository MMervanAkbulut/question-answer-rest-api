const { query } = require("express");

const searchHelper = (searchKey, query, req) => {
// Search
  if(req.query.search){
    const searchObject = {};
    // query by title
    const regex = new RegExp(req.query.search, "i");
    searchObject[searchKey] = regex;
    return query = query.where(searchObject);
  }
  return query;


};

const populateHelper = (query, population) => {
  return query.populate(population);
}

const questionSortHelper = (query, req) => {
  const sortKey = req.query.sortBy;
  if(sortKey === "most-answered"){
    return query = query.sort("-answerCount");
  }
  if(sortKey === "most-liked"){
    return query = query.sort("-likeCount");
  }
  
  return query.sort("-createdAt");

};

const paginationHelper = async (totalDocuments, query, req) => {
  // Pagination
  // Derste pageInt yaptı req.query.page string gelmiş.Ben hata almadım.
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  // atlanacak değerler = mongoose => skip(); limit();
  const startIndex = (page -1) * limit; // 0, 5
  const endIndex = page * limit; // 5, 10
  const total = totalDocuments; // kaç soru var?

  const pagination = {};
  if(startIndex>0){
    pagination.previous = {
      page: page-1,
      limit: limit
    }
  }
  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit: limit
    }
  }

  return {
    // query undefined kontrolünü yapmazsak hata dönecek
    query: query === undefined ? undefined: query.skip(startIndex).limit(limit), 
    pagination: pagination,
    startIndex,
    limit
  }

};

module.exports = {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
};