const common = require('../../common');
var gplay = require('google-play-scraper');

let mainpage = (req,res) => {
    var filter = [{
        expanded_card:'false',
    }];
    res.cookie('Card Filter', filter,{maxAge:  365*24*60*60*1000});
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
    
    if(req.user_filter[0].state.length != 0 && req.user_filter[0].city.length != 0){
            res.render('main/mobile_screens/main',{
                news:req.impNews,
                user_filter:req.user_filter,
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
                cardStyle:'plain',
                card:req.card[0].expanded_card,
                role_id:role_id
            });
    } else {
        res.redirect('/mobile/');
    }
    
}

let searchpage = (req,res) => {
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

    res.render('main/mobile_screens/search',{
        categories:req.statesCategories,
        states:req.sub_category,
        tags: req.tags,
        sub_category_district: req.sub_category_district,
        // logo:req.logo,
        user_filter:req.user_filter,
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
    
}


let expandedmainpage = (req,res) => {
    var filter = [{
        expanded_card:'true',
    }];
    res.cookie('Card Filter', filter,{maxAge:  365*24*60*60*1000});
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

    res.render('main/mobile_screens/main',{
        news:req.impNews,
        user_filter:req.user_filter,
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
        cardStyle:'expanded',
        card:req.card[0].expanded_card,
        role_id:role_id
    });
    
}

let homepage = (req,res) => {
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

    gplay.app({appId: 'com.technotwist.primeapp.prime_app'})
    .then((value) => {
        res.render('main/mobile_screens/news',{
            // categories:req.noStatesCategories,
            // StatesCategories:req.statesCategories,
            slider:req.slider,
            news2:req.news,
            // logo:req.logo,
            // subCategories:req.sub_category,
            user_filter:req.user_filter,
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
            // subCategoriesDistrict:req.sub_category_district,
            role_id:role_id,
            version:value.version,
        });
    });
    
}

let expandedcardpage = (req,res) => {
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

    gplay.app({appId: 'com.technotwist.primeapp.prime_app'})
    .then((value) => {
        res.render('main/mobile_screens/expanded',{
            // categories:req.noStatesCategories,
            // StatesCategories:req.statesCategories,
            slider:req.slider,
            // news:req.impNews,
            news2:req.news,
            // logo:req.logo,
            // subCategories:req.sub_category,
            user_filter:req.user_filter,
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
            // subCategoriesDistrict:req.sub_category_district,
            role_id:role_id,
            version:value.version,
        });
    });
    
}


let categorypage = (req,res) => {
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

    res.render('main/mobile_screens/category',{
        // categories:req.noStatesCategories,
        // StatesCategories:req.statesCategories,
        // slider:req.slider,
        // news:req.impNews,
        news2:req.news,
        // logo:req.logo,
        // subCategories:req.sub_category,
        user_filter:req.user_filter,
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
        // subCategoriesDistrict:req.sub_category_district,
        category_name:req.params.category_name,
        role_id:role_id,
        getData:req.getData
    });
    
}

let searchresultpage = (req,res) => {
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

    if(req.card[0].expanded_card == 'false'){
        res.render('main/mobile_screens/searchresult',{
            // categories:req.noStatesCategories,
            // StatesCategories:req.statesCategories,
            // slider:req.slider,
            // news:req.impNews,
            news2:req.news,
            // logo:req.logo,
            // subCategories:req.sub_category,
            user_filter:req.user_filter,
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
            // subCategoriesDistrict:req.sub_category_district,
            category_name:req.params.category_name,
            role_id:role_id,
            getData:req.params.folder
        });
    } else if(req.card[0].expanded_card == 'true') {
        res.render('main/mobile_screens/expandedsearchresult',{
            // categories:req.noStatesCategories,
            // StatesCategories:req.statesCategories,
            // slider:req.slider,
            // news:req.impNews,
            news2:req.news,
            // logo:req.logo,
            // subCategories:req.sub_category,
            user_filter:req.user_filter,
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
            // subCategoriesDistrict:req.sub_category_district,
            category_name:req.params.category_name,
            role_id:role_id,
            getData:req.params.folder
        });
    }
    
}

let expandedcategorypage = (req,res) => {
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

    res.render('main/mobile_screens/expandedcategory',{
        // categories:req.noStatesCategories,
        // StatesCategories:req.statesCategories,
        // slider:req.slider,
        // news:req.impNews,
        news2:req.news,
        // logo:req.logo,
        // subCategories:req.sub_category,
        user_filter:req.user_filter,
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
        // subCategoriesDistrict:req.sub_category_district,
        category_name:req.params.category_name,
        role_id:role_id,
        getData:req.getData
    });
    
}

let citypage = (req,res) => {
    if(req.user){
        var logged_in = 1;
        var user_id = req.user.user_id;
        var full_name = req.user.full_name;
        var role_id = req.user.role_id;
    } else {
        var logged_in = 0;
        var user_id = undefined;
        var role_id = undefined;
        var full_name = undefined;
    }

    res.render('main/mobile_screens/local',{
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
        full_name:full_name,
        title:common.title,
        imageReplacer:common.imageReplacer,
        website:common.website,
        appId:common.appId,
        class1:common.class1,
        class2:common.class2,
        favicon:common.favicon,
        subCategoriesDistrict:req.sub_category_district,
        category_name:req.params.category_name,
        role_id:role_id
    });
    
}

let expandedcitypage = (req,res) => {
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

    res.render('main/mobile_screens/expanded-local',{
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
        full_name:full_name,
        title:common.title,
        imageReplacer:common.imageReplacer,
        website:common.website,
        appId:common.appId,
        class1:common.class1,
        class2:common.class2,
        favicon:common.favicon,
        subCategoriesDistrict:req.sub_category_district,
        category_name:req.params.category_name,
        role_id:role_id
    });
    
}



let eachNewspage = (req,res) => {
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

    res.render('main/mobile_screens/each-news',{
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
    
}

module.exports = {
    homepage: homepage,
    eachNewspage:eachNewspage,
    categorypage:categorypage,
    citypage:citypage,
    expandedcardpage:expandedcardpage,
    mainpage:mainpage,
    expandedmainpage:expandedmainpage,
    searchpage:searchpage,
    expandedcategorypage:expandedcategorypage,
    expandedcitypage:expandedcitypage,
    searchresultpage:searchresultpage
}