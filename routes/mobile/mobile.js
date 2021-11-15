const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs-extra');
const common = require('../common');
const mysqlconnection = require('../../database/connection');
var gplay = require('google-play-scraper');

// Middlewares
const query_function = require('../main/controllers/middlewares');
const pages = require('./controllers/pages');
const { version } = require('os');

//Functions
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};

router.use((req, res, next) => {
    // const authToken = req.cookies['User Cookie'];
    req.user_filter = [
        {
            state:[],
            city:[],
            district:[]
        }
    ];
    if(req.cookies['City-District Filter'] != undefined){
        req.user_filter = req.cookies['City-District Filter'];
    }
    req.card = [{expanded_card : 'true'}];
    if(req.cookies['Card Filter'] != undefined){
        req.card = req.cookies['Card Filter'];
    }
    // req.user = authTokens[authToken];
    req.user = req.cookies['User Cookie'];
    // req.user =  {
    //     user_id: 2,
    //     full_name: 'Admin'
    // }
    // console.log(req.user_filter);
    next();
});

/* GET home page. */
router.get('/',function(req,res){
    mysqlconnection.query("SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `is_state` = 1 ORDER BY `order`",function(err,categories){
        if(!err){
            // console.log(categories);
            // console.log(sub_category);
                if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
                    if(req.card[0].expanded_card == 'false'){
                        res.redirect('/mobile/main');
                    } else if(req.card[0].expanded_card == 'true') {
                        res.redirect('/mobile/expanded_main');
                    }
                } else {
                    // res.send(req.statesCategories);
                    res.render('main/mobile_screens/index',{
                        StatesCategories:categories
                    });
                }
        } else {
            res.send({'error' : err});
        }
        
    });
});

/* Check Version. */
router.get('/check_version',function(req,res){
    gplay.app({appId: 'com.technotwist.primeapp.prime_app'})
    .then((value) => {
        res.json({version:value.version});
    });
});

/* GET save city. */
router.get('/save_city/:cityname/:statename/:districtname',function(req,res){
    var userFilterState = [];
    var userFilterCity = [];
    var userFilterDistrict = [];
    userFilterCity.push(req.params.cityname);
    userFilterState.push(req.params.statename);
    if(req.params.districtname != 'no_district'){
        userFilterDistrict.push(req.params.districtname);
    }
    var filter = [{
        state:userFilterState,
        city:userFilterCity,
        district:userFilterDistrict
    }];
    res.cookie('City-District Filter', filter,{maxAge:  365*24*60*60*1000});
    res.redirect('/mobile/expanded_main');
});

/* GET main page. */
router.get('/main',query_function.getImpNews,pages.mainpage);

/* GET main page. */
router.get('/search',query_function.getStatesCategories,query_function.getSubCategory,query_function.getSubCategoryDistrict,query_function.getTags,pages.searchpage);

router.get('/search/:folder/:category_name',query_function.getSearchNews,pages.searchresultpage);

/* GET expanded main page. */
router.get('/expanded_main',query_function.getImpNews,pages.expandedmainpage);

/* GET news page. */
router.get('/news',query_function.getSlider,query_function.getNews,pages.homepage);

// Apis of this route
router.get('/api/news/:user_logged_status/:offset',function(req,res){
    var logged_in = req.params.user_logged_status.split('_')[0];
    var user_id = req.params.user_logged_status.split('_')[1];
    if(logged_in == '1'){
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name,`user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ user_id +"') AS news_like FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ req.params.offset +"";
    } else {
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name ,`user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ req.params.offset +"";
    }
    mysqlconnection.query(news,function(err,news){
        if(!err){
            res.json(news);
        }
    });
});

// Apis of this route
router.get('/api/news/:category_name/:user_logged_status/:offset',function(req,res){
    var logged_in = req.params.user_logged_status.split('_')[0];
    var user_id = req.params.user_logged_status.split('_')[1];
    if(logged_in == '1'){
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name,`user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ user_id +"') AS news_like FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`district` = '"+ req.params.category_name +"' ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ req.params.offset +"";
    } else {
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name ,`user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`district` = '"+ req.params.category_name +"'  ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ req.params.offset +"";
    }
    mysqlconnection.query(news,function(err,news){
        if(!err){
            res.json(news);
        }
    });
});

router.get('/api/news/city/:category_name/:user_logged_status/:offset',function(req,res){
    var logged_in = req.params.user_logged_status.split('_')[0];
    var user_id = req.params.user_logged_status.split('_')[1];
    if(logged_in == '1'){
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name,`user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ user_id +"') AS news_like FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`city` = '"+ req.params.category_name +"' ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ req.params.offset +"";
    } else {
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name ,`user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`city` = '"+ req.params.category_name +"'  ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ req.params.offset +"";
    }
    mysqlconnection.query(news,function(err,news){
        if(!err){
            res.json(news);
        }
    });
});

router.get('/api/news/state/:category_name/:user_logged_status/:offset',function(req,res){
    var logged_in = req.params.user_logged_status.split('_')[0];
    var user_id = req.params.user_logged_status.split('_')[1];
    if(logged_in == '1'){
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name,`user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ user_id +"') AS news_like FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`state` = '"+ req.params.category_name +"' ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ req.params.offset +"";
    } else {
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name ,`user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`state` = '"+ req.params.category_name +"'  ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ req.params.offset +"";
    }
    mysqlconnection.query(news,function(err,news){
        if(!err){
            res.json(news);
        }
    });
});


router.get('/news/expanded-card',query_function.getSlider,query_function.getNews,pages.expandedcardpage);

// /* GET Mera seher page. */
// router.get('/news/local', query_function.getAds,query_function.getNoStatesCategories,query_function.getStatesCategories,query_function.getSubCategoryDistrict,query_function.getSlider,query_function.getLogo,query_function.getNews,query_function.getImpNews,pages.citypage);

// /* GET Mera seher page. */
// router.get('/news/expanded-card/local', query_function.getAds,query_function.getNoStatesCategories,query_function.getStatesCategories,query_function.getSubCategoryDistrict,query_function.getSlider,query_function.getLogo,query_function.getNews,query_function.getImpNews,pages.expandedcitypage);


/* GET each categories page. */
router.get('/news/:category_name',query_function.getCategoryNews,pages.categorypage);

/* GET each categories page. */
router.get('/news/city/:category_name',query_function.getCityNews,pages.categorypage);

/* GET each categories page. */
router.get('/news/state/:category_name',query_function.getStateNews,pages.categorypage);

/* GET each categories page. */
router.get('/news/expanded-card/:category_name',query_function.getCategoryNews,pages.expandedcategorypage);

/* GET each categories page. */
router.get('/news/expanded-card/city/:category_name',query_function.getCityNews,pages.expandedcategorypage);

/* GET each categories page. */
router.get('/news/expanded-card/state/:category_name',query_function.getStateNews,pages.expandedcategorypage);

/* GET each news page page. */
router.get('/each-news/:news_id',query_function.getImages,query_function.getVideos,function(req,res){
    if(req.user){
        var logged_in = 1;
        var user_id = req.user.user_id;
        var full_name = req.user.full_name;
        var role_id = req.user.role_id;
    } else {
        var logged_in = 0;
        var user_id = undefined;
        var full_name = undefined;
        var role_id = undefined;
    }
    const news_id = req.params.news_id;
    const eachNews = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` = `users`.`user_id` WHERE `news`.`news_id` = '" + news_id + "'";
    var slider = "SELECT * FROM `slider` WHERE `status` = 1 ORDER BY `order`";
    var final_slider = [];
    mysqlconnection.query(eachNews,function(err,news){
        mysqlconnection.query(slider,function(err,slider){
            if(!err){
                var similiarNews = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` = `users`.`user_id` WHERE `news`.`news_id` <> '" + news_id + "' AND `news`.`city` = '"+ news[0].city +"' AND `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0";
                for(var i = 0;i<slider.length;i++){
                    if(slider[i].city.includes(news[0].city)) {
                        final_slider.push(slider[i]);
                    }
                }
                mysqlconnection.query(similiarNews,function(err,similiarNews){
                    // console.log(err);
                    res.render('main/mobile_screens/each-news',{
                        news:news,
                        images:req.images,
                        videos:req.videos,
                        news2: similiarNews,
                        slider:final_slider,
                        logged_in:logged_in,
                        user_id:user_id,
                        full_name:full_name,
                        title:common.title,
                        imageReplacer:common.imageReplacer,
                        website:common.website,
                        appId:common.appId,
                        class1:common.class1,
                        class2:common.class2,
                        favicon:common.favicon,
                        role_id:role_id
                    });
                    
                });
            }
        });
    });
});

router.get('/getMoreEachNews/:city/:news_id/:offset',function(req,res){
    var offset = req.params.offset;
    var similiarNews = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` = `users`.`user_id` WHERE `news`.`news_id` <> '" + req.params.news_id + "' AND `news`.`city` = '"+ req.params.city +"' AND `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET "+ offset +"";
    mysqlconnection.query(similiarNews,function(err,news){
        res.jsonp(news);
    });
});

/* GET user each news page page. */
router.get('/user-each-news/:news_id',query_function.getImages,query_function.getVideos,function(req,res){
    if(req.user){
        var logged_in = 1;
        var user_id = req.user.user_id;
        var full_name = req.user.full_name;
        var role_id = req.user.role_id;
    } else {
        var logged_in = 0;
        var user_id = undefined;
        var full_name = undefined;
        var role_id = undefined;
    }
    const news_id = req.params.news_id;
    const eachNews = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` = `users`.`user_id` WHERE `news`.`news_id` = '" + news_id + "'";
    var slider = "SELECT * FROM `slider` WHERE `status` = 1 ORDER BY `order`";
    var final_slider = [];
    mysqlconnection.query(eachNews,function(err,news){
        mysqlconnection.query(slider,function(err,slider){
            if(!err){
                var similiarNews = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` = `users`.`user_id` WHERE `news`.`news_id` <> '" + news_id + "' AND `news`.`city` = '"+ news[0].city +"' AND `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0";
                for(var i = 0;i<slider.length;i++){
                    if(slider[i].city.includes(news[0].city)) {
                        final_slider.push(slider[i]);
                    }
                }
                mysqlconnection.query(similiarNews,function(err,similiarNews){
                    console.log(err);
                    res.render('main/mobile_screens/each-news',{
                        news:news,
                        images:req.images,
                        videos:req.videos,
                        news2: similiarNews,
                        slider:final_slider,
                        logged_in:logged_in,
                        user_id:user_id,
                        full_name:full_name,
                        title:common.title,
                        imageReplacer:common.imageReplacer,
                        website:common.website,
                        appId:common.appId,
                        class1:common.class1,
                        class2:common.class2,
                        favicon:common.favicon,
                        role_id:role_id
                    });
                    
                });
            }
        });
    });
});


// Slider Images
router.get('/getSliderImages/:cityname',function(req,res){
    var slider = "SELECT * FROM `slider` WHERE `status` = 1 ORDER BY `order`";
    var final_slider = [];
    var cityname = req.params.cityname;
    mysqlconnection.query(slider,function(err,slider){
        for(var i = 0;i<slider.length;i++){
            if(slider[i].city.includes(cityname)) {
                final_slider.push(slider[i]);
            }
            // var object = JSON.parse(slider[i].city);
            // console.log(object);
            // for(var j = 0;j<object.city.length;j++){
            //     console.log(object.city[j]);
            //     if(object.city[j].includes(cityname)){
            //         console.log('yes');
            //         final_slider.push(slider[i]);
            //         break;
            //     }
            // }
            // if(slider[i].city.toString().includes(req.params.cityname)) {
            //     final_slider.push(slider[i]);
            // }
        }
        // console.log(final_slider);
        res.json(final_slider);
    });
});

// full size ad
router.get('/getFullSizeAd',function(req,res){
    var slider = "SELECT * FROM `ads` WHERE `status` = 1 AND `category` = 'full_size' ORDER BY RAND() LIMIT 1";
    mysqlconnection.query(slider,function(err,slider){
        res.json(slider);
    });
});

// popup ad
router.get('/getPopupAd',function(req,res){
    var slider = "SELECT * FROM `ads` WHERE `status` = 1 AND `category` = 'popup'";
    mysqlconnection.query(slider,function(err,slider){
        res.json(slider);
    });
});

// Imp News
router.get('/getImpNews',function(req,res){
    const impNews = "SELECT `news_id`,`short_description` FROM `news` WHERE `is_approved` = 1 AND `status` = 1 AND `imp` = 1 ORDER By `news_id` DESC LIMIT 10 OFFSET 0";
    var str = '';
    mysqlconnection.query(impNews,function(err,impNews){
        for(var i = 0;i<impNews.length;i++){
            str = str + `   *   ${impNews[i].short_description}`;
        }
        res.json({string:str});
    });
});


//anya seher

router.get('/leftcities', function(req, res) {
    const sub_category = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `sub-categories`.`name` NOT LIKE '%(%' AND `categories`.`is_state` = 1 AND `categories`.`name` = '"+ req.user_filter[0].state[0] +"' AND `sub-categories`.`name` <> '"+ req.user_filter[0].city[0] +"' ORDER BY `sub-categories`.`name`";
    mysqlconnection.query(sub_category,function(err,sub_category){
        res.render('main/mobile_screens/leftcities',{
            sub_category:sub_category,
            title:common.title,
            imageReplacer:common.imageReplacer,
            website:common.website,
            appId:common.appId,
            class1:common.class1,
            class2:common.class2,
            favicon:common.favicon
        });
        
    });
});

router.get('/leftcities/:state/:city', function(req, res) {
    const sub_category = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `sub-categories`.`name` NOT LIKE '%(%' AND `categories`.`is_state` = 1 AND `categories`.`name` = '"+ req.params.state +"' AND `sub-categories`.`name` <> '"+ req.params.city +"' ORDER BY `sub-categories`.`name`";
    mysqlconnection.query(sub_category,function(err,sub_category){
        res.render('main/mobile_screens/leftcities',{
            sub_category:sub_category,
            title:common.title,
            imageReplacer:common.imageReplacer,
            website:common.website,
            appId:common.appId,
            class1:common.class1,
            class2:common.class2,
            favicon:common.favicon
        });
        
    });
});

// needs to be redone

router.get('/epaper', function(req, res) {
    if(req.user){
        var logged_in = 1;
        var role_id = req.user.role_id;
    } else {
        var logged_in = 0;
        var role_id = undefined;
    }
    var sql4 = "SELECT `id` FROM `e-paper` WHERE `status` = 1 ORDER BY `created_at` DESC";
    var sql3 = "SELECT * FROM `epaper-category` WHERE `status` = 1 ORDER BY `id` DESC";
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    mysqlconnection.query(sql3,function(err,epaperCategory){
        mysqlconnection.query(sql8,function(err,logo){
            mysqlconnection.query(sql4,function(err,epaper){
                if(epaper != undefined){
                    res.render('main/mobile_screens/epaper',{
                        epaperCategory:epaperCategory,
                        logo:logo,
                        epaper:epaper,
                        logged_in:logged_in,
                        title:common.title,
                        imageReplacer:common.imageReplacer,
                        website:common.website,
                        appId:common.appId,
                        class1:common.class1,
                        class2:common.class2,
                        favicon:common.favicon,
                        card:req.card[0].expanded_card,
                        role_id:role_id
                    });
                } else {
                    res.send('Database Not connected');
                }
                
            });
        });
    });
});

router.get('/contact-us', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
    } else {
        var logged_in = 0;
    }

    res.render('main/mobile_screens/contact-us',{
        logged_in:logged_in,
        title:common.title,
        imageReplacer:common.imageReplacer,
        website:common.website,
        appId:common.appId,
        class1:common.class1,
        class2:common.class2,
        favicon:common.favicon
    });
});

router.get('/videos', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
        var user_id = req.user.user_id;
        var full_name = req.user.full_name;
        var role_id = req.user.role_id;
        var sql3 = "SELECT `videos`.*,`news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 3 OFFSET 0";
    } else {
        var logged_in = 0;
        var user_id = undefined;
        var full_name = undefined;
        var role_id = undefined;
        var sql3 = "SELECT `videos`.*,`news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 3 OFFSET 0";
    }
    
    // var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    mysqlconnection.query(sql3,function(err,videos){
        // mysqlconnection.query(sql8,function(err,logo){
            if(videos != undefined){
                res.render('main/mobile_screens/videos',{
                    videos:videos,
                    // logo:logo,
                    logged_in:logged_in,
                    user_id:user_id,
                    full_name:full_name,
                    title:common.title,
                    imageReplacer:common.imageReplacer,
                    website:common.website,
                    appId:common.appId,
                    class1:common.class1,
                    class2:common.class2,
                    favicon:common.favicon,
                    card:req.card[0].expanded_card,
                    role_id:role_id
                });
            } else {
                res.send('Database Not connected');
            }
            
        // });
    });
});

// Add news
router.get('/add-news',function(req,res){
    if(req.user){
        var logged_in = 1;
        var user = req.user;
        var role_id = req.user.role_id;

        var tags = "SELECT * FROM `tags` WHERE `status` = 1";
        mysqlconnection.query(tags,function(err,tags){
            res.render('main/mobile_screens/add-news',{
                user_filter:req.user_filter,
                logged_in:logged_in,
                user:user,
                title:common.title,
                imageReplacer:common.imageReplacer,
                website:common.website,
                appId:common.appId,
                class1:common.class1,
                class2:common.class2,
                favicon:common.favicon,
                tags:tags,
                card:req.card[0].expanded_card,
                role_id:role_id,
                statename:'',
                cityname:'',
                districtname:'',
            });
            
        });
    } else {
        // var logged_in = 0;
        // var user = undefined;
        // var role_id = undefined;
        res.redirect('/mobile/profile/notloggedIn');
    }
});

// Add news
router.get('/add-news/:statename/:cityname/:districtname',function(req,res){
    if(req.user){
        var logged_in = 1;
        var user = req.user;
        var role_id = req.user.role_id;

        var tags = "SELECT * FROM `tags` WHERE `status` = 1";
        mysqlconnection.query(tags,function(err,tags){
            res.render('main/mobile_screens/add-news',{
                user_filter:req.user_filter,
                logged_in:logged_in,
                user:user,
                title:common.title,
                imageReplacer:common.imageReplacer,
                website:common.website,
                appId:common.appId,
                class1:common.class1,
                class2:common.class2,
                favicon:common.favicon,
                tags:tags,
                card:req.card[0].expanded_card,
                role_id:role_id,
                statename:req.params.statename,
                cityname:req.params.cityname,
                districtname:req.params.districtname,
            });
            
        });
    } else {
        // var logged_in = 0;
        // var user = undefined;
        // var role_id = undefined;
        res.redirect('/mobile/profile/notloggedIn');
    }
});

router.get('/privacy-policy', function(req, res, next) {
    res.render('main/mobile_screens/privacy_policy');
});

// post Add news
router.post('/add-news',function(req,res){
    var image = [];
    image = req.body.images.split(',');
    if(req.body.images.split(',')[0] != ''){
        var sql6 = "INSERT INTO `news` (`user_id`,`short_description`,`state`,`city`,`district`,`description`,`front_image_path`,`created_at`,`tags`) VALUES ('" + req.user.user_id + "','" + req.body.title + "','" + req.body.state + "','" + req.body.city + "','" + req.body.district + "','" + req.body.desc + "','" + image[0] + "',CURRENT_TIMESTAMP,'"+ req.body.tag +"')";
        mysqlconnection.query(sql6,function(err,data){
            console.log(err);
            if(!err){
                for(var i = 0 ;i<image.length;i++){
                    var sql = "INSERT INTO `images` (`news_id`,`path`) VALUES ('" + data.insertId + "','" + image[i] + "')";
                    mysqlconnection.query(sql,function(err,img){
                        console.log(err);
                    });
                }
            }
        });
    } else if(image[0] == []){
        var sql6 = "INSERT INTO `news` (`user_id`,`short_description`,`state`,`city`,`district`,`description`,`created_at`,`tags`) VALUES ('" + req.user.user_id + "','" + req.body.title + "','" + req.body.state + "','" + req.body.city + "','" + req.body.district + "','" + req.body.desc + "',CURRENT_TIMESTAMP,'"+ req.body.tag +"')";
        mysqlconnection.query(sql6,function(err,data){
            console.log(err);
        });
    }
    res.jsonp('success');
    
});
router.post('/save-images',function(req,res){
    var a = [];
    var name = [];
    // console.log(req.files);
    if(req.files != null){
        a = Object.values(req.files);
        for(var i = 0 ;i<a.length;i++){
            var Images = a[i];
            var new_date = new Date();
            var new_name = new_date.getTime() + '_user_news.png';
            a[i].name = new_name;
            var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "";
            var path1 = 'public/images/image_files/' + imageFiles;
            Images.mv(path1, function(err){
                if(err){
                    return console.log(err);
                }
            });
            name.push(new_name);
        }
    }
    res.jsonp(name);
});

//logout
router.get('/logout', function(req, res, next) {
    res.clearCookie('User Cookie');
    res.redirect('/mobile/');
});

//pdf
router.get('/pdf/:epaper_id', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
    } else {
        var logged_in = 0;
    }
    var epaper_id = req.params.epaper_id;
    var sql3 = "SELECT * FROM `epaper_images` WHERE `epaper_id` = '"+epaper_id+"'";
    var sql4 = "SELECT * FROM `e-paper` WHERE `id` = '"+ epaper_id +"'";
    mysqlconnection.query(sql3,function(err,epaper){
        mysqlconnection.query(sql4,function(err,epaper_views){
            if(epaper != undefined){
                // console.log(epaper);
                res.render('main/mobile_screens/pdf',{
                    epaper:epaper,
                    // logo:logo,
                    logged_in:logged_in,
                    title:common.title,
                    imageReplacer:common.imageReplacer,
                    website:common.website,
                    appId:common.appId,
                    class1:common.class1,
                    class2:common.class2,
                    favicon:common.favicon,
                    epaper_views:epaper_views
                });
            } else {
                res.send('Database Not connected');
            }
            
        });
    });
});

/* Api's */ 

// Likes
router.get('/like/:news_id',function(req,res){
    var news_id = req.params.news_id;
    // console.log(news_id);
    var user_id = req.user.user_id;
    var like = "SELECT * FROM `likes` WHERE `user_id` = '"+ user_id +"' AND `news_id` = '"+ news_id +"'";
    mysqlconnection.query(like,function(err,like){
        console.log(err);
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

router.get('/like/:news_id/:user_id',function(req,res){
    var news_id = req.params.news_id;
    // console.log(news_id);
    var user_id = req.params.user_id;
    var like = "SELECT * FROM `likes` WHERE `user_id` = '"+ user_id +"' AND `news_id` = '"+ news_id +"'";
    mysqlconnection.query(like,function(err,like){
        console.log(err);
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

// Follow
router.get('/follow/:user_id',function(req,res){
    var user_id = req.params.user_id;
    var follower_id = req.user.user_id;
    var follow = "INSERT INTO `follow` (`user_id`,`follower_id`) VALUES ('"+ user_id +"','"+ follower_id +"')";
    mysqlconnection.query(follow,function(err,follow){
        res.jsonp({message:'success'});
        
    });
});

// Unfollow
router.get('/unfollow/:user_id',function(req,res){
    var user_id = req.params.user_id;
    var follower_id = req.user.user_id;
    var follow = "DELETE FROM `follow` WHERE `user_id` = '"+ user_id +"' AND `follower_id` = '"+ follower_id +"'";
    mysqlconnection.query(follow,function(err,follow){
        res.jsonp({message:'success'});
        
    });
});

// Comments
router.get('/getComments/:news_id',function(req,res){
    var news_id = req.params.news_id;
    var comment = "SELECT `comments`.*,`users`.`full_name` FROM `comments` INNER JOIN `users` ON `users`.`user_id` = `comments`.`user_id` WHERE `news_id` = '"+ news_id +"'";
    mysqlconnection.query(comment,function(err,comment){
        res.json(comment);
        
    });
});

// Add Comment
router.post('/addComment/',function(req,res){
    var user_id = req.user.user_id;
    var data = req.body;
    var add_comment = "INSERT INTO `comments` (`user_id`,`news_id`,`message`) VALUES ('"+ user_id +"','"+ data.news_id +"','"+ data.message +"')";
    mysqlconnection.query(add_comment,function(err,add_comment){
        res.jsonp(add_comment);
        
    });
});

// Add Comment
router.post('/addComment/:news_id/:user_id',function(req,res){
    var user_id = req.params.user_id;
    var data = req.body;
    var add_comment = "INSERT INTO `comments` (`user_id`,`news_id`,`message`) VALUES ('"+ user_id +"','"+ req.params.news_id +"','"+ data.message +"')";
    mysqlconnection.query(add_comment,function(err,add_comment){
        res.json({message :'success'});
        
    });
});

router.get('/getMoreNews/:offset',function(req,res){
    var offset = req.params.offset;
    if(req.user){
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name,`user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +";";
    } else {
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name ,`user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
    }
    mysqlconnection.query(news,function(err,news){
        res.jsonp(news);
        
    });
});


router.get('/getMoreUserNews/:user_id/:offset',function(req,res){
    var offset = req.params.offset;
    var user_id = req.params.user_id;
    var news = "SELECT `news`.*,`users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`status` = 1 AND `news`.`user_id` = '"+ user_id +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET "+ offset +"";
    mysqlconnection.query(news,function(err,news){
        res.jsonp(news);
        
    });
});

router.get('/getStates',function(req,res){
    var state = req.params.state;
    const sub_category = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `is_state` = 1 ORDER BY `order`";
    var names = [];
    mysqlconnection.query(sub_category,function(err,sub_category){
        for(var i=0;i<sub_category.length;i++){
            names.push(sub_category[i].name);
        }
        res.json(names);
    });
});

router.get('/getDistrict/:state',function(req,res){
    var state = req.params.state;
    var names = [];
    const sub_category = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `sub-categories`.`name` NOT LIKE '%(%' AND `categories`.`is_state` = 1 AND `categories`.`name` = '"+ state +"' ORDER BY `sub-categories`.`name`";
    mysqlconnection.query(sub_category,function(err,sub_category){
        for(var i=0;i<sub_category.length;i++){
            names.push(sub_category[i].name);
        }
        res.json(names);
    });
});

router.get('/getCitySearch/:statename/:state',function(req,res){
    var statename = req.params.statename;
    var state = req.params.state;
    var names = [];
    const sub_category = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `sub-categories`.`name` LIKE '"+ ( '%' + statename + '%' ) +"' AND `sub-categories`.`name` NOT LIKE '%(%' AND `categories`.`is_state` = 1 AND `categories`.`name` = '"+ state +"' ORDER BY `sub-categories`.`name`";
    mysqlconnection.query(sub_category,function(err,sub_category){
        for(var i=0;i<sub_category.length;i++){
            names.push(sub_category[i].name);
        }
        res.json(names);
    });
});

router.get('/getSubDistrict/:city',function(req,res){
    var city = req.params.city;
    var names = [];
    const sub_category = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `name` LIKE '%"+ ('(' + city + ')') +"%' ORDER BY `name`";
    mysqlconnection.query(sub_category,function(err,sub_category){
        for(var i=0;i<sub_category.length;i++){
            names.push(sub_category[i].name);
        }
        res.json(names);
    });
});

router.get('/save_city_mobile/:cityname/:statename/:districtname',function(req,res){
    // console.log(req.params.cityname);
    // console.log(req.params.statename);
    // console.log(req.params.districtname);
    if(req.params.cityname.length !=0 && req.params.statename.length !=0 && req.params.districtname !=0){
        var userFilterState = [];
        var userFilterCity = [];
        var userFilterDistrict = [];
        userFilterCity.push(req.params.cityname);
        userFilterState.push(req.params.statename);
        if(req.params.districtname != 'no_district'){
            userFilterDistrict.push(req.params.districtname);
        }
        var filter = [{
            state:userFilterState,
            city:userFilterCity,
            district:userFilterDistrict
        }];
        res.cookie('City-District Filter', filter,{maxAge:  365*24*60*60*1000});
        res.json({message:'success'});
    } else {
        res.json({message:'failed'});
    }
});

router.get('/getDistrictSearch/:districtname/:city',function(req,res){
    var city = req.params.city;
    var districtname = req.params.districtname;
    var names = [];
    const sub_category = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `name` LIKE '%"+ ('(' + city + ')') +"%' AND `name` LIKE '%"+ ( districtname ) +"%'  ORDER BY `name`";
    mysqlconnection.query(sub_category,function(err,sub_category){
        for(var i=0;i<sub_category.length;i++){
            names.push(sub_category[i].name);
        }
        res.json(names);
    });
});

router.get('/getMoreCategoryNews/:category_name/:getData/:offset',function(req,res){
    var offset = req.params.offset;
    var getData = req.params.getData;

    if(getData == 'district'){
        if(req.user){
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`district` = '"+ req.params.category_name +"' ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +";";
        } else {
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`district` = '"+ req.params.category_name +"' ORDER By `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
        }
    } else if(getData == 'city') {
        if(req.user){
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`city` = '"+ req.params.category_name +"' ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +";";
        } else {
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`city` = '"+ req.params.category_name +"' ORDER By `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
        }
    } else if(getData == 'state') {
        if(req.user){
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`state` = '"+ req.params.category_name +"' ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +";";
        } else {
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`state` = '"+ req.params.category_name +"' ORDER By `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
        }
    } else if(getData == 'tags') {
        if(req.user){
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`tags` = '"+ req.params.category_name +"' ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +";";
        } else {
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`tags` = '"+ req.params.category_name +"' ORDER By `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
        }
    } else {
        if(req.user){
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`tags` = '"+ req.params.category_name +"' AND `news`.`district` = '"+ getData +"' ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +";";
        } else {
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`tags` = '"+ req.params.category_name +"' AND `news`.`district` = '"+ getData +"' ORDER By `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
        }
    }
    mysqlconnection.query(news,function(err,news){
        res.jsonp(news);
        
    });
});

router.get('/getEpaper/:id', function(req, res, next) {
    var epaper_id = req.params.id;
    var sql = "SELECT `e-paper`.* , `epaper_images`.`path` ,`epaper-category`.`id` AS category FROM `e-paper` INNER JOIN `epaper_images` ON `epaper_images`.`epaper_id` = `e-paper`.`id` INNER JOIN `epaper-category` ON `epaper-category`.`name` = `e-paper`.`category` WHERE `e-paper`.`id` = '"+epaper_id+"' ORDER BY `e-paper`.`created_at` DESC LIMIT 1";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
        
    });
});

router.get('/increaseEpaperCount/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `e-paper` SET `views` = `views` + 1 WHERE `id` = '"+news_id+"'";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getVideos/:offset', function(req, res, next) {
    var o = req.params.offset;
    if(req.user){
        var sql3 = "SELECT `videos`.*,`news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 1 OFFSET "+o+"";
    } else {
        var sql3 = "SELECT `videos`.*,`news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 1 OFFSET "+o+"";
    }
    mysqlconnection.query(sql3,function(err,videos){
        res.jsonp(videos);
        
    });
});


//Login
router.get('/profile', function(req, res, next) {
    // var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    if(req.user){
        var logged_in = 1;
        var role_id = req.user.role_id;
        var sql2 = "SELECT * FROM `users` WHERE `user_id` = '"+req.user.user_id+"'";
        var sql3 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+req.user.user_id+"'";
        var posts = "SELECT `news`.*,`users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`status` = 1 AND `news`.`user_id` = '"+ req.user.user_id +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0";
        var total_posts = "SELECT COUNT(*) AS total FROM `news` WHERE `user_id` = '"+ req.user.user_id +"' AND `status` = 1 ";
        var total_followers = "SELECT COUNT(*) AS count FROM `follow` WHERE `user_id` = '"+req.user.user_id+"'";
        var total_following = "SELECT COUNT(*) AS count FROM `follow` WHERE `follower_id` = '"+req.user.user_id+"'";
        mysqlconnection.query(total_followers,function(err,total_followers){
            mysqlconnection.query(total_following,function(err,total_following){
                mysqlconnection.query(sql2,function(err,users){
                    mysqlconnection.query(sql3,function(err,user_profile){
                        mysqlconnection.query(posts,function(err,posts){
                            mysqlconnection.query(total_posts,function(err,total_posts){
                                res.render('main/mobile_screens/profile',{
                                    // logo:logo,
                                    logged_in:logged_in,
                                    user:users,
                                    user_profile:user_profile,
                                    news2:posts,
                                    title:common.title,
                                    imageReplacer:common.imageReplacer,
                                    website:common.website,
                                    appId:common.appId,
                                    class1:common.class1,
                                    class2:common.class2,
                                    favicon:common.favicon,
                                    user_face:'self',
                                    total_posts:total_posts,
                                    card:req.card[0].expanded_card,
                                    user_id: req.user.user_id,
                                    role_id:role_id,
                                    total_followers:total_followers[0].count,
                                    total_following:total_following[0].count,
                                    statename:req.query.statename,
                                    cityname:req.query.cityname,
                                    districtname:req.query.districtname,
                                });
                            });   
                        });
                    }); 
                });
            });
        });
    } else {
        var logged_in = 0;
        var role_id = undefined;
        // if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
            
        // } else {
        //     res.redirect('/mobile/');
        // }
        res.render('main/mobile_screens/profile',{
            // logo:logo,
            logged_in:logged_in,
            user:[],
            user_profile:[],
            news2:[],
            title:common.title,
            imageReplacer:common.imageReplacer,
            website:common.website,
            appId:common.appId,
            class1:common.class1,
            class2:common.class2,
            favicon:common.favicon,
            user_face:'self',
            card:req.card[0].expanded_card,
            user_id: '',
            role_id:role_id,
            total_followers:0,
            total_following:0,
            statename:req.query.statename,
            cityname:req.query.cityname,
            districtname:req.query.districtname,
        });
    }
});

router.get('/userNotLoggedIn', function(req, res, next) {
    // var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    console.log('state name' +req.query.statename);
    var logged_in = 0;
        var role_id = undefined;
        // if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
            
        // } else {
        //     res.redirect('/mobile/');
        // }
        res.render('main/mobile_screens/profile',{
            // logo:logo,
            logged_in:logged_in,
            user:[],
            user_profile:[],
            news2:[],
            title:common.title,
            imageReplacer:common.imageReplacer,
            website:common.website,
            appId:common.appId,
            class1:common.class1,
            class2:common.class2,
            favicon:common.favicon,
            user_face:'self',
            card:req.card[0].expanded_card,
            user_id: '',
            role_id:role_id,
            total_followers:0,
            total_following:0,
            statename:req.query.statename,
            cityname:req.query.cityname,
            districtname:req.query.districtname,
        });
});

router.get('/profile/notloggedIn', function(req, res, next) {
    // var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    if(req.user){
        var logged_in = req.params.loggedIn;
        var role_id = req.user.role_id;
        var sql2 = "SELECT * FROM `users` WHERE `user_id` = '"+req.user.user_id+"'";
        var sql3 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+req.user.user_id+"'";
        var posts = "SELECT `news`.*,`users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`status` = 1 AND `news`.`user_id` = '"+ req.user.user_id +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0";
        var total_posts = "SELECT COUNT(*) AS total FROM `news` WHERE `user_id` = '"+ req.user.user_id +"' AND `status` = 1 ";
        var total_followers = "SELECT COUNT(*) AS count FROM `follow` WHERE `user_id` = '"+req.user.user_id+"'";
        var total_following = "SELECT COUNT(*) AS count FROM `follow` WHERE `follower_id` = '"+req.user.user_id+"'";
        mysqlconnection.query(total_followers,function(err,total_followers){
            mysqlconnection.query(total_following,function(err,total_following){
                mysqlconnection.query(sql2,function(err,users){
                    mysqlconnection.query(sql3,function(err,user_profile){
                        mysqlconnection.query(posts,function(err,posts){
                            mysqlconnection.query(total_posts,function(err,total_posts){
                                res.render('main/mobile_screens/profile',{
                                    // logo:logo,
                                    logged_in:logged_in,
                                    user:users,
                                    user_profile:user_profile,
                                    news2:posts,
                                    title:common.title,
                                    imageReplacer:common.imageReplacer,
                                    website:common.website,
                                    appId:common.appId,
                                    class1:common.class1,
                                    class2:common.class2,
                                    favicon:common.favicon,
                                    user_face:'self',
                                    total_posts:total_posts,
                                    card:req.card[0].expanded_card,
                                    user_id: req.user.user_id,
                                    role_id:role_id,
                                    total_followers:total_followers[0].count,
                                    total_following:total_following[0].count,
                                    statename:'',
                                    cityname:'',
                                    districtname:'',
                                });
                            });   
                        });
                    }); 
                });
            });
        });
    } else {
        var logged_in = 0;
        var role_id = undefined;
        // if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
            
        // } else {
        //     res.redirect('/mobile/');
        // }
        res.render('main/mobile_screens/profile',{
            // logo:logo,
            logged_in:logged_in,
            user:[],
            user_profile:[],
            news2:[],
            title:common.title,
            imageReplacer:common.imageReplacer,
            website:common.website,
            appId:common.appId,
            class1:common.class1,
            class2:common.class2,
            favicon:common.favicon,
            user_face:'self',
            card:req.card[0].expanded_card,
            user_id: '',
            role_id:role_id,
            total_followers:0,
            total_following:0,
            statename:'',
            cityname:'',
            districtname:'',
        });
    }
});

router.get('/profile/loggedIn/:user_id', function(req, res, next) {
    // var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    var logged_in = 1;
        var role_id = req.user.role_id;
        var sql2 = "SELECT * FROM `users` WHERE `user_id` = '"+req.params.user_id+"'";
        var sql3 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+req.params.user_id+"'";
        var posts = "SELECT `news`.*,`users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`status` = 1 AND `news`.`user_id` = '"+ req.params.user_id +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0";
        var total_posts = "SELECT COUNT(*) AS total FROM `news` WHERE `user_id` = '"+ req.params.user_id +"' AND `status` = 1 ";
        var total_followers = "SELECT COUNT(*) AS count FROM `follow` WHERE `user_id` = '"+req.params.user_id+"'";
        var total_following = "SELECT COUNT(*) AS count FROM `follow` WHERE `follower_id` = '"+req.params.user_id+"'";
        mysqlconnection.query(total_followers,function(err,total_followers){
            mysqlconnection.query(total_following,function(err,total_following){
                mysqlconnection.query(sql2,function(err,users){
                    mysqlconnection.query(sql3,function(err,user_profile){
                        mysqlconnection.query(posts,function(err,posts){
                            mysqlconnection.query(total_posts,function(err,total_posts){
                                res.render('main/mobile_screens/profile',{
                                    // logo:logo,
                                    logged_in:logged_in,
                                    user:users,
                                    user_profile:user_profile,
                                    news2:posts,
                                    title:common.title,
                                    imageReplacer:common.imageReplacer,
                                    website:common.website,
                                    appId:common.appId,
                                    class1:common.class1,
                                    class2:common.class2,
                                    favicon:common.favicon,
                                    user_face:'self',
                                    total_posts:total_posts,
                                    card:req.card[0].expanded_card,
                                    user_id: req.user.user_id,
                                    role_id:role_id,
                                    total_followers:total_followers[0].count,
                                    total_following:total_following[0].count,
                                    statename:users[0].state,
                                    cityname:users[0].city,
                                    districtname:users[0].district,
                                });
                            });   
                        });
                    }); 
                });
            });
        });
});

router.get('/user-profile/:user_id', function(req, res, next) {
    // var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    if(req.user){
        var logged_in = 1;
        var role_id = req.user.role_id;
        if(req.user.user_id == req.params.user_id){
            res.redirect('/mobile/profile');
        } else {
            var total_followers = "SELECT COUNT(*) AS count FROM `follow` WHERE `user_id` = '"+req.params.user_id+"'";
            var total_following = "SELECT COUNT(*) AS count FROM `follow` WHERE `follower_id` = '"+req.params.user_id+"'";
            var sql2 = "SELECT * FROM `users` WHERE `user_id` = '"+req.params.user_id+"'";
            var follow = "SELECT * FROM `follow` WHERE `user_id` = '"+req.params.user_id+"' AND `follower_id` = '"+req.user.user_id+"'";
            var sql3 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+req.params.user_id+"'";
            var posts = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 AND `news`.`user_id` = '"+ req.params.user_id +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0";
            var total_posts = "SELECT COUNT(*) AS total FROM `news` WHERE `user_id` = '"+ req.params.user_id +"' AND `is_approved` = 1 AND `status` = 1 ";
            mysqlconnection.query(total_followers,function(err,total_followers){
                mysqlconnection.query(total_following,function(err,total_following){
                    mysqlconnection.query(follow,function(err,follow){
                        mysqlconnection.query(sql2,function(err,users){
                            mysqlconnection.query(sql3,function(err,user_profile){
                                mysqlconnection.query(posts,function(err,posts){
                                    mysqlconnection.query(total_posts,function(err,total_posts){
                                        res.render('main/mobile_screens/userprofile',{
                                            // logo:logo,
                                            logged_in:logged_in,
                                            user:users,
                                            user_profile:user_profile,
                                            news2:posts,
                                            title:common.title,
                                            imageReplacer:common.imageReplacer,
                                            website:common.website,
                                            appId:common.appId,
                                            class1:common.class1,
                                            class2:common.class2,
                                            favicon:common.favicon,
                                            user_face:'other',
                                            total_posts:total_posts,
                                            card:req.card[0].expanded_card,
                                            user_id: req.params.user_id,
                                            follow:follow,
                                            total_followers:total_followers[0].count,
                                            total_following:total_following[0].count
                                        });
                                        
                                    });   
                                });
                            }); 
                        });
                    });
                });
            });
        }
    } else {
        var logged_in = 0;
        var role_id = undefined;
        var total_followers = "SELECT COUNT(*) AS count FROM `follow` WHERE `user_id` = '"+req.params.user_id+"'";
            var total_following = "SELECT COUNT(*) AS count FROM `follow` WHERE `follower_id` = '"+req.params.user_id+"'";
            var sql2 = "SELECT * FROM `users` WHERE `user_id` = '"+req.params.user_id+"'";
            // var follow = "SELECT * FROM `follow` WHERE `user_id` = '"+req.params.user_id+"' AND `follower_id` = '"+req.user.user_id+"'";
            var sql3 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+req.params.user_id+"'";
            var posts = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 AND `news`.`user_id` = '"+ req.params.user_id +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0";
            var total_posts = "SELECT COUNT(*) AS total FROM `news` WHERE `user_id` = '"+ req.params.user_id +"' AND `is_approved` = 1 AND `status` = 1 ";
            mysqlconnection.query(total_followers,function(err,total_followers){
                mysqlconnection.query(total_following,function(err,total_following){
                    mysqlconnection.query(follow,function(err,follow){
                        mysqlconnection.query(sql2,function(err,users){
                            mysqlconnection.query(sql3,function(err,user_profile){
                                mysqlconnection.query(posts,function(err,posts){
                                    mysqlconnection.query(total_posts,function(err,total_posts){
                                        res.render('main/mobile_screens/userprofile',{
                                            // logo:logo,
                                            logged_in:logged_in,
                                            user:users,
                                            user_profile:user_profile,
                                            news2:posts,
                                            title:common.title,
                                            imageReplacer:common.imageReplacer,
                                            website:common.website,
                                            appId:common.appId,
                                            class1:common.class1,
                                            class2:common.class2,
                                            favicon:common.favicon,
                                            user_face:'other',
                                            total_posts:total_posts,
                                            card:req.card[0].expanded_card,
                                            user_id: req.params.user_id,
                                            follow:[],
                                            total_followers:total_followers[0].count,
                                            total_following:total_following[0].count
                                        });
                                        
                                    });   
                                });
                            }); 
                        });
                    });
                });
            });
    }
});

router.post('/user-login', function(req, res, next) {
    var state = req.body.statename;
    var city = req.body.cityname;
    var districtname = req.body.districtname;
    var phone = req.body.phone;
    var tokken = req.body.tokken;
    var full_name = req.body.full_name;
    var is_approved = 1;
    var user_data;
    var sql = "SELECT * FROM `users` WHERE phone = '" + phone + "' AND status = 1 AND role_id = 4 AND password = '" + tokken + "'";
    mysqlconnection.query(sql,function(err,data){
        if(data.length != 0){
            var sql7 = "UPDATE `users` SET `name` = '" + full_name + "',`full_name` = '" + full_name + "',`city` = '"+city+"',`state` = '"+state+"',`district` = '"+ districtname +"' WHERE phone = '" + phone + "' AND status = 1 AND role_id = 4 AND password = '" + tokken + "'";
            mysqlconnection.query(sql7,function(err,users1){
                // console.log(users1);
            });
            var user_profile = "SELECT * FROM `user_profile` WHERE `user_id` = '"+ data[0].user_id +"'";
            mysqlconnection.query(user_profile,function(err,user_profile){
                // console.log(users1);
                if(user_profile.length == 0){
                    var sql9 = "INSERT INTO `user_profile` (`user_id`) VALUES ('" + data[0].user_id + "')";
                    mysqlconnection.query(sql9,function(err,sql9){
                        // console.log(users1);
                    });
                }
            });
            user_data = {
                password:tokken,
                phone:phone,
                user_id:data[0].user_id,
                full_name:full_name,
                city:city,
                state:state,
                role_id:'4'
            }
            res.cookie('User Cookie', user_data,{maxAge:  365*24*60*60*1000});
            res.jsonp({message:'success',user_data:user_data});
        }else {
            var sql6 = "INSERT INTO `users` (`name`,`full_name`,`password`,`is_approved`,`phone`,`role_id`,`city`,`state`,`district`) VALUES ('" + full_name + "','" + full_name + "','" + tokken + "','" + is_approved + "','" + phone + "',4,'"+city+"','"+state+"','"+ districtname +"')";
            mysqlconnection.query(sql6,function(err,users){
                if(!err){
                    user_data = {
                        password:tokken,
                        phone:phone,
                        user_id:users.insertId,
                        full_name:full_name,
                        city:city,
                        state:state,
                        role_id:'4'
                    }
                    var sql9 = "INSERT INTO `user_profile` (`user_id`) VALUES ('" + users.insertId + "')";
                    mysqlconnection.query(sql9,function(err,sql9){
                        // console.log(users1);
                    });
                    const authToken = generateAuthToken();
                    // Store authentication token
                    authTokens[authToken] = user_data;

                    // Setting the auth token in cookies
                    res.cookie('User Cookie', user_data,{maxAge:  365*24*60*60*1000});
                    res.jsonp({message:'success',user_data:user_data});
                }
            });
        }
        
    });
});

module.exports = router;
