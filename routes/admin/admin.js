var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var fs = require('fs-extra');
// const sharp = require("sharp");
// var FCM = require('fcm-node');
var serverKey = 'AAAA7fEY5N8:APA91bHB2AArd2yR_HHXYtOE4CLBoOecHP9hpWY3IW6Po4hYRvTQhcdeMsrJ9WaneR44tIdp5rQusuUqo700jb0ohqdU9HtEWzQORaycYiJrEEcXClHe6NtBUBenFibG-uwMcEt_8b9G'; //put your server key here
// var fcm = new FCM(serverKey);
var fcm = require('fcm-notification');
// var FCM = new fcm({
//         "type": "service_account",
//         "project_id": "popularapp-9d854",
//         "private_key_id": "d2032b1c5c3815d2ed998422bc8fba1fa4422c5b",
//         "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgdXlGhs/NksRW\nGx0lmsBSsKN4qYb3OrSwgwh6BHgMua+OSNDxCVKOcDYkIu2stU7zFHI0aeOtemhb\nZkcQlrYh6hNmr0eadvtdngeLxPOqW2Y5JOcdTKOXG3BRKMFg2FRswyIRJdL84J49\nN8jvdbKfrgKU9WKhPYlcy3Me0zl7J268MV3x+rYL9kf+RqNDcHkuqW8hVABiJnUl\nf5WUz8TBEx9Z10dK9JcWZQqDZZWc2yFsRmdhQ04Vqi0d6ra6qsaKVUn5lovFBz5C\nLNKTU2QyH1H1kq6yAAFN58LDolOwVJfc10NlA+MUzknXCvZOAsyivLO2GTkclk4w\n9SWcmtUrAgMBAAECggEARCzFY07CGeEC5GbOwnx2vGtqeUjmHELoJJr3zgf6DcYT\nLgwIInFIj1Zj2oSwoRHDwonsYBKhdsKsdjEFfqnaJpyys41DigCFmmgbYqpCsR32\nV88zFwLJ+tjgpsr/JqujazaZUdnVRDYXZYE/MWa7hxbC6BE+X62qoC+c8Prj0Evr\nd99w8f59l/8mIoE6YLH8x0/EP8kmvGXo20dtH3KIiJVMFsxZvB2dWY7j8smMFP1c\n/SoQntr17npqVrPsfFqQMlatruI+R/T2TOw41vUGnP6wjl/iT8AK0Z52M6S/8ihY\n6RcKLF2wbmcLQo13ZGLZ+XbdZV/fSd1ktIbJExtw2QKBgQDQiVWcOguC6wVwlHo7\n8HsR1ae6YhSfkuJT7cl0fUsp6hPx+CSnHXbltCJ3Q+Wq7jW7+ipLRG65/6EoBL6i\nrB5HMdCfokQp9eouNBJ/XlCehDMDTN1rd+IkVQoBPoQ1o/6yUoxBt3WytUOiTwtU\nPyZDvCJduGZM3G7vjxXdoyMbjwKBgQDE+tUhM2cGkj83i9ujhCkDWDFOXpu+NDLJ\numg+zExBqydBfyaGwwri4aMkRfL6TCY6fzOCiCAUWm79T2T+wJqPDw1W6W34k1Vh\nms7ymPUT03oNK9ywNDOqX3KRUPGMwpuvj0bGZvCCQH1tfqtfcQVaCY8aOGFSfM7R\nxDJ4SePOpQKBgC/XQd+sZVWsizvvpDc6DVHjHS6iL68IKIoupCfoUqUUAW1iiy4X\nkV5TPBD2b6sOKR+t3aQU1/4tyg//PqjdKbkVkZH9zPt/YjElWxUDUyV6mKVqLeXo\nw+Wn6LquV/BiZh0M2QZ+iy7rbM/AqI20SxgBAjVUB4wcigrFXbPSKEy7AoGAMdhn\nZmdjgr4vURcLFW20EyyWDYbTUmZTE8kf6AQ6p8Nvw5sxXJiugIsohV1OBxiN8++M\nUVOxCnV38JHOtMh4VAszDPM06NofmPtbsvgRzFqPYBXhWpVbHZnZm/wno777NonD\nFyGlatB27OZI53XqLMaOd8wclIsQqvRC8T2BcCECgYEAvVcBBQELCzaA5ci3Fapx\nIpve9931Yv/nMpmkLuVWH2MrSdSgY9r5a0sDS9zBdJRpFITPK04UKcNoDfxOYGMH\nIJ60xTxeHbnH3PMDNoAEMqrUsnpKJQhQJ3ljda1JxWHfaQWKh+tMPRIkaAztr/OA\nHXvnj7PzN9p5m+Gw89WDIgw=\n-----END PRIVATE KEY-----\n",
//         "client_email": "firebase-adminsdk-rtprb@popularapp-9d854.iam.gserviceaccount.com",
//         "client_id": "104894272053779695784",
//         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//         "token_uri": "https://oauth2.googleapis.com/token",
//         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//         "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rtprb%40popularapp-9d854.iam.gserviceaccount.com"
//     }
// );

const TOKEN_PATH = '../../credentials/token.json';

const OAuth2Data = require("../../credentials/credentials.json");
const { google } = require("googleapis");
// const imagemin = require("imagemin");
// const imageminMozjpeg = require("imagemin-mozjpeg");

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

var authed = false;

// If modifying these scopes, delete token.json.
const SCOPES =
    "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/contacts.readonly";



// var session=require('express-session');
//
//
// router.use(session({
//   secret:"Key",
//   res
//   ave:true,
//   saveUninitialized:true,
//   cookie:{maxAge:10000}}));
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

/*Import databases*/
var mysqlconnection = require('../../database/connection');

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};


router.use((req, res, next) => {
    // Get auth token from the cookies
    // console.log(req.session);
    // if(req.session){
    const authToken = req.cookies['AuthToken'];
    // const googleAuthentication = req.cookies['GoogleAuthenticate'];
    // Inject the user to the request
    // console.log(googleAuthentication);
    req.user = authTokens[authToken];
    // req.googleAuthenticate =googleAuthentication;
    // } else {
    //   req.user = undefined;
    // }
//   req.user =  {
//     user_id: 2,
//     name: 'admin',
//     full_name: 'ADMIN',
//     password: 'C3kNJX/F3WmITvJXQqVk0etkZcg9q+1ZdaD2L6kYOWU=',
//     phone: '9024123007',
//     nickname: 'Admin',
//     father_name: '',
//     address: '',
//     is_approved: 1,
//     city: 'Ajmer',
//     role_id: 1,
//     status: 1,
//     created_by: 0,
//     auto_approved: 1
//   }
    // console.log(req.user);
    next();
});


// router.get('/login', (req, res) => {
//     res.render('admin/screens/login',{
//         message:null,
//         messageClass:null
//     });
// });


/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        // res.render('admin/screens/dashboard',{
        //     role_id:req.user.role_id
        // });
        res.redirect('/admin/news');
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});


router.get('/logout', function(req, res, next) {
    res.clearCookie('AuthToken');
    res.redirect('/admin');
});


router.post('/upload', function(req, res, next) {
    var html = '';
    // console.log(req.files);
    // console.log(req.query.CKEditorFuncNum);
    var Images = req.files.upload;
    var new_date = new Date();
    var new_name = new_date.getTime() + '_upload.png';
    req.files.upload.name = new_name;
    var imageFiles = typeof req.files.upload.name !=="undefined" ? req.files.upload.name : "" ;
    var path1 = 'public/images/uploads/'+  imageFiles;
    Images.mv(path1, function(err){
        if(err){
            return console.log(err);
        } else {
            html = "";
            html += "<script type='text/javascript'>";
            html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
            html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
            html += "    var message = \"Uploaded file successfully\";";
            html += "";
            html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
            html += "</script>";

            res.send(html);
        }
    });
});

//
// //This new section
//
//
router.get('/add-news', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 3){
            var sql = "SELECT `categories`.* FROM `categories` INNER JOIN `sub-categories` ON `sub-categories`.`category_id` = `categories`.`id` WHERE `categories`.`status` = 1 AND `categories`.`is_state` = 1 AND `sub-categories`.`name` = '"+ req.user.city +"'";
            var sql3 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` = '"+ req.user.city +"'";
        } else {
            var sql = "SELECT * FROM `categories` WHERE `status` = 1 AND `is_state` = 1 AND `name` <> 'NULL'";
            var sql3 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL' ORDER BY `name`";
        }
        var sql2 = "SELECT `access_token`,`refresh_token`,`scope`,`token_type`,`id_token`,`expiry_date` FROM `token` WHERE `id` = 1";
        var tags = "SELECT * FROM `tags` WHERE `status` = 1";
    
        mysqlconnection.query(sql,function(err,categories){
            mysqlconnection.query(sql3,function(err,subcategories){
                mysqlconnection.query(sql2,function(err,tokens){
                    mysqlconnection.query(tags,function(err,tags){
                        if(tokens[0].access_token != ''){
                            oAuth2Client.setCredentials(tokens[0]);
                            authed = true;
                            if(!err){
                                if (!authed) {
                                    var url = oAuth2Client.generateAuthUrl({
                                        access_type: "offline",
                                        scope: SCOPES,
                                    });
                                    res.render("admin/screens/index", { url: url });
                                } else {
                                    var oauth2 = google.oauth2({
                                        auth: oAuth2Client,
                                        version: "v2",
                                    });
                                    oauth2.userinfo.get(function (err, response) {
                                        if (err) {
                                            // console.log('logout');
                                            // console.log(err);
    
                                            // oAuth2Client.getToken(tokens[0].refresh_token,function (err, tokens){
                                            //     console.log(err);
                                            // });
                                            
                                            var url = oAuth2Client.generateAuthUrl({
                                                access_type: "offline",
                                                scope: SCOPES,
                                            });
                                            // res.render("admin/screens/index", { url: url });
                                            res.render('admin/screens/create-news',{
                                                categories:categories,
                                                admin_id:req.user.user_id,
                                                role_id:req.user.role_id,
                                                subcategories:subcategories,
                                                url:url,
                                                tags:tags
                                            });
                                        } else {
                                            console.log('response');
                                            res.render('admin/screens/new-create-news',{
                                                categories:categories,
                                                admin_id:req.user.user_id,
                                                role_id:req.user.role_id,
                                                subcategories:subcategories,
                                                tags:tags
                                            });
                                        }
                                    });
                                    // res.render('admin/screens/new-create-news',{
                                    //     categories:categories,
                                    //     admin_id:req.user.user_id,
                                    //     role_id:req.user.role_id,
                                    //     subcategories:subcategories
                                    // });
                                }
                            }
                        } else {
                            var url = oAuth2Client.generateAuthUrl({
                                access_type: "offline",
                                scope: SCOPES,
                            });
                            res.render("admin/screens/index", { url: url });
                        }
                    });
                });
            });
        });
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});
// });
// });

router.post("/upload-video", function (req, res,next) {
    // console.log(req.files);
    // console.log(req.body);
    // res.jsonp('success');
    var title = req.body.title;
    var description = req.body.description;
    var tags = '';
    const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
    // console.log(youtube);
    youtube.videos.insert({
        resource: {
            snippet: {
                title:title,
                description:description,
                tags:tags
            },
            status: {
                privacyStatus: "unlisted",
            },
        },
        part: "snippet,status",
        media: {
            body: fs.createReadStream(req.files.videos.tempFilePath)
        },
    },
    (err, data) => {
        if(!err){
            console.log("Done.");
            fs.unlinkSync(req.files.videos.tempFilePath);
            res.jsonp({
                message:'success',
                response_id:data.data.id
            });
        } else {
            console.log('Upload Video');
            console.log(err);
            res.jsonp({
                message:'fail',
                response_id:null
            });
        }
    });
});

router.post("/upload-image", function (req, res,next) {
// console.log(req.files);
// console.log(req.body);
// res.jsonp('success');
var folderId = '1lImo_leE4RTuOSIQ5sY-5Hu0AP1VTfHG';
// google.drive()
const drive = google.drive({ version: "v3", auth: oAuth2Client});
const fileMetadata = {
name: req.files.images.tempFilePath,
parents: [folderId]
};
const media = {
mimeType: req.files.images.mimetype,
body: fs.createReadStream(req.files.images.tempFilePath),
};
drive.files.create(
{
    resource: fileMetadata,
    media: media,
    fields: "id",
},
(err, file) => {
    console.log(err);
    if(!err){
        console.log("Done.");
        // console.log(file.data.id);
        fs.unlinkSync(req.files.images.tempFilePath);
        res.jsonp({
            message:'success',
            response_id:file.data.id,
            error:err
        });
    } else {
        console.log('Upload Image');
        console.log(err);
        res.jsonp({
            message:'fail',
            response_id:null,
            error:err
        });
    }
}
);
});

router.get("/google/callback", function (req, res) {
    const code = req.query.code;
    if (code) {
    // Get an access token based on our OAuth code
    oAuth2Client.getToken(code, function (err, tokens) {
        if (err) {
            console.log("Error authenticating");
            console.log(err);
        } else {
            console.log("Successfully authenticated");
            var tomorrow = new Date();
            tomorrow.setFullYear(tomorrow.getFullYear() + 1);
            tokens.expiry_date = tomorrow.getTime();
            console.log(tokens);

            if(tokens.refresh_token != undefined) {
                var sql = "UPDATE `token` SET `access_token` = '"+ tokens.access_token +"', `refresh_token` = '"+ tokens.refresh_token +"', `scope` = '"+ tokens.scope +"',`token_type` = '"+ tokens.token_type +"',`id_token` = '"+ tokens.id_token +"', `expiry_date` = '"+ tokens.expiry_date +"' WHERE `id` = 1";
            } else {
                var sql = "UPDATE `token` SET `access_token` = '"+ tokens.access_token +"', `scope` = '"+ tokens.scope +"',`token_type` = '"+ tokens.token_type +"',`id_token` = '"+ tokens.id_token +"', `expiry_date` = '"+ tokens.expiry_date +"' WHERE `id` = 1";
            }
    
            mysqlconnection.query(sql,function(err,data){
                console.log('create token');
                console.log(err);
                if(!err){
                    oAuth2Client.setCredentials(tokens);
                    authed = true;
                }
                res.redirect("/admin/add-news");
            });
    
            // var hours = 1*24*60*60*1000;
            // res.cookie('GoogleAuthenticate', oAuth2Client,{maxAge: hours});
            // res.send(oAuth2Client);
        }
    });
    }
    });
    


router.post('/add-news', async function (req, res, next) {
var role_id = req.user.role_id;
var state = (req.body.c).split('_')[0];
var city = req.body.sc;
var district = req.body.district;
var title = req.body.title;
var status = 1;
var short_description = req.body.sd;
var description = req.body.ta;
var admin_id = req.body.admin_id;
var url = req.body.url;
var images = req.body.image;
var tags = req.body.tags;
if (req.user.auto_approved == 1) {
    var approved = 1;
} else {
    var approved = 0;
}

if(role_id == 2 || role_id == 1){
    var approved = 1;
}

var image =[];
var video = [];

if(images[0] == undefined || typeof images == "string"){
    image.push(images);
} else {
    image = images;
}

if(url[0] == undefined || typeof url == "string"){
    video.push(url);
} else {
    video = url;
}

if(image.length != 0 && image[0] != []){
    // console.log(images);
    var sql6 = "INSERT INTO `news` (`user_id`,`state`,`city`,`district`,`title`,`short_description`,`status`,`is_approved`,`description`,`front_image_path`,`created_at`,'"+ tags +"') VALUES ('" + admin_id + "','" + state + "','" + city + "','" + district + "','" + title + "','" + short_description + "','" + status + "','" + approved + "','" + description + "','" + image[0] + "',CURRENT_TIMESTAMP,`tags`)";
    // console.log(sql6);
    mysqlconnection.query(sql6,function(err,data){
        console.log(err);
        if(!err){
            if(video.length != 0 && video[0] != []){
                for(var i = 0 ;i<video.length;i++){
                    var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + data.insertId + "','" + video[i] + "')";
                    mysqlconnection.query(sql,function(err,video){
                        console.log(err);
                    });
                }
            }
            for(var i = 0 ;i<image.length;i++){
                var sql = "INSERT INTO `images` (`news_id`,`path`) VALUES ('" + data.insertId + "','" + image[i] + "')";
                mysqlconnection.query(sql,function(err,img){
                    console.log(err);
                });
            }
            res.redirect('/admin/add-news');
        }
    });
} else if(image[0] == []){
    var sql6 = "INSERT INTO `news` (`user_id`,`state`,`city`,`district`,`title`,`short_description`,`status`,`is_approved`,`description`,`created_at`,`tags`) VALUES ('" + admin_id + "','" + state + "','" + city + "','" + district + "','" + title + "','" + short_description + "','" + status + "','" + approved + "','" + description + "',CURRENT_TIMESTAMP,'"+ tags +"')";
    mysqlconnection.query(sql6,function(err,data){
        // console.log(err);
        if(!err){
            if(video.length != 0 && video[0] != []){
                for(var i = 0 ;i<video.length;i++){
                    var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + data.insertId + "','" + video[i] + "')";
                    mysqlconnection.query(sql,function(err,video){
                        console.log(err);
                    });
                }
            }
            res.redirect('/admin/add-news');
        }
    });
}
});

router.post('/add-news-notlogged', async function (req, res, next) {
    if (req.user && res.statusCode == 200) {
        // console.log(req.user);
        var role_id = req.user.role_id;
        var state = (req.body.c).split('_')[0];
        var city = req.body.sc;
        var district = req.body.district;
        // var state = req.body.state;
        // var city = req.body.city;
        var title = req.body.title;
        var status = req.body.status;
        var short_description = req.body.sd;
        var description = req.body.ta;
        var admin_id = req.body.admin_id;
        var tags = req.body.tags;
        var u = req.body.url;
        var url = [];
        if (typeof u == "string") {
            url.push(u);
        } else {
            url = u;
        }
        if (req.user.auto_approved == 1) {
            var approved = 1;
        } else {
            var approved = 0;
        }

        if(role_id == 3){
        } else if(role_id == 2 || role_id == 1){
            var approved = 1;
        }
        if(req.files == null){
            var sql6 = "INSERT INTO `news` (`user_id`,`state`,`city`,`district`,`title`,`short_description`,`status`,`is_approved`,`description`,`created_at`,`tags`) VALUES ('" + admin_id + "','" + state + "','" + city + "','" + district + "','" + title + "','" + short_description + "','" + status + "','" + approved + "','" + description + "',CURRENT_TIMESTAMP,'"+ tags +"')";
            // console.log(sql6);
            mysqlconnection.query(sql6,function(err,data){
                if(!err){
                    if(url[0] != ''){
                        for(var i = 0 ;i<url.length;i++){
                            var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + data.insertId + "','" + url[i] + "')";
                            mysqlconnection.query(sql,function(err,video){});
                        }
                    }
                    res.redirect('add-news');
                }
            });
        } else {
            var a = [];
            if(req.files.images[0] == undefined){
                a.push(req.files.images);
            }else {
                a = req.files.images;
            }
            var sql6 = "INSERT INTO `news` (`user_id`,`state`,`city`,`district`,`title`,`short_description`,`status`,`is_approved`,`description`,`front_image_path`,`created_at`,`tags`) VALUES ('" + admin_id + "','" + state + "','" + city + "','" + district + "','" + title + "','" + short_description + "','" + status + "','" + approved + "','" + description + "','" + a[0].name + "',CURRENT_TIMESTAMP,'"+ tags +"')";
            mysqlconnection.query(sql6,function(err,data){
                if(!err){
                    if(url[0] != ''){
                        for(var i = 0 ;i<url.length;i++){
                            var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + data.insertId + "','" + url[i] + "')";
                            mysqlconnection.query(sql,function(err,video){});
                        }
                    }

                    for(var i = 0 ;i<a.length;i++){
                        var Images = a[i];
                        var new_date = new Date();
                        var new_name = new_date.getTime() + '_user_news.png';
                        a[i].name = new_name;
                        var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
                        var path1 = 'public/images/image_files/'+ imageFiles;
                        Images.mv(path1, function(err){
                            if(err){
                                return console.log(err);
                            }
                        });
                        var sql = "INSERT INTO `images` (`news_id`,`path`) VALUES ('" + data.insertId + "','" + imageFiles + "')";
                        mysqlconnection.query(sql,function(err,img){});
                    }
                    res.redirect('/admin/add-news');
                }
            });
        }
    } else {
        res.render('admin/screens/login', {
            message: 'You are logged out, Please login again',
            messageClass: 'alert-danger'
        });
    }
});

router.get('/edit-news/:news_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2 || req.user.role_id == 3 ){
            var news_id = req.params.news_id;
            var sql = "SELECT * FROM `categories` WHERE `status` = 1 AND `is_state` = 1 AND `name` <> 'NULL'";
            var sql5 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL'";
            var sql2 = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`id` AS c_id,`sub-categories`.`name` AS sc_name,`sub-categories`.`id` AS sc_id FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` WHERE `news`.`news_id` = '" + news_id + "'";
            var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
            var sql3 = "SELECT * FROM `images` WHERE `news_id` = '" + news_id + "'";
            var sql4 = "SELECT * FROM `videos` WHERE `news_id` = '" + news_id + "'";
            var tag = "SELECT * FROM `tags` WHERE `status` = 1";
            mysqlconnection.query(sql,function(err,categories){
                mysqlconnection.query(sql2,function(err,news){
                    mysqlconnection.query(sql3,function(err,images){
                        mysqlconnection.query(sql4,function(err,videos){
                            mysqlconnection.query(sql5,function(err,subcategories){
                                mysqlconnection.query(tag,function(err,tags){
                                    if(!err) {
                                        res.render('admin/screens/edit-news', {
                                            categories: categories,
                                            admin_id: req.user.user_id,
                                            role_id:req.user.role_id,
                                            news: news,
                                            images: images,
                                            videos: videos,
                                            subcategories: subcategories,
                                            tags:tags
                                        });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        } else if(req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/edit-user-news/:news_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2 || req.user.role_id == 3 ){
            var news_id = req.params.news_id;
            var sql = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL'";
            var sql5 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL'";
            var sql2 = "SELECT `news`.* WHERE `news`.`news_id` = '" + news_id + "'";
            var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
            var sql3 = "SELECT * FROM `images` WHERE `news_id` = '" + news_id + "'";
            var sql4 = "SELECT * FROM `videos` WHERE `news_id` = '" + news_id + "'";
            var tag = "SELECT * FROM `tags` WHERE `status` = 1";
            mysqlconnection.query(sql,function(err,categories){
                mysqlconnection.query(sql1,function(err,states){
                    mysqlconnection.query(sql2,function(err,news){
                        mysqlconnection.query(sql3,function(err,images){
                            mysqlconnection.query(sql4,function(err,videos){
                                mysqlconnection.query(sql5,function(err,subcategories){
                                    mysqlconnection.query(tag,function(err,tags){
                                        console.log(news);
                                        var sql6 = "SELECT `cities`.* FROM `cities` INNER JOIN `states` ON `states`.`id` = `cities`.`state_id` WHERE `states`.`name` = '"+ news[0].state +"'";
                                        console.log(sql6);
                                        mysqlconnection.query(sql6,function(err,cities){
                                            // console.log(subcategories);
                                            if(!err) {
                                                res.render('admin/screens/edit-news', {
                                                    categories: categories,
                                                    admin_id: req.user.user_id,
                                                    role_id:req.user.role_id,
                                                    states: states,
                                                    news: news,
                                                    images: images,
                                                    videos: videos,
                                                    subcategories: subcategories,
                                                    cities:cities,
                                                    tags:tags
                                                });
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        } else if(req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/edit-news/:news_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        var news_id = req.params.news_id;
        var state = req.body.c;
        var city = req.body.sc;
        var district = req.body.district;
        // var state = req.body.state;
        // var city = req.body.city;
        var title = req.body.title;
        var status = 1;
        var short_description = req.body.sd;
        var description = req.body.ta;
        var u = req.body.url;
        var tags = req.body.tags;
        var url = [];
        if(typeof u == "string"){
            url.push(u);
        } else {
            url = u;
        }
        if(req.files == null){
            var sql6 = "UPDATE `news` SET `district` = '"+district+"',`state` = '"+state+"',`city` = '"+city+"',`title` = '"+title+"',`status` = '"+status+"',`short_description` = '"+short_description+"',`description` = '"+description+"', `tags` = '"+ tags +"' WHERE `news_id` = '"+news_id+"'";
            mysqlconnection.query(sql6,function(err,data){
                if(!err){
                    if(url[0] != ''){
                        for(var i = 0 ;i<url.length;i++){
                            var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + news_id + "','" + url[i] + "')";
                            mysqlconnection.query(sql,function(err,video){});
                        }
                    }
                    res.redirect('/admin/edit-news/'+ news_id);
                }
            });
        } else {
            var a = [];
            if(req.files.images[0] == undefined){
                a.push(req.files.images);
            }else {
                a = req.files.images;
            }
            var sql6 = "UPDATE `news` SET `district` = '"+district+"',`state` = '"+state+"',`city` = '"+city+"',`title` = '"+title+"',`status` = '"+status+"',`short_description` = '"+short_description+"',`description` = '"+description+"',`front_image_path` = '"+a[0].name+"', `tags` = '"+ tags +"' WHERE `news_id` = '"+news_id+"'";
            mysqlconnection.query(sql6,function(err,data){
                if(!err){
                    // fs.mkdirp('public/images/news_files/' + news_id, function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    //
                    // fs.mkdirp('public/images/news_files/' + news_id  + '/gallery', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    //
                    // fs.mkdirp('public/images/news_files/' + news_id + '/gallery/thumbs', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });

                    if(url[0] != ''){
                        for(var i = 0 ;i<url.length;i++){
                            var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + news_id + "','" + url[i] + "')";
                            mysqlconnection.query(sql,function(err,video){});
                        }
                    }

                    for(var i = 0 ;i<a.length;i++){
                        var Images = a[i];
                        var new_image_name = new Date().getTime() + `_news${i}.png`;
                        (a)[i].name = new_image_name;
                        var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
                        // fs.mkdirp('public/images/image_files/' + news_id , function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });
                        // fs.mkdirp('public/images/image_files/' + news_id + '/gallery', function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });
                        // fs.mkdirp('public/images/image_files/' + news_id + '/gallery/thumbs', function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });
                        var path1 = 'public/images/image_files/' + imageFiles;
                        Images.mv(path1, function(err){
                            if(err){
                                return console.log(err);
                            }
                        });
                        var sql = "INSERT INTO `images` (`news_id`,`path`) VALUES ('" + news_id + "','" + imageFiles + "')";
                        mysqlconnection.query(sql,function(err,img){});
                    }
                    // var Image = a[0];
                    // var path = 'public/images/news_files/'+ news_id + '/' + a[0].name;
                    // Image.mv(path, function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    res.redirect('/admin/edit-news/' + news_id);
                }
            });
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-image/:news_id/:path/:image_id', function(req, res, next){
    if (req.user && res.statusCode == 200) {
        var news_id = req.params.news_id;
        var image_id = req.params.image_id;
        var path = req.params.path;
        // var sql3 = "SELECT `front_image_path` FROM `news` WHERE `news_id` = '"+news_id+"' AND `front_image_path` = '"+path+"'";
        // mysqlconnection.query(sql3,function(err,data){
        //     if(data.length !=0){
        //         var p1 = 'public/images/news_files/' + news_id +'/'+path;
        //         fs.unlink(p1, function (err) {
        //             if (err) throw err;
        //         });
        //         var sql2 = "UPDATE `news` SET `front_image_path` = NULL WHERE `news_id`='"+news_id+"'";
        //         mysqlconnection.query(sql2,function(err,news){
        //         });
        //     }
        // });
        var p = 'public/images/image_files/' + path;

        fs.unlink(p, function (err) {
            if (err) throw err;
        });

        var sql = "DELETE FROM `images` WHERE  image_id ='"+image_id+"'";
        var sql2 = "UPDATE `news` SET `front_image_path` = NULL WHERE `news_id`='"+news_id+"'";
            
        mysqlconnection.query(sql,function(err,news){
            mysqlconnection.query(sql2,function(err,news1){
                res.redirect('/admin/edit-news/' + news_id);
            });
        });
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-video/:news_id/:video_id', function(req, res, next){
    if (req.user && res.statusCode == 200) {
        var news_id = req.params.news_id;
        var video_id = req.params.video_id;
        var sql = "DELETE FROM `videos` WHERE  id ='"+video_id+"'";
        mysqlconnection.query(sql,function(err,news){
            res.redirect('/admin/edit-news/' + news_id);
        });
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});



router.get('/delete-news/:news_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var news_id = req.params.news_id;

            var sql = "UPDATE `news` SET `status` = 0 WHERE `news_id` = '"+news_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/news');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/add-dcategory', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT * FROM `dcategory` WHERE `status` = 1";
            mysqlconnection.query(sql,function(err,categories){
                if(!err){
                    res.render('admin/screens/add-dcategory',{
                        categories:categories,
                        role_id:req.user.role_id
                    });
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/forms', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT `dcategory`.* FROM `dcategory` LEFT OUTER JOIN `form_fields` ON `form_fields`.`category_name` = `dcategory`.`name` WHERE `form_fields`.`category_name` IS NULL AND `status` = 1";
            var sql1 = "SELECT * FROM `form_fields`";
            mysqlconnection.query(sql,function(err,categories){
                mysqlconnection.query(sql1,function(err,forms){
                    if(!err){
                        res.render('admin/screens/forms',{
                            categories:categories,
                            forms:forms,
                            role_id:req.user.role_id
                        });
                    }
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/posts', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT * FROM `dcategory` WHERE `status` = 1";
            var sql1 = "SELECT * FROM `user_post` WHERE `status` = 1 ORDER BY `id` DESC";
            var sql2 = "SELECT * FROM `dimages`";
            mysqlconnection.query(sql,function(err,categories){
                mysqlconnection.query(sql1,function(err,user_post){
                    mysqlconnection.query(sql2,function(err,post_images){
                        if(categories != undefined){
                            res.render('admin/screens/user_post',{
                                user_post:user_post,
                                role_id:req.user.role_id,
                                categories:categories,
                                post_images:post_images
                            });
                        } else {
                            res.send('Database Not Connected');
                        }
                    });
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message: 'Logged out! Please login again',
            messageClass: 'alert-danger'
        });
    }
});

router.get('/form-preview/:id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var id = req.params.id;
            var sql1 = "SELECT * FROM `form_fields` WHERE `id` = '"+id+"'";
            mysqlconnection.query(sql1,function(err,forms){
                if(!err){
                    res.render('admin/screens/form_preview',{
                        forms:forms,
                        role_id:req.user.role_id
                    });
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/edit-form/:id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var id = req.params.id;
            var sql1 = "SELECT * FROM `form_fields` WHERE `id` = '"+id+"'";
            mysqlconnection.query(sql1,function(err,forms){
                if(!err){
                    res.render('admin/screens/form_edit',{
                        forms:forms,
                        role_id:req.user.role_id,
                        id:id
                    });
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-form/:id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var id = req.params.id;
            var sql1 = "DELETE FROM `form_fields` WHERE `id` = '"+id+"'";
            mysqlconnection.query(sql1,function(err,forms){
                if(!err){
                    res.redirect('/admin/forms');
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-post/:id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var id = req.params.id;
            var sql1 = "UPDATE `user_post` SET `status` = 0 WHERE `id` = '"+id+"'";
            mysqlconnection.query(sql1,function(err,forms){
                if(!err){
                    res.redirect('/admin/posts');
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/edit-form/:id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var id = req.params.id;
            const {ad_title,description,price,phone_number,address,brand,year,fuel,transmission,km_driven,no_of_owners,type,property,bedroom,bathroom,furnishing,construction_status,listed_by,area,total_floors,floor_no,car_parking,company_role,facing,name,bachelors_allowed,salary_period,position_type,salary_from,salary_to,appliances,furniture,fashion} = req.body;

            // console.log(category_name);
            var sql6 = "UPDATE `form_fields` SET `ad_title` = '"+ad_title+"',`description` = '"+description+"',`price` = '"+price+"',`phone_number` = '"+phone_number+"',`address` = '"+address+"',`brand` = '"+brand+"',`year` = '"+year+"',`fuel` = '"+fuel+"',`transmission` = '"+transmission+"',`km_driven` = '"+km_driven+"',`no_of_owners` = '"+no_of_owners+"',`type` = '"+type+"',`property` = '"+property+"',`bedroom` = '"+bedroom+"',`bathroom` = '"+bathroom+"',`furnishing` = '"+furnishing+"',`construction_status` = '"+construction_status+"',`listed_by` = '"+listed_by+"',`area` = '"+area+"',`total_floors` = '"+total_floors+"',`floor_no` = '"+floor_no+"',`car_parking` = '"+car_parking+"',`company_role` = '"+company_role+"',`facing` = '"+facing+"',`name` = '"+name+"',`bachelors_allowed` = '"+bachelors_allowed+"',`salary_period` = '"+salary_period+"',`position_type` = '"+position_type+"',`salary_from` = '"+salary_from+"',`salary_to` = '"+salary_to+"',`appliances` = '"+appliances+"',`furniture` = '"+furniture+"',`fashion` = '"+fashion+"' WHERE `id` = '"+id+"'";
            // console.log(sql6);
            mysqlconnection.query(sql6,function(err,data){
                if(!err){
                    res.redirect('/admin/edit-form/' + id);
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/forms', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            const {category_name,ad_title,description,price,phone_number,address,brand,year,fuel,transmission,km_driven,no_of_owners,type,property,bedroom,bathroom,furnishing,construction_status,listed_by,area,total_floors,floor_no,car_parking,company_role,facing,name,bachelors_allowed,salary_period,position_type,salary_from,salary_to,appliances,furniture,fashion} = req.body;

            // console.log(category_name);
            var sql6 = "INSERT INTO `form_fields` (`category_name`,`ad_title`,`description`,`price`,`phone_number`,`address`,`brand`,`year`,`fuel`,`transmission`,`km_driven`,`no_of_owners`,`type`,`property`,`bedroom`,`bathroom`,`furnishing`,`construction_status`,`listed_by`,`area`,`total_floors`,`floor_no`,`car_parking`,`company_role`,`facing`,`name`,`bachelors_allowed`,`salary_period`,`position_type`,`salary_from`,`salary_to`,`appliances`,`furniture`,`fashion`) VALUES ('"+category_name+"','"+ad_title+"','"+description+"','"+price+"','"+phone_number+"','"+address+"','"+brand+"','"+year+"','"+fuel+"','"+transmission+"','"+km_driven+"','"+no_of_owners+"','"+type+"','"+property+"','"+bedroom+"','"+bathroom+"','"+furnishing+"','"+construction_status+"','"+listed_by+"','"+area+"','"+total_floors+"','"+floor_no+"','"+car_parking+"','"+company_role+"','"+facing+"','"+name+"','"+bachelors_allowed+"','"+salary_period+"','"+position_type+"','"+salary_from+"','"+salary_to+"','"+appliances+"','"+furniture+"','"+fashion+"')";
            // console.log(sql6);
            mysqlconnection.query(sql6,function(err,data){
                if(!err){
                    res.redirect('/admin/forms');
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});


router.post('/add-dcategory', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category=req.body.category;

            var sql6 = "INSERT INTO `dcategory` (`name`) VALUES ('" + category + "')";
            mysqlconnection.query(sql6,function(err,data){
                if(!err){
                    res.redirect('/admin/add-dcategory');
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});


router.get('/delete-dcategory/:category_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category_id = req.params.category_id;

            var sql = "UPDATE `dcategory` SET `status` = 0 WHERE `id` = '"+category_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/add-dcategory');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/categories', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' AND `is_state` = 1 ORDER BY `order`";
            var sql1 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL'";
            mysqlconnection.query(sql,function(err,categories){
                mysqlconnection.query(sql1,function(err,sub_categories){
                    if(!err){
                        res.render('admin/screens/categories',{
                            categories:categories,
                            sub_categories:sub_categories,
                            role_id:req.user.role_id
                        });
                    }
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/add-category', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT * FROM `categories` WHERE `status` = 1";
            var state = "SELECT * FROM `categories` WHERE `status` = 1 AND `is_state` = 1";
            mysqlconnection.query(sql,function(err,categories){
                mysqlconnection.query(state,function(err,state){
                        if(!err){
                            res.render('admin/screens/add-category',{
                                categories:categories,
                                role_id:req.user.role_id,
                                state:state,
                            });
                        }
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});


router.get('/getDistrict/:category_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category_id = req.params.category_id;
            var district = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` NOT LIKE '%(%' AND `category_id` = '"+ category_id +"'";
            mysqlconnection.query(district,function(err,district) {
                res.jsonp(district);
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/searchTehsil/:district', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var district = req.params.district;
            var tehsil = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` LIKE '"+ ( '%' + district + '%' ) +"'";
            mysqlconnection.query(tehsil,function(err,tehsil) {
                res.jsonp(tehsil);
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/add-tehsil', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var c=req.body.state;
            var district=req.body.district;
            var tehsil=req.body.tehsil;
            var subcategory = tehsil + '(' + district + ')';
            var sql6 = "INSERT INTO `sub-categories` (`name`,`category_id`) VALUES ('" + subcategory + "','" + c + "')";
            mysqlconnection.query(sql6,function(err,data){
                if(!err){
                    res.redirect('/admin/add-category');
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-category/:category_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category_id = req.params.category_id;
            var sql = "UPDATE `categories` SET `status` = 0 WHERE `id` = '"+category_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/categories');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/edit-category/:category_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category_id = req.params.category_id;
            var name = req.body.c_name;
            var headingColor = req.body.headingColor;
            var is_state = req.body.is_state;
            // console.log(is_state);

            if(is_state == undefined){
                var sql = "UPDATE `categories` SET `name` = '"+name+"',`headingColor` = '"+headingColor+"',`is_state` = 0  WHERE `id` = '"+category_id+"'";
            } else if(is_state == 1){
                var sql = "UPDATE `categories` SET `name` = '"+name+"',`headingColor` = '"+headingColor+"',`is_state` = 1  WHERE `id` = '"+category_id+"'";
            }

            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/categories');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/edit-sub-category/:category_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category_id = req.params.category_id;
            var name = req.body.sc_name;
            var sql = "UPDATE `sub-categories` SET `name` = '"+name+"' WHERE `id` = '"+category_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/categories');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-sub-category/:category_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category_id = req.params.category_id;
            // console.log(category_id);
            var sql = "UPDATE `sub-categories` SET `status` = 0 WHERE `id` = '"+category_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/categories');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/add-new-category', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category=req.body.category;
            var headingColor = '#000000';
            var order;
            var is_state = 1;
            // console.log(is_state);

            var sql1 = "SELECT * FROM `categories` ORDER BY `id` DESC LIMIT 1 OFFSET 0";
            mysqlconnection.query(sql1,function(err,data){
                if(!err){
                    order = data[0].id + 1;
                    if(is_state == undefined){
                        var sql = "INSERT INTO `categories` (`name`,`headingColor`,`order`) VALUES ('" + category + "','" + headingColor + "','" + order + "')";
                    } else if(is_state == 1){
                        var sql = "INSERT INTO `categories` (`name`,`headingColor`,`order`,`is_state`) VALUES ('" + category + "','" + headingColor + "','" + order + "','" + is_state + "')";
                    }
                    mysqlconnection.query(sql,function(err,data){
                        if(!err){
                            res.redirect('/admin/add-category');
                        }
                    });
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/add-sub-category', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var subcategory=req.body.subcategory;
            var c=req.body.c;
            var sql6 = "INSERT INTO `sub-categories` (`name`,`category_id`) VALUES ('" + subcategory + "','" + c + "')";
            mysqlconnection.query(sql6,function(err,data){
                if(!err){
                    res.redirect('/admin/add-category');
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});


/* GET home page. */
router.get('/news', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name,`users`.`full_name` AS u_name,`categories`.`headingColor` AS hcolor FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `news`.`user_id` = '" + req.user.user_id + "' AND `news`.`status` = '1' AND `news`.`is_approved` = 1 ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
        mysqlconnection.query(sql,function(err,news){
            // console.log(news);
            res.render('admin/screens/news',{
                role_id:req.user.role_id,
                news:news,
                user:'my',
                is_approved:1
            });
        });
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

/* GET home page. */
router.get('/news/not-approved', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name,`users`.`full_name` AS u_name,`categories`.`headingColor` AS hcolor FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `news`.`user_id` = '" + req.user.user_id + "' AND `news`.`status` = '1' AND `news`.`is_approved` = 0 ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
        mysqlconnection.query(sql,function(err,news){
            // console.log(news);
            res.render('admin/screens/news',{
                role_id:req.user.role_id,
                news:news,
                user:'my',
                is_approved:0
            });
        });
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/admin-news', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name ,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 2 AND `news`.`status` = '1' AND `news`.`is_approved` = 1 ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
            mysqlconnection.query(sql,function(err,news){
                res.render('admin/screens/news',{
                    role_id:req.user.role_id,
                    news:news,
                    user:'admin',
                    is_approved:1
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/admin-news/not-approved', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name ,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 2 AND `news`.`status` = '1' AND `news`.`is_approved` = 0 ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
            mysqlconnection.query(sql,function(err,news){
                res.render('admin/screens/news',{
                    role_id:req.user.role_id,
                    news:news,
                    user:'admin',
                    is_approved:0
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/reporter-news', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            if(req.user.role_id == 1){
                var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name, `users`.`role_id` AS role,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 3 AND `news`.`status` = '1' AND `news`.`is_approved` = 1 ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
            } else {
                var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 3 AND `news`.`status` = '1' AND `users`.`created_by` = '"+req.user.user_id+"' AND `news`.`is_approved` = 1 ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
            }
            mysqlconnection.query(sql,function(err,news){
                res.render('admin/screens/news',{
                    role_id:req.user.role_id,
                    news:news,
                    user:'reporter',
                    is_approved:1
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/reporter-news/not-approved', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            if(req.user.role_id == 1){
                var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name, `users`.`role_id` AS role,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 3 AND `news`.`status` = '1' AND `news`.`is_approved` = 0 ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
            } else {
                var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 3 AND `news`.`status` = '1' AND `users`.`created_by` = '"+req.user.user_id+"' AND `news`.`is_approved` = 0 ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
            }
            mysqlconnection.query(sql,function(err,news){
                res.render('admin/screens/news',{
                    role_id:req.user.role_id,
                    news:news,
                    user:'reporter',
                    is_approved:0
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/user-news', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT `news`.*, `users`.`full_name` AS u_name FROM `news` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 4 AND `news`.`status` = '1' AND `news`.`is_approved` = 1 ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
            mysqlconnection.query(sql,function(err,news){
                res.render('admin/screens/news',{
                    role_id:req.user.role_id,
                    news:news,
                    user:'user',
                    is_approved:1
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/user-news/not-approved', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT `news`.*, `users`.`full_name` AS u_name FROM `news` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 4 AND `news`.`status` = '1' AND `news`.`is_approved` = 0 ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET 0";
            mysqlconnection.query(sql,function(err,news){
                res.render('admin/screens/news',{
                    role_id:req.user.role_id,
                    news:news,
                    user:'user',
                    is_approved:0
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});


router.get('/getMoreNews/:user/:is_approved/:offset', function(req, res, next) {
    var user = req.params.user;
    var is_approved = req.params.is_approved;
    var offset = req.params.offset;
    if(user == 'my') {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name,`users`.`full_name` AS u_name,`categories`.`headingColor` AS hcolor FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `news`.`user_id` = '" + req.user.user_id + "' AND `news`.`status` = '1' AND `news`.`is_approved` = '"+ is_approved +"' ORDER By `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
    } else if(user == 'reporter') {
        if(req.user.role_id == 1){
            var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name, `users`.`role_id` AS role,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 3 AND `news`.`status` = '1' AND `news`.`is_approved` = '"+ is_approved +"' ORDER By `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
        } else {
            var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 3 AND `news`.`status` = '1' AND `users`.`created_by` = '"+req.user.user_id+"' AND `news`.`is_approved` = '"+ is_approved +"' ORDER By `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
        }
    } else if(user == 'admin') {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name ,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 2 AND `news`.`status` = '1' AND `news`.`is_approved` = '"+ is_approved +"' ORDER By `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
    } else if(user == 'user') {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name ,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 4 AND `news`.`status` = '1' AND `news`.`is_approved` = '"+ is_approved +"' ORDER By `news`.`news_id` DESC LIMIT 5 OFFSET "+ offset +"";
    }
    mysqlconnection.query(sql,function(err,data){
        console.log(err);
        res.jsonp(data);
    });
});


router.get('/users', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            if(req.user.role_id == 1){
                var sql = "SELECT * FROM `users` WHERE `status` = 1 ORDER By `user_id` DESC";
            } else {
                var sql = "SELECT * FROM `users` WHERE `status` = 1 AND `created_by` = '"+req.user.user_id+"' ORDER By `user_id` DESC";
            }
            var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
            mysqlconnection.query(sql,function(err,users){
                mysqlconnection.query(sql1,function(err,states){
                    res.render('admin/screens/user',{
                        role_id:req.user.role_id,
                        users:users,
                        states:states
                    });
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/ads', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql3 = "SELECT `ads`.*,`users`.`name` AS u_name FROM `ads` INNER JOIN `users` ON `users`.`user_id` = `ads`.`user_id` WHERE `ads`.`status` = 1 ORDER BY `order`";
            var order = "SELECT `order` FROM `slider` ORDER BY `order` DESC LIMIT 1 OFFSET 0";
            mysqlconnection.query(sql3,function(err,ads){
                mysqlconnection.query(order,function(err,order){
                    if(!err){
                        res.render('admin/screens/ads',{
                            role_id:req.user.role_id,
                            ads:ads,
                            admin_id: req.user.user_id,
                            order:order
                        });
                    }
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/tags', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql3 = "SELECT * FROM `tags` WHERE `status` = 1";
            mysqlconnection.query(sql3,function(err,tags){
                if(!err){
                    res.render('admin/screens/tags',{
                        role_id:req.user.role_id,
                        tags:tags,
                        admin_id: req.user.user_id
                    });
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/slider', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql3 = "SELECT `slider`.*,`users`.`name` AS u_name, `categories`.`name` AS c_name FROM `slider` INNER JOIN `users` ON `users`.`user_id` = `slider`.`user_id` INNER JOIN `categories` ON `categories`.`id` = `slider`.`state` WHERE `slider`.`status` = 1 ORDER BY `order`";
            var sql1 = "SELECT * FROM `categories` WHERE `status` = 1 AND `is_state` = 1";
            var order = "SELECT `order` FROM `slider` ORDER BY `order` DESC LIMIT 1 OFFSET 0";
            mysqlconnection.query(sql3,function(err,slider){
                mysqlconnection.query(sql1,function(err,states){
                    mysqlconnection.query(order,function(err,order){
                        console.log(order);
                        if(!err){
                            res.render('admin/screens/slider',{
                                role_id:req.user.role_id,
                                slider:slider,
                                admin_id: req.user.user_id,
                                states:states,
                                order:order
                            });
                        }
                    });
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/add-ads-images', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var admin_id = req.body.admin_id;
            var order = req.body.order;
            var a = [];

            if(req.files.images[0] == undefined){
                a.push(req.files.images);
            }else {
                a = req.files.images;
            }

            for(var i = 0 ;i<a.length;i++){
                var Images = a[i];
                var new_name_image = new Date().getTime() + `_ads${i}.png`;
                (a)[i].name = new_name_image;
                var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
                // fs.mkdirp('public/images/ads_images/' , function(err){
                //     if(err){
                //         return console.log(err);
                //     }
                // });
                // fs.mkdirp('public/images/ads_images/gallery', function(err){
                //     if(err){
                //         return console.log(err);
                //     }
                // });

                // fs.mkdirp('public/images/ads_images/gallery/thumbs', function(err){
                //     if(err){
                //         return console.log(err);
                //     }
                // });
                var path1 = 'public/images/ads_images/' + imageFiles;
                Images.mv(path1, function(err){
                    if(err){
                        return console.log(err);
                    }
                });
                if(order != '-Infinity'){
                    var b = parseInt(order)+1 + i;
                } else {
                    var b = 0;
                }
                var sql = "INSERT INTO `ads` (`image_path`,`order`,`user_id`) VALUES ('" + imageFiles + "','" + b + "','" + admin_id + "')";
                console.log(sql);
                mysqlconnection.query(sql,function(err,img){
                });
            }
            res.redirect('/admin/ads');
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/add-slider-images', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var admin_id = req.body.admin_id;
            var order = req.body.order;
            // var category = req.body.category;
            var category = 'main';
            var state = req.body.state;
            var city = req.body.city;

            var b = [];

            var a = [];

            if(req.files.images[0] == undefined){
                a.push(req.files.images);
            }else {
                a = req.files.images;
            }

            if(city == undefined){
                for(var i = 0 ;i<a.length;i++){
                    var Images = a[i];
                    var new_name_image = new Date().getTime() + `_slider${i}.png`;
                    (a)[i].name = new_name_image;
                    var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
                    // fs.mkdirp('public/images/slider_images/' , function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    // fs.mkdirp('public/images/slider_images/gallery', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });

                    // fs.mkdirp('public/images/slider_images/gallery/thumbs', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    var path1 = 'public/images/slider_images/' + imageFiles;
                    Images.mv(path1, function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    var b = parseInt(order)+1 + i;
                    var sql = "INSERT INTO `slider` (`image_path`,`order`,`user_id`,`category`,`state`) VALUES ('" + imageFiles + "','" + b + "','" + admin_id + "','" + category + "','"+ state +"')";
                    mysqlconnection.query(sql,function(err,img){
                        console.log(err);
                    });
                }
            } else if( typeof city == 'string'){
                b.push(city);
                var new_obj = {
                    city:b,
                }
                var parsedString = JSON.stringify(new_obj);
                for(var i = 0 ;i<a.length;i++){
                    var Images = a[i];
                    var new_name_image = new Date().getTime() + `_slider${i}.png`;
                    (a)[i].name = new_name_image;
                    var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
                    // fs.mkdirp('public/images/slider_images/' , function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    // fs.mkdirp('public/images/slider_images/gallery', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });

                    // fs.mkdirp('public/images/slider_images/gallery/thumbs', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    var path1 = 'public/images/slider_images/' + imageFiles;
                    Images.mv(path1, function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    var b = parseInt(order)+1 + i;
                    var sql = "INSERT INTO `slider` (`image_path`,`order`,`user_id`,`category`,`state`,`city`) VALUES ('" + imageFiles + "','" + b + "','" + admin_id + "','" + category + "','"+ state +"','"+ parsedString +"')";
                    mysqlconnection.query(sql,function(err,img){
                    });
                }
            } else {
                b=city;
                var new_obj = {
                    city:b,
                }
                var parsedString = JSON.stringify(new_obj);
                for(var i = 0 ;i<a.length;i++){
                    var Images = a[i];
                    var new_name_image = new Date().getTime() + `_slider${i}.png`;
                    (a)[i].name = new_name_image;
                    var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
                    // fs.mkdirp('public/images/slider_images/' , function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    // fs.mkdirp('public/images/slider_images/gallery', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });

                    // fs.mkdirp('public/images/slider_images/gallery/thumbs', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    var path1 = 'public/images/slider_images/' + imageFiles;
                    Images.mv(path1, function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    var b = parseInt(order)+1 + i;
                    var sql = "INSERT INTO `slider` (`image_path`,`order`,`user_id`,`category`,`state`,`city`) VALUES ('" + imageFiles + "','" + b + "','" + admin_id + "','" + category + "','"+ state +"','"+ parsedString +"')";
                    mysqlconnection.query(sql,function(err,img){
                    });
                }
            }
            res.redirect('/admin/slider');
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/add-Tag', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var name = req.body.tagname;

            var new_name = new Date().getTime() + '_tagname.png';

            req.files.images.name = new_name;
            var Images = req.files.images;
            var imageFiles = typeof req.files.images.name !=="undefined" ? req.files.images.name : "" ;
            var path1 = 'public/images/tag/' + imageFiles;
            Images.mv(path1, function(err){
                if(err){
                    return console.log(err);
                }
            });
            var sql = "INSERT INTO `tags` (`image`,`name`) VALUES ('" + imageFiles + "','" + name + "')";
            mysqlconnection.query(sql,function(err,img){
                console.log(err);
                if(!err){
                    res.redirect('/admin/tags');
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/edit-slider/:slider_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var slider_id = req.params.slider_id;
            // var category = req.body.category;
            var category = 'main';
            var city = req.body.city;
            var state = req.body.state;

            var b = [];

            var a = [];

            if(city == undefined){
                var sql = "UPDATE `slider` SET `category` = '"+category+"', `state` = '"+ state +"',`city` = NULL WHERE slider_id = '" + slider_id + "'";
                mysqlconnection.query(sql,function(err,data){
                    // res.jsonp(data);
                });
            } else if( typeof city == 'string'){
                b.push(city);
                var new_obj = {
                    city:b,
                }
                var parsedString = JSON.stringify(new_obj);
                var sql = "UPDATE `slider` SET `category` = '"+category+"', `state` = '"+ state +"',`city` = '"+ parsedString +"' WHERE slider_id = '" + slider_id + "'";
                mysqlconnection.query(sql,function(err,data){
                    // res.jsonp(data);
                });
            } else {
                b=city;
                var new_obj = {
                    city:b,
                }
                var parsedString = JSON.stringify(new_obj);
                var sql = "UPDATE `slider` SET `category` = '"+category+"', `state` = '"+ state +"',`city` = '"+ parsedString +"' WHERE slider_id = '" + slider_id + "'";
                mysqlconnection.query(sql,function(err,data){
                    // res.jsonp(data);
                });
            }

            res.redirect('/admin/slider');
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/change-ads-order', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var n_order=req.body.n_order;
            var ads_id=req.body.ads_id;
            var a = [];
            var b = [];
            if(n_order[0] == undefined && slider_id[0] == undefined){
                a.push(n_order);
                b.push(ads_id);
            } else {
                a = n_order;
                b = ads_id;
            }
            for(var i = 0;i<b.length;i++){
                var sql = "UPDATE `ads` SET `order` = '"+a[i]+"' WHERE `ads_id` = '"+b[i]+"'";
                mysqlconnection.query(sql,function(err,data) {
                });
            }
            res.redirect('/admin/ads');
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/change-order', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var n_order=req.body.n_order;
            var slider_id=req.body.slider_id;
            var a = [];
            var b = [];
            if(n_order[0] == undefined && slider_id[0] == undefined){
                a.push(n_order);
                b.push(slider_id);
            } else {
                a = n_order;
                b = slider_id;
            }
            for(var i = 0;i<b.length;i++){
                var sql = "UPDATE `slider` SET `order` = '"+a[i]+"' WHERE `slider_id` = '"+b[i]+"'";
                mysqlconnection.query(sql,function(err,data) {
                });
            }
            res.redirect('/admin/slider');
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-slider/:slider_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var slider_id = req.params.slider_id;

            var sql = "UPDATE `slider` SET `status` = 0 WHERE `slider_id` = '"+slider_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/slider');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-ads/:ads_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var ads_id = req.params.ads_id;

            var sql = "UPDATE `ads` SET `status` = 0 WHERE `ads_id` = '"+ads_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/ads');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-tags/:tags_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var tags_id = req.params.tags_id;

            var sql = "UPDATE `tags` SET `status` = 0 WHERE `id` = '"+tags_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/tags');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/add-user', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT * FROM `role`";
            // var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
            var sql1 = "SELECT * FROM `categories` WHERE `status` = 1 AND `is_state` = 1";
            mysqlconnection.query(sql,function(err,role){
                mysqlconnection.query(sql1,function(err,states){
                    res.render('admin/screens/add-user',{
                        role_id:req.user.role_id,
                        role:role,
                        states:states,
                        admin_id: req.user.user_id
                    });
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/add-user', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var username=req.body.username;
            var full_name=req.body.full_name;
            var password=getHashedPassword(req.body.password);
            var city=req.body.city;
            var role=req.body.role;
            var admin_id = req.body.admin_id;
            var is_approved = 1;
            if(role == 2){
                // var auto_approved = 1;
                var sql6 = "INSERT INTO `users` (`name`,`full_name`, `password`,`phone`,`is_approved`, `city`, `role_id`,`created_by`,`auto_approved`) VALUES ('" + username + "', '" + full_name + "' ,'" + password + "' ,'" + username + "' ,'" + is_approved + "' , '" + city + "', '" + role + "', '" + admin_id + "',1)";
            } else {
                // var auto_approved = 0;
                var sql6 = "INSERT INTO `users` (`name`,`full_name`, `password`,`phone`,`is_approved`, `city`, `role_id`,`created_by`) VALUES ('" + username + "', '" + full_name + "' ,'" + password + "' ,'" + username + "' ,'" + is_approved + "' , '" + city + "', '" + role + "', '" + admin_id + "')";
            }

            // console.log(auto_approved);

            // console.log(sql6);
            mysqlconnection.query(sql6,function(err,data){
                // console.log(data);
                if(!err){
                    if(req.files != null) {
                        if(req.files.images != undefined){
                            var new_name_image = new Date().getTime() + `_user.png`;
                            req.files.images.name = new_name_image;
                            var imageFile = typeof req.files.images.name !=="undefined" ? req.files.images.name : "" ;
                            // fs.mkdirp('public/images/user_profile/photo/' + data.insertId, function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });

                            // fs.mkdirp('public/images/user_profile/photo/' + data.insertId  + '/gallery', function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });

                            // fs.mkdirp('public/images/user_profile/photo/' + data.insertId + '/gallery/thumbs', function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });
                            var Image = req.files.images;
                            var path = 'public/images/user_profile/photo/'+ imageFile;
                            Image.mv(path, function(err){
                                if(err){
                                    return console.log(err);
                                }
                            });
                            var sql = "INSERT INTO `user_profile` (`user_id`,`image`) VALUES ('" + data.insertId + "','" + imageFile + "')";
                            mysqlconnection.query(sql,function(err,img){});
                        }
                        if(req.files.document != undefined){
                            var new_name_image1 = new Date().getTime() + `_user.png`;
                            req.files.document.name = new_name_image1;
                            var documentFile = typeof req.files.document.name !=="undefined" ? req.files.document.name : "" ;
                            // fs.mkdirp('public/images/user_profile/document/' + data.insertId, function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });

                            // fs.mkdirp('public/images/user_profile/document/' + data.insertId  + '/gallery', function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });

                            // fs.mkdirp('public/images/user_profile/document/' + data.insertId + '/gallery/thumbs', function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });
                            var Document = req.files.document;
                            var path = 'public/images/user_profile/document/'+ documentFile;
                            Document.mv(path, function(err){
                                if(err){
                                    return console.log(err);
                                }
                            });
                            var sql1 = "INSERT INTO `user_profile` (`user_id`,`document`) VALUES ('" + data.insertId + "','" + documentFile + "')";
                            mysqlconnection.query(sql1,function(err,document){});
                        }
                    } else {
                        var sql9 = "INSERT INTO `user_profile` (`user_id`) VALUES ('" + data.insertId + "')";
                        mysqlconnection.query(sql9,function(err,sql9){
                            // console.log(users1);
                        });
                    }
                    res.redirect('/admin/add-user');
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-user/:user_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var user_id = req.params.user_id;
            var sql = "UPDATE `users` SET `status` = 0 WHERE `user_id` = '"+user_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/users');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/edit-user/:user_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        var admin_id = req.params.user_id;
        var sql = "SELECT * FROM `users` WHERE `user_id` = '"+admin_id+"'";
        var sql2 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+admin_id+"'";
        var sql1 = "SELECT * FROM `logo` WHERE `user_id` = '"+admin_id+"'";
        // var sql3 = "SELECT * FROM `states` WHERE `country_id` = 101";
        var sql3 = "SELECT * FROM `categories` WHERE `status` = 1 AND `is_state` = 1";
        mysqlconnection.query(sql,function(err,users){
            mysqlconnection.query(sql1,function(err,logo){
                mysqlconnection.query(sql2,function(err,user_profile){
                    mysqlconnection.query(sql3,function(err,states){
                        if(!err){
                            res.render('admin/screens/edit-user',{
                                users:users,
                                admin_id:admin_id,
                                role_id:req.user.role_id,
                                logo:logo,
                                user_profile:user_profile,
                                states:states
                            });
                        }
                    });
                });
            });
        });
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/edit-user/:user_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        var admin_id = req.body.admin_id;
        var nickname = req.body.nickname;
        var username = req.body.username;
        var role_id = req.body.role;
        var city = req.body.city;
        var full_name = req.body.full_name;
        var father_name = req.body.father_name;
        var address = req.body.address;
        var phone = req.body.phone;
        var np = req.body.np;
        if(np != ''){
            np = getHashedPassword(np);
            var sql6 = "UPDATE `users` SET name = '"+username+"',password = '"+np+"',nickname = '"+nickname+"',full_name = '"+full_name+"',father_name = '"+father_name+"',address = '"+address+"',phone = '"+phone+"',role_id = '"+role_id+"',city = '"+city+"' WHERE user_id = '"+admin_id+"'";
            mysqlconnection.query(sql6,function(err,user){
            });
        } else {
            var sql6 = "UPDATE `users` SET name = '"+username+"',nickname = '"+nickname+"',full_name = '"+full_name+"',father_name = '"+father_name+"',address = '"+address+"',phone = '"+phone+"',role_id = '"+role_id+"',city = '"+city+"' WHERE user_id = '"+admin_id+"'";
            mysqlconnection.query(sql6,function(err,user){
            });
        }
        if(req.files != null){
            if(req.files.profileImage != undefined){
                var sql2 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+admin_id+"'";
                mysqlconnection.query(sql2,function(err,data){
                    var profileImage = req.files.profileImage;
                    var new_name_image = new Date().getTime() + `_user.png`;
                    req.files.profileImage.name = new_name_image;
                    var profileimageFiles = typeof req.files.profileImage.name !=="undefined" ? req.files.profileImage.name : "" ;
                    if(data.length == 0){
                        var sql3 = "INSERT INTO `user_profile` (`user_id`,`image`) VALUES ('" + admin_id + "','"+profileimageFiles+"')";
                        mysqlconnection.query(sql3,function(err,profile){
                            // fs.mkdirp('public/images/user_profile/photo/' + admin_id , function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });
                            // fs.mkdirp('public/images/user_profile/photo/' + admin_id + '/gallery', function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });

                            // fs.mkdirp('public/images/user_profile/photo/' + admin_id + '/gallery/thumbs', function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });
                            var path2 = 'public/images/user_profile/photo/'+ profileimageFiles;
                            profileImage.mv(path2, function(err){
                                if(err){
                                    return console.log(err);
                                }
                            });
                        });
                    } else {
                        // fs.mkdirp('public/images/user_profile/photo/' + admin_id , function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });
                        // fs.mkdirp('public/images/user_profile/photo/' + admin_id + '/gallery', function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });

                        // fs.mkdirp('public/images/user_profile/photo/' + admin_id + '/gallery/thumbs', function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });
                        var path2 = 'public/images/user_profile/photo/'+ profileimageFiles;
                        profileImage.mv(path2, function(err){
                            if(err){
                                return console.log(err);
                            }
                        });
                        var sql7 = "UPDATE `user_profile` SET image = '"+profileimageFiles+"' WHERE user_id = '"+admin_id+"'";
                        mysqlconnection.query(sql7,function(err,user){
                        });
                    }
                });
            }
        }
        res.redirect('/admin/edit-user/' + admin_id);
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
})


router.get('/settings', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        var sql = "SELECT * FROM `users` WHERE `user_id` = '"+req.user.user_id+"'";
        var sql2 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+req.user.user_id+"'";
        var sql1 = "SELECT * FROM `logo` WHERE `user_id` = '"+req.user.user_id+"'";
        mysqlconnection.query(sql,function(err,users){
            mysqlconnection.query(sql1,function(err,logo){
                mysqlconnection.query(sql2,function(err,user_profile){
                    if(!err){
                        res.render('admin/screens/settings',{
                            users:users,
                            admin_id:req.user.user_id,
                            role_id:req.user.role_id,
                            logo:logo,
                            user_profile:user_profile
                        });
                    }
                });
            });
        });
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.post('/settings', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        var admin_id = req.body.admin_id;
        var nickname = req.body.nickname;
        var full_name = req.body.full_name;
        var father_name = req.body.father_name;
        var address = req.body.address;
        var phone = req.body.phone;
        var np = req.body.np;
        if(np != ''){
            np = getHashedPassword(np);
            var sql6 = "UPDATE `users` SET password = '"+np+"',nickname = '"+nickname+"',full_name = '"+full_name+"',father_name = '"+father_name+"',address = '"+address+"',phone = '"+phone+"' WHERE user_id = '"+admin_id+"'";
            mysqlconnection.query(sql6,function(err,user){
            });
        } else {
            var sql6 = "UPDATE `users` SET nickname = '"+nickname+"',full_name = '"+full_name+"',father_name = '"+father_name+"',address = '"+address+"',phone = '"+phone+"' WHERE user_id = '"+admin_id+"'";
            mysqlconnection.query(sql6,function(err,user){
            });
        }
        if(req.files != null){
            if(req.files.profileImage != undefined){
                var sql2 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+admin_id+"'";
                mysqlconnection.query(sql2,function(err,data){
                    var profileImage = req.files.profileImage;
                    var new_name_image = new Date().getTime() + `_user.png`;
                    req.files.profileImage.name = new_name_image;
                    var profileimageFiles = typeof req.files.profileImage.name !=="undefined" ? req.files.profileImage.name : "" ;
                    if(data.length == 0){
                        var sql3 = "INSERT INTO `user_profile` (`user_id`,`image`) VALUES ('" + admin_id + "','"+profileimageFiles+"')";
                        mysqlconnection.query(sql3,function(err,profile){
                            // fs.mkdirp('public/images/user_profile/photo/' + admin_id , function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });
                            // fs.mkdirp('public/images/user_profile/photo/' + admin_id + '/gallery', function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });

                            // fs.mkdirp('public/images/user_profile/photo/' + admin_id + '/gallery/thumbs', function(err){
                            //     if(err){
                            //         return console.log(err);
                            //     }
                            // });
                            var path2 = 'public/images/user_profile/photo/' + profileimageFiles;
                            profileImage.mv(path2, function(err){
                                if(err){
                                    return console.log(err);
                                }
                            });
                        });
                    } else {
                        // fs.mkdirp('public/images/user_profile/photo/' + admin_id , function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });
                        // fs.mkdirp('public/images/user_profile/photo/' + admin_id + '/gallery', function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });

                        // fs.mkdirp('public/images/user_profile/photo/' + admin_id + '/gallery/thumbs', function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });
                        var path2 = 'public/images/user_profile/photo/' + profileimageFiles;
                        profileImage.mv(path2, function(err){
                            if(err){
                                return console.log(err);
                            }
                        });
                        var sql7 = "UPDATE `user_profile` SET image = '"+profileimageFiles+"' WHERE user_id = '"+admin_id+"'";
                        mysqlconnection.query(sql7,function(err,user){
                        });
                    }
                });
            }
            if(req.files.image != undefined){
                var Images = req.files.image;
                var new_name_image1 = new Date().getTime() + `_user.png`;
                req.files.image.name = new_name_image1;
                var imageFiles = typeof req.files.image.name !=="undefined" ? req.files.image.name : "" ;
                // fs.mkdirp('public/images/logo/' , function(err){
                //     if(err){
                //         return console.log(err);
                //     }
                // });
                // fs.mkdirp('public/images/logo/gallery', function(err){
                //     if(err){
                //         return console.log(err);
                //     }
                // });

                // fs.mkdirp('public/images/logo/gallery/thumbs', function(err){
                //     if(err){
                //         return console.log(err);
                //     }
                // });
                var path1 = 'public/images/logo/' + imageFiles;
                Images.mv(path1, function(err){
                    if(err){
                        return console.log(err);
                    }
                });
                var sql = "INSERT INTO `logo` (`path`,`user_id`) VALUES ('" + imageFiles + "','" + admin_id + "')";
                mysqlconnection.query(sql,function(err,img){
                });
            }
        }
        res.redirect('/admin/settings');
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
})

router.get('/delete-logo-image/:logo_id/:path', function(req, res, next){
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var logo_id = req.params.logo_id;
            var path = req.params.path;
            var p = 'public/images/logo/' + path;

            fs.unlink(p, function (err) {
                if (err) throw err;
            });

            var sql = "DELETE FROM `logo` WHERE  logo_id ='"+logo_id+"'";
            mysqlconnection.query(sql,function(err,news){
                res.redirect('/admin/settings');
            });

        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-profile-photo/:user_profile_id/:path/:id', function(req, res, next){
    if (req.user && res.statusCode == 200) {
        var admin_id = req.params.id;
        var user_profile_id = req.params.user_profile_id;
        var path = req.params.path;
        var p = 'public/images/user_profile/photo/' + admin_id +'/' + path;

        fs.unlink(p, function (err) {
            if (err) throw err;
        });

        var sql = "UPDATE `user_profile` SET image = NULL WHERE id = '"+user_profile_id+"'";
        mysqlconnection.query(sql,function(err,news){
            res.redirect('/admin/settings');
        });
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});


router.get('/e-paper', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT * FROM `e-paper` WHERE `status` = 1 ORDER BY `created_at` DESC";
            var sql2 = "SELECT * FROM `epaper-category` WHERE `status` = 1";
            mysqlconnection.query(sql,function(err,epaper){
                mysqlconnection.query(sql2,function(err,category){
                    res.render('admin/screens/epaper',{
                        role_id:req.user.role_id,
                        admin_id:req.user.user_id,
                        epaper:epaper,
                        category:category
                    });
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/epaper-images/:epaper_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var epaper_id = req.params.epaper_id;
            var sql = "SELECT * FROM `epaper_images` WHERE `epaper_id` = '"+epaper_id+"'";
            mysqlconnection.query(sql,function(err,epaper){
                res.render('admin/screens/epaper-images',{
                    role_id:req.user.role_id,
                    epaper_images:epaper,
                });
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/add-epaper-category', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var sql = "SELECT * FROM `epaper-category` WHERE `status` = 1";
            mysqlconnection.query(sql,function(err,categories){
                if(!err){
                    res.render('admin/screens/epaper-category',{
                        role_id:req.user.role_id,
                        categories:categories
                    });
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-epaper-category/:category_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category_id = req.params.category_id;

            var sql = "UPDATE `epaper-category` SET `status` = 0 WHERE `id` = '"+category_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/add-epaper-category');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});

router.get('/delete-epaper/:epaper_id', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var epaper_id = req.params.epaper_id;

            var sql = "UPDATE `e-paper` SET `status` = 0 WHERE `id` = '"+epaper_id+"'";
            mysqlconnection.query(sql,function(err,data) {
                res.redirect('/admin/e-paper');
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});


router.post('/add-epaper-category', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category=req.body.category;
            var sql6 = "INSERT INTO `epaper-category` (`name`) VALUES ('" + category + "')";
            mysqlconnection.query(sql6,function(err,data){
                if(!err){
                    res.redirect('/admin/add-epaper-category');
                }
            });
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});



router.post('/add-epaper-pdf', function(req, res, next) {
    if (req.user && res.statusCode == 200) {
        if(req.user.role_id == 1 || req.user.role_id == 2){
            var category = req.body.category;
            var created_at = req.body.created_at;
            var admin_id = req.body.admin_id;
            // var thumbnail = req.files.thumbnail;
            // console.log(thumbnail);
            var date_main_image = new Date();
            var new_main_image_name = date_main_image.getTime() + 'cover.jpeg';

            req.files.thumbnail.name = new_main_image_name;

            var thumbnail = typeof req.files.thumbnail.name !=="undefined" ? req.files.thumbnail.name : "" ;
            // fs.mkdirp('public/images/thumbnail/', function(err){
            //     if(err){
            //         return console.log(err);
            //     }
            // });

            // fs.mkdirp('public/images/thumbnail/gallery', function(err){
            //     if(err){
            //         return console.log(err);
            //     }
            // });

            // fs.mkdirp('public/images/thumbnail/gallery/thumbs', function(err){
            //     if(err){
            //         return console.log(err);
            //     }
            // });
            var Image = req.files.thumbnail;
            var path = 'public/images/thumbnail/' + thumbnail;
            Image.mv(path, function(err){
                if(err){
                    return console.log(err);
                }
            });
            if(req.files != null){
                var a = [];
                if(req.files.pdf[0] == undefined){
                    a.push(req.files.pdf);
                }else {
                    a = req.files.pdf;
                }

                var sql = "INSERT INTO `e-paper` (`category`,`user_id`,`created_at`,`thumbnail`) VALUES ('"+ category + "','" + admin_id + "','"+created_at+"','"+ thumbnail +"')";
                mysqlconnection.query(sql,function(err,img){
                    // console.log(img);
                    for (var i = 0;i<a.length;i++){
                        var Images = a[i];
                        var new_name_image = new Date().getTime() + `_epaper${i}.png`;
                        a[i].name = new_name_image;
                        var imageFiles = typeof a[i].name !=="undefined" ? a[i].name : "" ;
                        // fs.mkdirp('public/images/Epaper/' + img.insertId , function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });
                        // fs.mkdirp('public/images/Epaper/' + img.insertId +'/gallery', function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });

                        // fs.mkdirp('public/images/Epaper/' + img.insertId +'/gallery/thumbs/', function(err){
                        //     if(err){
                        //         return console.log(err);
                        //     }
                        // });
                        var path1 = 'public/images/Epaper/' + imageFiles;
                        Images.mv(path1, function(err){
                            if(err){
                                return console.log(err);
                            }
                        });
                        var sql1 = "INSERT INTO `epaper_images` (`path`,`epaper_id`) VALUES ('" + imageFiles + "','" + img.insertId + "')";
                        mysqlconnection.query(sql1,function(err,data){});
                    }
                    res.redirect('/admin/e-paper');
                });
            }
        } else if(req.user.role_id == 3 || req.user.role_id == 4) {
            res.render('admin/screens/404');
        }
    } else {
        res.render('admin/screens/login',{
            message:'You are logged out, Please login again',
            messageClass:'alert-danger'
        });
    }
});



router.get('/career', function(req, res, next) {
    var sql8 = "SELECT * FROM `logo`";
    // var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
    var sql1 = "SELECT * FROM `categories` WHERE `status` = 1 AND `is_state` = 1";
    mysqlconnection.query(sql8,function(err,logo){
        mysqlconnection.query(sql1,function(err,states){
            res.render('admin/screens/career',{
                logo:logo,
                states:states,
                message:null,
                messageClass:null
            });
        });
    });
});

router.post('/career', function(req, res, next) {
    var father_name = req.body.father_name;
    var full_name = req.body.full_name;
    var address = req.body.address;
    var phone = req.body.phone;
    var city=req.body.city;
    var password = getHashedPassword(req.body.password);
    var is_approved = 0;
    var role_id = 3;
    var admin_id = 2;

    var sql6 = "INSERT INTO `users` (`name`,`full_name`, `password`,`phone`,`father_name`,`address`,`is_approved`, `city`, `role_id`,`created_by`) VALUES ('" + phone + "' ,'" + full_name + "' ,'" + password + "' ,'" + phone + "','" + father_name + "','" + address + "','" + is_approved + "' , '" + city + "', '" + role_id + "', '" + admin_id + "')";
    mysqlconnection.query(sql6,function(err,data){
        if(!err){
            if(req.files != null) {
                if(req.files.images != undefined){
                    var new_name_image = new Date().getTime() + `_user.png`;
                    req.files.images.name = new_name_image;
                    var imageFile = typeof req.files.images.name !=="undefined" ? req.files.images.name : "" ;
                    // fs.mkdirp('public/images/user_profile/photo/' + data.insertId, function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });

                    // fs.mkdirp('public/images/user_profile/photo/' + data.insertId  + '/gallery', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });

                    // fs.mkdirp('public/images/user_profile/photo/' + data.insertId + '/gallery/thumbs', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    var Image = req.files.images;
                    var path = 'public/images/user_profile/photo/'+ data.insertId + '/' + imageFile;
                    Image.mv(path, function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    var sql = "INSERT INTO `user_profile` (`user_id`,`image`) VALUES ('" + data.insertId + "','" + imageFile + "')";
                    mysqlconnection.query(sql,function(err,img){});
                }
                if(req.files.document != undefined){
                    var new_name_image = new Date().getTime() + `_user.png`;
                    req.files.document.name = new_name_image;
                    var documentFile = typeof req.files.document.name !=="undefined" ? req.files.document.name : "" ;
                    // fs.mkdirp('public/images/user_profile/document/' + data.insertId, function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });

                    // fs.mkdirp('public/images/user_profile/document/' + data.insertId  + '/gallery', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });

                    // fs.mkdirp('public/images/user_profile/document/' + data.insertId + '/gallery/thumbs', function(err){
                    //     if(err){
                    //         return console.log(err);
                    //     }
                    // });
                    var Document = req.files.document;
                    var path = 'public/images/user_profile/document/'+ data.insertId + '/' + documentFile;
                    Document.mv(path, function(err){
                        if(err){
                            return console.log(err);
                        }
                    });
                    var sql1 = "INSERT INTO `user_profile` (`user_id`,`document`) VALUES ('" + data.insertId + "','" + documentFile + "')";
                    mysqlconnection.query(sql1,function(err,document){});
                }
            }
            var sql8 = "SELECT * FROM `logo`";
            var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
            mysqlconnection.query(sql8,function(err,logo){
                mysqlconnection.query(sql1,function(err,states){
                    res.render('admin/screens/career',{
                        logo:logo,
                        states:states,
                        message:'Your Data is Successfully Submitted. Please wait until it is approved',
                        messageClass: 'alert-success'
                    });
                });
            });
        }
    });
});


router.get('/forgot-password', (req, res) => {
    res.render('admin/screens/forgot-password',{
        message:null,
        messageClass:null
    });
});

router.post('/forgot-password', function(req, res, next) {
    var phone = req.body.phone;
    var password = getHashedPassword(req.body.password);

    var sql = "UPDATE `users` SET `password` = '" + password + "' WHERE phone = '" + phone + "'";
    mysqlconnection.query(sql,function(err,user){
        if(!err){
            res.render('admin/screens/login', {
                message: 'Password Updated',
                messageClass: 'alert-success'
            });
        }
    });
});


router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = getHashedPassword(req.body.password);

    var sql = "SELECT * FROM `users` WHERE `name` = '" + username + "' AND `password` = '" + password + "' AND status = 1 AND is_approved = 1";
    mysqlconnection.query(sql,function(err,user){
        if(user.length != 0){
            const authToken = generateAuthToken();
            authTokens[authToken] = user[0];
            var hours = 1*24*60*60*1000;
            res.cookie('AuthToken', authToken,{maxAge: hours});

            res.redirect('/admin/news');
        } else {
            res.render('admin/screens/login', {
                message: 'Invalid Phone Number or password',
                messageClass: 'alert-danger'
            });
        }
    });
});


router.get('/searchEpaperCategory/:name', function(req, res, next) {
    var name = req.params.name;
    var sql = "SELECT * FROM `epaper-category` WHERE name = '" + name + "' AND `status` = 1";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/Usernotapproved/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `users` SET `is_approved` = 0 WHERE user_id = '" + news_id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/Userapproved/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `users` SET `is_approved` = 1 WHERE user_id = '" + news_id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/Userautonotapproved/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `users` SET `auto_approved` = 0 WHERE user_id = '" + news_id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/Userautoapproved/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `users` SET `auto_approved` = 1 WHERE user_id = '" + news_id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/searchUser/:name', function(req, res, next) {
    var name = req.params.name;
    var sql = "SELECT * FROM `users` WHERE name = '" + name + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/searchPhoneNumber/:phone', function(req, res, next) {
    var phone = '%' + req.params.phone;
    var sql = "SELECT * FROM `users` WHERE name LIKE '" + phone + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/getCity/:name', function(req, res, next) {
    var name = req.params.name;
    var sql1 = "SELECT * FROM `states` WHERE name = '" + name + "'";
    mysqlconnection.query(sql1,function(err,states){
        var sql = "SELECT * FROM `cities` WHERE state_id = '" + states[0].id + "'";
        mysqlconnection.query(sql,function(err,data){
            res.jsonp(data);
        });
    });
});

router.get('/changeSliderCategory/:category/:slider_id', function(req, res, next) {
    var category = req.params.category;
    var slider_id = req.params.slider_id;
    var sql = "UPDATE `slider` SET `category` = '"+category+"' WHERE slider_id = '" + slider_id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/notimportant/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `news` SET `imp` = 0 WHERE news_id = '" + news_id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/important/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `news` SET `imp` = 1 WHERE news_id = '" + news_id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/notapproved/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `news` SET `is_approved` = 0 WHERE news_id = '" + news_id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/approved/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `news` SET `is_approved` = 1 WHERE news_id = '" + news_id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/postnotapproved/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = "UPDATE `user_post` SET `is_approved` = 0 WHERE id = '" + id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/postapproved/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = "UPDATE `user_post` SET `is_approved` = 1 WHERE id = '" + id + "'";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/searchCategory/:name', function(req, res, next) {
    var name = req.params.name;
    var sql = "SELECT * FROM `categories` WHERE name = '" + name + "' AND `status` = 1";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/searchSubCategory/:name', function(req, res, next) {
    var name = req.params.name;
    var sql = "SELECT * FROM `sub-categories` WHERE name = '" + name + "' AND `status` = 1";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/searchTagname/:name', function(req, res, next) {
    var name = req.params.name;
    var sql = "SELECT * FROM `tags` WHERE name = '" + name + "' AND `status` = 1";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/getSubCategory/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = "SELECT * FROM `sub-categories` WHERE category_id = '" + id + "' AND `status` = 1";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/searchdCategory/:name', function(req, res, next) {
    var name = req.params.name;
    var sql = "SELECT * FROM `dcategory` WHERE name = '" + name + "' AND `status` = 1";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/sendNotification/:title/:description', function(req, res, next) {
    console.log('hello');
    var title = req.params.title;
    var description = req.params.description;
    var sql = "SELECT * FROM `fcm_token`";
    var registration_ids = [];
    mysqlconnection.query(sql,function(err,data){
        if(data.length !=0) {
            for (var i = 0; i < data.length; i++) {
                registration_ids.push(data[i].token);
            }
            // var message = {
            //     registration_ids: registration_ids,
            //     notification: {
            //         title: title,
            //         body: description
            //     },
            // };

            var message = {
                notification:{
                    title : title,
                    body : description
                }
            };

            FCM.sendToMultipleToken(message, registration_ids, function(err, response) {
                if(err){
                    console.log('err--', err);
                    res.jsonp({message: 'error'});
                }else {
                    console.log('response-----', response);
                    res.jsonp({message: 'success'});
                }

            })
        }
    });
});

router.post('/api/fcm-token', function(req, res, next) {
    var token=req.body.token;
    // console.log(token);
    var sql1 = "SELECT * FROM `fcm_token` WHERE `token` = '"+token+"'";
    mysqlconnection.query(sql1,function(err,data){
        if(data.length == 0){
            var sql = "INSERT INTO `fcm_token` (`token`) VALUES ('" + token + "')";
            mysqlconnection.query(sql,function(err,token){
                if(!err){
                    res.jsonp({
                        status :'success',
                        msg:'Your token is saved',
                    });
                } else {
                    res.jsonp({
                        status :'failed',
                        msg:'Your token is not saved',
                    });
                }
            });
        }
    });
});

module.exports = router;
