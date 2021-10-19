const common = require('../../common');

let homepage = (req,res) => {
    if(req.user){
        var logged_in = 1;
        var user_id = req.user.user_id;
    } else {
        var logged_in = 0;
        var user_id = undefined;
    }
    res.render('main/web_screens/news',{
        categories:req.noStatesCategories,
        StatesCategories:req.statesCategories,
        slider:req.slider,
        news:req.impNews,
        news2:req.news,
        logo:req.logo,
        subCategories:req.sub_category,
        user_filter:req.user_filter,
        logged_in:logged_in,
        user_id:user_id,
        title:common.title,
        imageReplacer:common.imageReplacer,
        website:common.website,
        appId:common.appId,
        class1:common.class1,
        class2:common.class2,
        favicon:common.favicon,
        subCategoriesDistrict:req.sub_category_district
    });
}

let eachNewspage = (req,res) => {
    if(req.user){
        var logged_in = 1;
        var user_id = req.user.user_id;
    } else {
        var logged_in = 0;
        var user_id = undefined;
    }
    res.render('screens/each-news',{
        news:req.eachNews,
        images:req.images,
        videos:req.videos,
        news2: req.similiarNews,
        logo:req.logo,
        categories:req.noStatesCategories,
        slider:req.slider,
        user_profile:req.user_profile,
        logged_in:logged_in,
        user_id:user_id,
        title:common.title,
        imageReplacer:common.imageReplacer,
        website:common.website,
        appId:common.appId,
        class1:common.class1,
        class2:common.class2,
        favicon:common.favicon
    });
}

module.exports = {
    homepage: homepage,
    eachNewspage:eachNewspage
}