const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs-extra');
const common = require('../common');

// Middlewares
const query_function = require('./controllers/middlewares');
const pages = require('./controllers/render');

//Functions
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};

router.use((req, res, next) => {
    const authToken = req.cookies['AuthToken'];
    req.user_filter = [{state:[],city:[],district:[]}];
    if(req.cookies['Updated User Filter With District1'] != undefined){
        req.user_filter = req.cookies['Updated User Filter With District1'];
    }
    // req.user = authTokens[authToken];
    req.user = {
        name: 'Aabhas',
        user_id: 1
    }
    next();
});

/* GET home page. */
router.get('/', function(req,res){
    res.redirect('/mobile/')
});

/* GET home page. */
// router.get('/each-news/:news_id', query_function.getEachNews,query_function.getImages,query_function.getVideos,query_function.getNoStatesCategories,query_function.getSlider,query_function.getLogo,pages.eachNewspage);

module.exports = router;
