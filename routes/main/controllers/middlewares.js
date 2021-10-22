const mysqlconnection = require('../../../database/connection');
const common = require('../../common');

let getLogo = (req,res,next) => {
    const logo = "SELECT * FROM `logo` WHERE `website` = '"+ common.logo_path +"'";
    mysqlconnection.query(logo,function(err,logo){
        if(!err){
            req.logo = logo;
        }
        next();
    });
}

let getAds = (req,res,next) => {
    const ads = "SELECT * FROM `ads` WHERE status = 1 ORDER BY `order`";
    mysqlconnection.query(ads,function(err,ads){
        if(!err){
            req.ads = ads;
        }
        next();
    });
}

let getNoStatesCategories = (req,res,next) => {
    const noStatesCategories = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `is_state` = 0 ORDER BY `order`";
    mysqlconnection.query(noStatesCategories,function(err,noStatesCategories){
        if(!err){
            req.noStatesCategories = noStatesCategories;
        }
        next();
    });
}

let getStatesCategories = (req,res,next) => {
    const statesCategories = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `is_state` = 1 ORDER BY `order`";
    mysqlconnection.query(statesCategories,function(err,statesCategories){
        if(!err){
            req.statesCategories = statesCategories;
        }
        next();
    });
}

let getSubCategory = (req,res,next) => {
    const sub_category = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `sub-categories`.`name` NOT LIKE '%(%' AND `categories`.`is_state` = 1 ORDER BY `sub-categories`.`name`";
    mysqlconnection.query(sub_category,function(err,sub_category){
        if(!err){
            req.sub_category = sub_category;
        }
        next();
    });
}

let getSubCategoryDistrict = (req,res,next) => {
    const sub_category_district = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `sub-categories`.`name` LIKE '%(%' AND `categories`.`is_state` = 1 ORDER BY `sub-categories`.`name`";
    mysqlconnection.query(sub_category_district,function(err,sub_category_district){
        if(!err){
            req.sub_category_district = sub_category_district;
        }
        next();
    });
}

let getSlider = (req,res,next) => {
    const slider = "SELECT `slider`.*, `categories`.`name` AS c_name FROM `slider` INNER JOIN `categories` ON `categories`.`id` = `slider`.`state` WHERE `slider`.`status` = 1 ORDER BY `slider`.`order`";
    req.slider = [];
    mysqlconnection.query(slider,function(err,slider){
        if(!err){
            // if((req.user_filter)[0].state.length != 0){
            //     for(var i=0;i<slider.length;i++){
            //         if(slider[i].city == null){
            //             if((req.user_filter)[0].state.includes(slider[i].c_name)){
            //                 req.slider.push(slider[i]);
            //             }
            //         } else {
            //             var new_city = JSON.parse(slider[i].city);
            //             if((req.user_filter)[0].state.includes(slider[i].c_name)){
            //                 for(var j=0;j<new_city.city.length;j++){
            //                     if((req.user_filter)[0].city.includes(new_city.city[j])){
            //                         req.slider.push(slider[i]);
            //                         break;
            //                     }
            //                 }
            //             }
            //         }
            //     }
            //     if(req.slider.length == 0){
                    req.slider = slider;
            //     }
            // } else {
            //     req.slider = slider;
            // }
        }
        next();
    });
}

let getNews = (req,res,next) => {
    if(req.user){
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name,`user_profile`.`image` AS profile_image , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0;";
    } else {
        var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name ,`user_profile`.`image` AS profile_image FROM `news` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` INNER JOIN `user_profile` ON `user_profile`.`user_id` =`users`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    }
    mysqlconnection.query(news,function(err,news){
        if(!err){
            req.news = news;
        }
        next();
    });
}

let getCategoryNews = (req,res,next) => {
    if(req.params.category_name.includes('क्षेत्र')){
        if(req.user){
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`district` LIKE '"+ req.params.category_name +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0;";
        } else {
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`district` L '"+ req.params.category_name +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
        }
    console.log(req.params.category_name);
    } else {
        if(req.user){
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`district` = '"+ req.params.category_name +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0;";
        } else {
            var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `news`.`district` = '"+ req.params.category_name +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
        }
    }
    console.log(news);
    mysqlconnection.query(news,function(err,news){
        if(!err){
            req.news = news;
        }
        next();
    });
}

let getCityNews = (req,res,next) => {
    console.log(req.params.category_name);
    // if(req.user){
    //     var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `categories`.`name` = '"+ req.user_filter[0].state[0] +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0;";
    // } else {
    //     var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `categories`.`name` = '"+ req.params.category_name +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    // }
    // mysqlconnection.query(news,function(err,news){
    //     if(!err){
    //         req.news = news;
    //     }
    //     next();
    // });
    next();
}

let getStateNews = (req,res,next) => {
    console.log(req.params.category_name);
    // if(req.user){
    //     var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name , (SELECT `like_id` FROM `likes` WHERE `news_id` = `news`.`news_id` AND `user_id` = '"+ req.user.user_id +"') AS news_like FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `categories`.`name` = '"+ req.user_filter[0].state[0] +"' ORDER BY `news`.`news_id` DESC LIMIT 10 OFFSET 0;";
    // } else {
    //     var news = "SELECT `news`.*, `users`.`nickname` AS u_name, `users`.`full_name` AS f_name FROM `news`   INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id`  WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1  AND `categories`.`name` = '"+ req.params.category_name +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    // }
    // mysqlconnection.query(news,function(err,news){
    //     if(!err){
    //         req.news = news;
    //     }
    //     next();
    // });
    next();
}


let getImpNews = (req,res,next) => {
    const impNews = "SELECT `news_id`,`short_description` FROM `news` WHERE `is_approved` = 1 AND `status` = 1 AND `imp` = 1 ORDER By `news_id` DESC LIMIT 10 OFFSET 0";
    mysqlconnection.query(impNews,function(err,impNews){
        if(!err){
            req.impNews = impNews;
        }
        next();
    });
}

let getCategories = (req,res,next) => {
    const categories = "SELECT * FROM `categories` WHERE status = 1 AND name <> 'NULL'";
    mysqlconnection.query(categories,function(err,categories){
        if(!err){
            req.categories = categories;
        }
        next();
    });
}

let getSubCategories = (req,res,next) => {
    const subcategories = "SELECT `sub-categories`.* FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `sub-categories`.`name` <> 'NULL' AND `categories`.`is_state` = 1";
    mysqlconnection.query(subcategories,function(err,subcategories){
        if(!err){
            req.subcategories = subcategories;
        }
        next();
    });
}

let getEachNews = (req,res,next) => {
    req.user_profile = [];
    req.similiarNews = [];
    const news_id = req.params.news_id;
    const eachNews = "SELECT `news`.*,`categories`.`is_state` AS is_state,`users`.`nickname` AS u_name, `users`.`full_name` AS f_name ,`users`.`city` AS news_city FROM `news`  INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id`  WHERE `news`.`news_id` = '" + news_id + "'";
    mysqlconnection.query(eachNews,function(err,news){
        if(!err){
            req.eachNews = news;
            if(news[0].sc_name != null){
                var split1 = news[0].sc_name.split('(');
                if(split1[1] == undefined){
                    var search_name = split1[0];
                } else {
                    var search_name = (news[0].sc_name.split('(')[1]).split(')')[0];
                }
                var similiarNews = "SELECT `news`.* FROM `news`  INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`sub_category_id` = '"+ news[0].sub_category_id +"' AND `news`.`news_id` <> '"+ news[0].news_id +"' AND `sub-categories`.`name` LIKE '"+ ('%' + search_name + '%') +"' ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
            } else {
                var similiarNews = "SELECT `news`.* FROM `news`  INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`sub_category_id` = '"+ news[0].sub_category_id +"' AND `news`.`news_id` <> '"+ news[0].news_id +"' AND `sub-categories`.`name` LIKE '"+ ('%' + news[0].c_name + '%') +"' ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
            }
            var user_profile = "SELECT * FROM `user_profile` WHERE `user_id` = '"+news[0].user_id+"'";
            mysqlconnection.query(similiarNews,function(err,similiarNews){
                mysqlconnection.query(user_profile,function(err,user_profile){
                    req.similiarNews = similiarNews;
                    req.user_profile = user_profile;
                });
            });
        }
        next();
    });
}

let getImages = (req,res,next) => {
    const news_id = req.params.news_id;
    const images = "SELECT * FROM `images` WHERE news_id = '"+news_id+"'";
    mysqlconnection.query(images,function(err,images){
        if(!err){
            req.images = images;
        }
        next();
    });
}

let getVideos = (req,res,next) => {
    const news_id = req.params.news_id;
    const videos = "SELECT * FROM `videos` WHERE news_id = '"+news_id+"'";
    mysqlconnection.query(videos,function(err,videos){
        if(!err){
            req.videos = videos;
        }
        next();
    });
}

module.exports = {
    getAds: getAds,
    getNoStatesCategories:getNoStatesCategories,
    getStatesCategories:getStatesCategories,
    getSubCategory:getSubCategory,
    getSubCategoryDistrict:getSubCategoryDistrict,
    getLogo:getLogo,
    getNews:getNews,
    getSlider:getSlider,
    getImpNews:getImpNews,
    getCategories:getCategories,
    getSubCategories:getSubCategories,
    getEachNews:getEachNews,
    getImages:getImages,
    getVideos:getVideos,
    getCategoryNews:getCategoryNews,
    getCityNews:getCityNews,
    getStateNews:getStateNews
}