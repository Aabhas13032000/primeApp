const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs-extra');
const common = require('../common');
const mysqlconnection = require('../../database/connection');

// Middlewares
const query_function = require('../main/controllers/middlewares');
const pages = require('./controllers/pages');

//Functions
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};

router.use((req, res, next) => {
    // const authToken = req.cookies['User Cookie'];
    req.user_filter = [{state:[],city:[],district:[]}];
    if(req.cookies['City-District Filter'] != undefined){
        req.user_filter = req.cookies['City-District Filter'];
    }
    req.card = [{expanded_card : 'true'}];
    if(req.cookies['Card'] != undefined){
        req.card = req.cookies['Card'];
    }
    // req.user = authTokens[authToken];
    req.user = req.cookies['User Cookie'];
    // req.user =  {
    //     user_id: 2,
    //     full_name: 'Admin'
    // }
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
router.get('/search',query_function.getCategories,query_function.getSubCategories,query_function.getLogo,pages.searchpage);

/* GET expanded main page. */
router.get('/expanded_main',query_function.getImpNews,pages.expandedmainpage);

/* GET news page. */
router.get('/news',query_function.getSlider,query_function.getNews,pages.homepage);

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
router.get('/each-news/:news_id', query_function.getEachNews,query_function.getImages,query_function.getVideos,query_function.getNoStatesCategories,query_function.getSlider,query_function.getLogo,function(req,res){
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
    const eachNews = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`is_state` AS is_state,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name,`users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image ,`users`.`city` AS news_city FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` = `users`.`user_id` WHERE `news`.`news_id` = '" + news_id + "'";
    mysqlconnection.query(eachNews,function(err,news){
        if(!err){
            if(news[0].sc_name != null){
                var split1 = news[0].sc_name.split('(');
                if(split1[1] == undefined){
                    var search_name = split1[0];
                } else {
                    var search_name = (news[0].sc_name.split('(')[1]).split(')')[0];
                }
                var similiarNews = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`sub_category_id` = '"+ news[0].sub_category_id +"' AND `news`.`news_id` <> '"+ news[0].news_id +"' AND `sub-categories`.`name` LIKE '"+ ('%' + search_name + '%') +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
            } else {
                var similiarNews = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`sub_category_id` = '"+ news[0].sub_category_id +"' AND `news`.`news_id` <> '"+ news[0].news_id +"' AND `sub-categories`.`name` LIKE '"+ ('%' + news[0].c_name + '%') +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
            }
            var user_profile = "SELECT * FROM `user_profile` WHERE `user_id` = '"+news[0].user_id+"'";
            mysqlconnection.query(similiarNews,function(err,similiarNews){
                mysqlconnection.query(user_profile,function(err,user_profile){
                    if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
                        res.render('main/mobile_screens/each-news',{
                            news:news,
                            images:req.images,
                            videos:req.videos,
                            news2: similiarNews,
                            logo:req.logo,
                            categories:req.noStatesCategories,
                            slider:req.slider,
                            user_profile:user_profile,
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
                    } else {
                        res.redirect('/mobile/');
                    }
                });
            });
        }
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
                    if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
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
                        res.redirect('/mobile/');
                    }
                } else {
                    res.send('Database Not connected');
                }
            });
        });
    });
});

router.get('/videos', function(req, res, next) {
    if(req.user){
        var logged_in = 1;
        var user_id = req.user.user_id;
        var full_name = req.user.full_name;
        var role_id = req.user.role_id;
        var sql3 = "SELECT `videos`.*,`news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 3 OFFSET 0";
    } else {
        var logged_in = 0;
        var user_id = undefined;
        var full_name = undefined;
        var role_id = undefined;
        var sql3 = "SELECT `videos`.*,`news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 3 OFFSET 0";
    }
    
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    mysqlconnection.query(sql3,function(err,videos){
        mysqlconnection.query(sql8,function(err,logo){
            if(videos != undefined){
                if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
                    res.render('main/mobile_screens/videos',{
                        videos:videos,
                        logo:logo,
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
                    res.redirect('/mobile/');
                }
            } else {
                res.send('Database Not connected');
            }
        });
    });
});

router.get('/profile', function(req, res, next) {
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    if(req.user){
        var logged_in = 1;
        var role_id = req.user.role_id;
        var sql2 = "SELECT * FROM `users` WHERE `user_id` = '"+req.user.user_id+"'";
        var sql3 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+req.user.user_id+"'";
        var posts = "SELECT `news`.*,`users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`status` = 1 AND `news`.`user_id` = '"+ req.user.user_id +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0";
        var total_posts = "SELECT COUNT(*) AS total FROM `news` WHERE `user_id` = '"+ req.user.user_id +"' AND `is_approved` = 1 AND `status` = 1 ";
        mysqlconnection.query(sql8,function(err,logo){
            mysqlconnection.query(sql2,function(err,users){
                mysqlconnection.query(sql3,function(err,user_profile){
                    mysqlconnection.query(posts,function(err,posts){
                        mysqlconnection.query(total_posts,function(err,total_posts){
                            if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
                                res.render('main/mobile_screens/profile',{
                                    logo:logo,
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
                                    role_id:role_id
                                });
                            } else {
                                res.redirect('/mobile/');
                            }
                        });   
                    });
                }); 
            });
        });
    } else {
        var logged_in = 0;
        var role_id = undefined;
        mysqlconnection.query(sql8,function(err,logo){
            if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
                res.render('main/mobile_screens/profile',{
                    logo:logo,
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
                    role_id:role_id
                });
            } else {
                res.redirect('/mobile/');
            }
        });
    }
});

router.get('/profile/:user_id', function(req, res, next) {
    var sql8 = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    var logged_in = 1;
    var sql2 = "SELECT * FROM `users` WHERE `user_id` = '"+req.params.user_id+"'";
    var sql3 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+req.params.user_id+"'";
    var posts = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 AND `news`.`user_id` = '"+ req.params.user_id +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    var total_posts = "SELECT COUNT(*) AS total FROM `news` WHERE `user_id` = '"+ req.params.user_id +"' AND `is_approved` = 1 AND `status` = 1 ";
    mysqlconnection.query(sql8,function(err,logo){
        mysqlconnection.query(sql2,function(err,users){
            mysqlconnection.query(sql3,function(err,user_profile){
                mysqlconnection.query(posts,function(err,posts){
                    mysqlconnection.query(total_posts,function(err,total_posts){
                        if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
                            res.render('main/mobile_screens/profile',{
                                logo:logo,
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
                                user_id: req.params.user_id
                            });
                        } else {
                            res.redirect('/mobile/');
                        }
                    });   
                });
            }); 
        });
    });
});

// Add news
router.get('/add-news',function(req,res){
    if(req.user){
        var logged_in = 1;
        var user = req.user;
        var role_id = req.user.role_id;
    } else {
        var logged_in = 0;
        var user = undefined;
        var role_id = undefined;
    }
    var tags = "SELECT * FROM `tags` WHERE `status` = 1";
    mysqlconnection.query(tags,function(err,tags){
        if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
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
                role_id:role_id
            });
        } else {
            res.redirect('/mobile/');
        }
    });
});

// post Add news
router.post('/add-news',function(req,res){
    var image = [];
    image = req.body.images.split(',');
    if(req.body.images.split(',')[0] != ''){
        var sql6 = "INSERT INTO `news` (`user_id`,`short_description`,`state`,`city`,`district`,`description`,`front_image_path`,`created_at`,`tags`) VALUES ('" + req.user.user_id + "','" + req.body.title + "','" + req.user_filter[0].state[0] + "','" + req.user_filter[0].city[0] + "','" + req.user_filter[0].district[0] + "','" + req.body.desc + "','" + image[0] + "',CURRENT_TIMESTAMP,'"+ req.body.tag +"')";
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
        var sql6 = "INSERT INTO `news` (`user_id`,`short_description`,`state`,`city`,`district`,`description`,`created_at`,`tags`) VALUES ('" + req.user.user_id + "','" + req.body.title + "','" + req.user_filter[0].state[0] + "','" + req.user_filter[0].city[0] + "','" + req.user_filter[0].district[0] + "','" + req.body.desc + "',CURRENT_TIMESTAMP,'"+ req.body.tag +"')";
        mysqlconnection.query(sql6,function(err,data){
            console.log(err);
        });
    }
    res.jsonp('success');
});
router.post('/save-images',function(req,res){
    var a = [];
    var name = [];
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

/* Api's */ 

// Likes
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

// Comments
router.get('/getComments/:news_id',function(req,res){
    var news_id = req.params.news_id;
    var comment = "SELECT `comments`.*,`users`.`full_name` FROM `comments` INNER JOIN `users` ON `users`.`user_id` = `comments`.`user_id` WHERE `news_id` = '"+ news_id +"'";
    mysqlconnection.query(comment,function(err,comment){
        res.jsonp(comment);
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

router.get('/getDistrict/:state',function(req,res){
    var state = req.params.state;
    const sub_category = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `sub-categories`.`name` NOT LIKE '%(%' AND `categories`.`is_state` = 1 AND `categories`.`name` = '"+ state +"' ORDER BY `sub-categories`.`name`";
    mysqlconnection.query(sub_category,function(err,sub_category){
        res.jsonp(sub_category);
    });
});

router.get('/getSubDistrict/:city',function(req,res){
    var city = req.params.city;
    const sub_category = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `name` LIKE '%"+ ('(' + city + ')') +"%' ORDER BY `name`";
    mysqlconnection.query(sub_category,function(err,sub_category){
        res.jsonp(sub_category);
    });
});

router.get('/getMoreCategoryNews/:category_name/:offset',function(req,res){
    var offset = req.params.offset;
    var category_name = req.params.category_name;
    if(req.user){
        var news = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 AND `categories`.`name` = '"+ category_name +"' ORDER BY `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
    } else {
        var news = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 AND `categories`.`name` = '"+ category_name +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+ offset +"";
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


router.get('/getVideos/:offset', function(req, res, next) {
    var o = req.params.offset;
    if(req.user){
        var sql3 = "SELECT `videos`.*,`news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 1 OFFSET "+o+"";
    } else {
        var sql3 = "SELECT `videos`.*,`news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name, `user_profile`.`image` AS profile_image  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`id` = `users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 1 OFFSET "+o+"";
    }
    mysqlconnection.query(sql3,function(err,videos){
        res.jsonp(videos);
    });
});

//Login


router.post('/user-login', function(req, res, next) {
    var state = req.user_filter[0].state[0];
    var city = req.user_filter[0].city[0];
    var phone = req.body.phone;
    var tokken = req.body.tokken;
    var full_name = req.body.full_name;
    var is_approved = 1;
    var user_data;
    var sql = "SELECT * FROM `users` WHERE phone = '" + phone + "' AND status = 1 AND role_id = 4 AND password = '" + tokken + "'";
    mysqlconnection.query(sql,function(err,data){
        if(data.length != 0){
            var sql7 = "UPDATE `users` SET `name` = '" + full_name + "',`full_name` = '" + full_name + "',`city` = '"+city+"',`state` = '"+state+"' WHERE phone = '" + phone + "' AND status = 1 AND role_id = 4 AND password = '" + tokken + "'";
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
            res.jsonp({message:'success'});
        }else {
            var sql6 = "INSERT INTO `users` (`name`,`full_name`,`password`,`is_approved`,`phone`,`role_id`,`city`,`state`) VALUES ('" + full_name + "','" + full_name + "','" + tokken + "','" + is_approved + "','" + phone + "',4,'"+city+"','"+state+"')";
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
                    res.jsonp({message:'success'});
                }
            });
        }
    });
});


module.exports = router;
