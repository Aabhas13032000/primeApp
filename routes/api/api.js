const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs-extra');
const common = require('../common');
const mysqlconnection = require('../../database/connection');

// Middlewares
const query_function = require('../main/controllers/middlewares');
const pages = require('./controllers/pages');
const { getNews } = require('../main/controllers/middlewares');

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
    req.user = authTokens[authToken];
    req.user =  {
        user_id: 2,
        name: 'admin'
    }
    next();
});

/* GET home page. */
router.get('/', query_function.getAds,query_function.getNoStatesCategories,query_function.getStatesCategories,query_function.getSubCategoryDistrict,query_function.getSlider,query_function.getLogo,query_function.getNews,query_function.getImpNews,pages.homepage);

router.get('/expanded-card', query_function.getAds,query_function.getNoStatesCategories,query_function.getStatesCategories,query_function.getSubCategoryDistrict,query_function.getSlider,query_function.getLogo,query_function.getNews,query_function.getImpNews,pages.expandedcardpage);

/* GET each categories page. */
router.get('/:category_name', query_function.getAds,query_function.getNoStatesCategories,query_function.getStatesCategories,query_function.getSubCategoryDistrict,query_function.getSlider,query_function.getLogo,query_function.getCategoryNews,query_function.getImpNews,pages.categorypage);

/* GET Mera seher page. */
router.get('/local', query_function.getAds,query_function.getNoStatesCategories,query_function.getStatesCategories,query_function.getSubCategoryDistrict,query_function.getSlider,query_function.getLogo,query_function.getCategoryNews,query_function.getImpNews,pages.citypage);

/* GET each news page page. */
router.get('/each-news/:news_id', query_function.getEachNews,query_function.getImages,query_function.getVideos,query_function.getNoStatesCategories,query_function.getSlider,query_function.getLogo,pages.eachNewspage);

router.get('/like/:news_id',function(req,res){
    var news_id = req.params.news_id;
    var user_id = req.user.user_id;
    var like = "SELECT * FROM `likes` WHERE `user_id` = '"+ user_id +"' AND `news_id` = '"+ news_id +"'";
    mysqlconnection.query(like,function(err,like){
        if(like.length == 0){
            var submitLike = "INSERT INTO `likes` (`user_id`,`news_id`) VALUES ('"+ user_id +"','"+ news_id +"')";
            mysqlconnection.query(submitLike,function(err,submitLike){
                
            });
        } else {
            var deleteLike = "DELETE FROM `likes` WHERE `like_id` = '"+ like[0].like_id +"'";
            mysqlconnection.query(deleteLike,function(err,deleteLike){
                
            });
        }
        res.jsonp({message:'success'});
    });
});

module.exports = router;
