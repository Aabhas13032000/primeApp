var logged_in = document.getElementById('logged_in').value;
var user_id = document.getElementById('user_id').value;
var full_name = document.getElementById('full_name').value;
var category_name = document.getElementById('category_name').value;
var getData = document.getElementById('getData').value;
var user_face = document.getElementById('user_face').value;
var offset = 5;
var useroffset = 5;
var videooffset = 1;

function createCard(news) {
    var news_id = news.news_id;
    var short_description = news.short_description;
    var front_image_path = news.front_image_path;
    var title = (news.title !=null ? (news.title + ':') : '');
    var url = `/mobile/each-news/${news_id}`;
    if(front_image_path != null) {
        if(front_image_path.slice(0,5) == "https") {
            var img = `<img src="${front_image_path}" alt="" style="border-radius: 5px">`;
        } else {
            var img = `<img src="/images/image_files/${front_image_path}" alt="" style="border-radius: 5px">`;
        }
    } else {
        var img = '<img src="/images/logo/01.png" alt="" style="border-radius: 5px">';
    }
    if(logged_in == 0){
        var string = '<a id="like'+ (`${news_id}`) +'" style="color: #b4b4b4;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
    } else {
        if(news.news_like == null) {
            var string = '<a id="like'+ (`${news_id}`) +'" style="color: #b4b4b4;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
        } else {
            var string = '<a id="like'+ (`${news_id}`) +'" style="color: #112244;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
        }
    }
    return '<div class="card"><div class="row top-row" onclick="window.open(\''+ url +'\', \'_top\')"><div class="col-4"><div class="card"><a href="#">'+ img +'</a></div></div><div class="col-8"><h6>'+ title +''+ (short_description.length >= 30 ? (short_description.slice(0,30) + '..') : short_description) +'</h6></div></div><div class="row bottom-row"><div class="col-4" onclick="like('+ (`${news_id}`) +')">'+ string +'</div><div class="col-4" onclick="comment('+ (`${news_id}`) +')"><a href="#"><i class="fas fa-comment"></i>&nbsp;&nbsp;टिप्पणी</a></div><div class="col-4" onclick="share('+ (`${news_id}`) +')"><a href="#"><i class="fas fa-share"></i>&nbsp;&nbsp;शेयर</a></div></div></div><div class="popup" id="popup'+ (`${news_id}`) +'" style="display: none;" onclick="closeNewsPopup('+ (`${news_id}`) +')"></div><div class="popup" id="sharepopup'+ (`${news_id}`) +'" style="display: none;" onclick="closeSharePopup('+ (`${news_id}`) +')"></div><div class="comment_box" id="comment_box'+ (`${news_id}`) +'" style="display:none"><div class="heading"><div class="row"><div class="col-10"><h4>Comment Box</h4></div><div class="col-2"><button onclick="closeNewsPopup('+ (`${news_id}`) +')"><i class="fas fa-times"></i></button></div></div></div><div class="message_box" id="message_box'+ (`${news_id}`) +'"></div><div class="input_box"><form onsubmit="addComment('+ (`${news_id}`) +')"><div class="row"><div class="col-10"><div class="form-group"><input type="text" class="form-control" id="comment_message'+ (`${news_id}`) +'" name="comment_message" placeholder="Type a Comment.."></div></div><div class="col-2"><button type="submit" class="btn btn-primary"><i class="fas fa-paper-plane"></i></button></div></div></form></div></div><div class="share_box" id="share_options'+ (`${news_id}`) +'" style="display:none"><div class="heading"><div class="row"><div class="col-10"><h4>Share Box</h4></div><div class="col-2"><button onclick="closeSharePopup('+ (`${news_id}`) +')"><i class="fas fa-times"></i></button></div></div></div><br><div class="options"><div class="row"><div class="col-4" style="text-align: center"><a href="https://www.facebook.com/sharer.php?u=primeapp.co.in/each-news/'+ (`${news_id}`) +'" target="_blank" style="background-color: #3b5998;font-size: 24px;color: white;padding: 5px 14px;border-radius: 50%;text-decoration: none"><i class="fab fa-facebook-f"></i></a></div><div class="col-4" style="text-align: center"><a href="https://wa.me/?text=http://primeapp.co.in/each-news/'+ (`${news_id}`) +'%0D%0Dन्यूज़ के लिए आज ही ऐप इंस्टॉल करें।%0Dhttps://play.google.com/store/apps/details?id=%0D%0Dसंपर्क करें 902-412-3007%0DGmail: primeapp.co.in@gmail.com%0D%0Dवीडियो खबरों के लिए नीचे दिए लिंक को पर क्लिक करें और तुरंत सब्सक्राइब करें ।%0Dhttps://www.youtube.com/channel/UCMSgxxG0wN5lSjHP1mXKjBA"  target="_blank" style="background-color: #25d366;font-size: 24px;color: white;padding: 5px 12px;border-radius: 50%;text-decoration: none"><i class="fab fa-whatsapp"></i></a></div><div class="col-4" style="text-align: center"><a href="https://twitter.com/share?url=http://primeapp.co.in/each-news/'+ (`${news_id}`) +'&text='+ (`${title}`) +'" data-show-count="false" target="_blank" style="background-color: #00acee;text-decoration: none;font-size: 24px;color: white;border-radius: 50%;padding: 5px 10px"><i class="fab fa-twitter"></i></a></div></div></div><br></div>';
}


function createProfileCard(news,url_value) {
    var news_id = news.news_id;
    var short_description = news.short_description;
    var front_image_path = news.front_image_path;
    var title = (news.title !=null ? (news.title + ':') : '');
    if(url_value == 1){
        var url = `/mobile/user-each-news/${news_id}`;
    } else {
        var url = `/mobile/each-news/${news_id}`;
    }
    if(front_image_path != null) {
        if(front_image_path.slice(0,5) == "https") {
            var img = `<img src="${front_image_path}" alt="" style="border-radius: 5px">`;
        } else {
            var img = `<img src="/images/image_files/${front_image_path}" alt="" style="border-radius: 5px">`;
        }
    } else {
        var img = '<img src="/images/logo/01.png" alt="" style="border-radius: 5px">';
    }
    if(logged_in == 0){
        var string = '<a id="like'+ (`${news_id}`) +'" style="color: #b4b4b4;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
    } else {
        if(news.news_like == null) {
            var string = '<a id="like'+ (`${news_id}`) +'" style="color: #b4b4b4;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
        } else {
            var string = '<a id="like'+ (`${news_id}`) +'" style="color: #112244;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
        }
    }
    if(user_face == 'self'){
        if(news.is_approved == 1){
            var approval_line = '<div class="row approval"><div class="col-6"></div><div class="col-6"><a class="approved">Approved</a></div></div>';
        } else {
            var approval_line = '<div class="row approval"><div class="col-6"></div><div class="col-6"><a class="not_approved">Not Approved</a></div></div>';
        }
    } else if(user_face == 'other'){
        var approval_line = '';
    }
    if(url_value == 3){
        return '<div class="card"><div class="row top-row" onclick="window.open(\''+ url +'\', \'_top\')"><div class="col-4"><div class="card"><a href="#">'+ img +'</a></div></div><div class="col-8"><h6>'+ title +''+ (short_description.length >= 30 ? (short_description.slice(0,30) + '..') : short_description) +'</h6></div></div></div>';
    } else {
        return '<div class="card"><div class="row top-row" onclick="window.open(\''+ url +'\', \'_top\')"><div class="col-4"><div class="card"><a href="#">'+ img +'</a></div></div><div class="col-8"><h6>'+ title +''+ (short_description.length >= 30 ? (short_description.slice(0,30) + '..') : short_description) +'</h6></div></div>'+ approval_line +'</div>';
    }
}


function createExpandedCard(news) {
    var today = new Date();
    var date = new Date(news.created_at);
    var time = Math.round(Math.abs((today - date) / (24 * 60 * 60 * 1000)))
    if(time == 0){
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var message_time = hours + ':' + minutes + ' ' + ampm;
    } else {
        if(time < 7){
            var message_time = time + ' day ago';
        } else if(time < 28) {
            var message_time = parseInt(time/7) + ' week ago';
        } else if(time >= 28){
            var message_time = parseInt(time/28) + ' month ago';
        }
    }              
    var news_id = news.news_id;
    var short_description = news.short_description;
    var front_image_path = news.front_image_path;
    var title = (news.title !=null ? (news.title + ':') : '');
    var url = `/mobile/each-news/${news_id}`;
    var url1 = `/mobile/user-profile/${news.user_id}`;
    var url2 = `/mobile/search/${news.district}/${news.tags}`;
    if(front_image_path != null) {
        if(front_image_path.slice(0,5) == "https") {
            var img = `<img src="${front_image_path}" alt="" style="border-radius: 5px">`;
        } else {
            var img = `<img src="/images/image_files/${front_image_path}" alt="" style="border-radius: 5px">`;
        }
    } else {
        var img = '<img src="/images/logo/01.png" alt="" style="border-radius: 5px">';
    }
    if(logged_in == 0){
        var string = '<a id="like'+ (`${news_id}`) +'" style="color: #b4b4b4;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
    } else {
        if(news.news_like == null) {
            var string = '<a id="like'+ (`${news_id}`) +'" style="color: #b4b4b4;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
        } else {
            var string = '<a id="like'+ (`${news_id}`) +'" style="color: #112244;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
        }
    }
    if(news.profile_image != null){
        var profile_image = `<img src="/images/user_profile/photo/<%= news2[i].profile_image%>" alt="" style="border-radius: 5px">`;
    } else {
        var profile_image = `<h1>${news.f_name.slice(0,1).toUpperCase()}</h1>`
    }
    return '<div class="card"><div class="row top-row"><div class="col-12"><div class="row"><div class="col-2 profile"><div class="card">'+ profile_image +'</div></div><div class="col-10 content"><div><p class="main-name"><b onclick="window.open(\''+ url1 +'\', \'_top\')">'+ news.u_name +'</b>&nbsp;&nbsp;<span style="color: #9c9c9c;"> ने </span>&nbsp;&nbsp;<span style="color: #ff6600;cursor: pointer;" onclick="window.open(\''+ url2 +'\', \'_top\')">'+ (news.tags != null ? (news.district.includes('क्षेत्र') ? news.city : (news.district.split('(')[0]).split(' ')[0] ) + ' ' + news.tags : '') +'</span></p><p class="sub-text">के बारे मै पोस्ट किया | '+ message_time +'</p></div></div></div></div><div class="col-12 title" onclick="window.open(\''+ url +'\', \'_top\')"><h6>'+ title +''+ (short_description.length >= 30 ? (short_description.slice(0,30) + '..') : short_description) +'</h6></div><div class="col-12 image" onclick="window.open(\''+ url +'\', \'_top\')"><div class="card">'+ img +'</div></div></div><div class="row bottom-row"><div class="col-4" onclick="like('+ (`${news_id}`) +')">'+ string +'</div><div class="col-4" onclick="comment('+ (`${news_id}`) +')"><a href="#"><i class="fas fa-comment"></i>&nbsp;&nbsp;टिप्पणी</a></div><div class="col-4" onclick="share('+ (`${news_id}`) +')"><a href="#"><i class="fas fa-share"></i>&nbsp;&nbsp;शेयर</a></div></div></div><div class="popup" id="popup'+ (`${news_id}`) +'" style="display: none;" onclick="closeNewsPopup('+ (`${news_id}`) +')"></div><div class="popup" id="sharepopup'+ (`${news_id}`) +'" style="display: none;" onclick="closeSharePopup('+ (`${news_id}`) +')"></div><div class="comment_box" id="comment_box'+ (`${news_id}`) +'" style="display:none"><div class="heading"><div class="row"><div class="col-10"><h4>Comment Box</h4></div><div class="col-2"><button onclick="closeNewsPopup('+ (`${news_id}`) +')"><i class="fas fa-times"></i></button></div></div></div><div class="message_box" id="message_box'+ (`${news_id}`) +'"></div><div class="input_box"><form onsubmit="addComment('+ (`${news_id}`) +')"><div class="row"><div class="col-10"><div class="form-group"><input type="text" class="form-control" id="comment_message'+ (`${news_id}`) +'" name="comment_message" placeholder="Type a Comment.."></div></div><div class="col-2"><button type="submit" class="btn btn-primary"><i class="fas fa-paper-plane"></i></button></div></div></form></div></div><div class="share_box" id="share_options'+ (`${news_id}`) +'" style="display:none"><div class="heading"><div class="row"><div class="col-10"><h4>Share Box</h4></div><div class="col-2"><button onclick="closeSharePopup('+ (`${news_id}`) +')"><i class="fas fa-times"></i></button></div></div></div><br><div class="options"><div class="row"><div class="col-4" style="text-align: center"><a href="https://www.facebook.com/sharer.php?u=primeapp.co.in/each-news/'+ (`${news_id}`) +'" target="_blank" style="background-color: #3b5998;font-size: 24px;color: white;padding: 5px 14px;border-radius: 50%;text-decoration: none"><i class="fab fa-facebook-f"></i></a></div><div class="col-4" style="text-align: center"><a href="https://wa.me/?text=http://primeapp.co.in/each-news/'+ (`${news_id}`) +'%0D%0Dन्यूज़ के लिए आज ही ऐप इंस्टॉल करें।%0Dhttps://play.google.com/store/apps/details?id=%0D%0Dसंपर्क करें 902-412-3007%0DGmail: primeapp.co.in@gmail.com%0D%0Dवीडियो खबरों के लिए नीचे दिए लिंक को पर क्लिक करें और तुरंत सब्सक्राइब करें ।%0Dhttps://www.youtube.com/channel/UCMSgxxG0wN5lSjHP1mXKjBA"  target="_blank" style="background-color: #25d366;font-size: 24px;color: white;padding: 5px 12px;border-radius: 50%;text-decoration: none"><i class="fab fa-whatsapp"></i></a></div><div class="col-4" style="text-align: center"><a href="https://twitter.com/share?url=http://primeapp.co.in/each-news/'+ (`${news_id}`) +'&text='+ (`${title}`) +'" data-show-count="false" target="_blank" style="background-color: #00acee;text-decoration: none;font-size: 24px;color: white;border-radius: 50%;padding: 5px 10px"><i class="fab fa-twitter"></i></a></div></div></div><br></div>';
}

function createVideoCard(news) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = (news.url).match(regExp);
    var str = (match&&match[7].length==11)? match[7] : false;
    var today = new Date();
    var date = new Date(news.created_at);
    var time = Math.round(Math.abs((today - date) / (24 * 60 * 60 * 1000)))
    if(time == 0){
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var message_time = hours + ':' + minutes + ' ' + ampm;
    } else {
        if(time < 7){
            var message_time = time + ' day ago';
        } else if(time < 28) {
            var message_time = parseInt(time/7) + ' week ago';
        } else if(time >= 28){
            var message_time = parseInt(time/28) + ' month ago';
        }
    }              
    var news_id = news.news_id;
    var short_description = news.short_description;
    var front_image_path = news.front_image_path;
    var title = (news.title !=null ? (news.title + ':') : '');
    var url = `/mobile/each-news/${news_id}`;
    var url1 = `/mobile/user-profile/${news.user_id}`;
    var url2 = `/mobile/search/${news.district}/${news.tags}`;
    if(front_image_path != null) {
        if(front_image_path.slice(0,5) == "https") {
            var img = `<img src="${front_image_path}" alt="" style="border-radius: 5px">`;
        } else {
            var img = `<img src="/images/image_files/${front_image_path}" alt="" style="border-radius: 5px">`;
        }
    } else {
        var img = '<img src="/images/logo/01.png" alt="" style="border-radius: 5px">';
    }
    if(logged_in == 0){
        var string = '<a id="like'+ (`${news_id}`) +'" style="color: #b4b4b4;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
    } else {
        if(news.news_like == null) {
            var string = '<a id="like'+ (`${news_id}`) +'" style="color: #b4b4b4;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
        } else {
            var string = '<a id="like'+ (`${news_id}`) +'" style="color: #112244;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
        }
    }
    if(news.profile_image != null){
        var profile_image = `<img src="/images/user_profile/photo/<%= news2[i].profile_image%>" alt="" style="border-radius: 5px">`;
    } else {
        var profile_image = `<h1>${news.f_name.slice(0,1).toUpperCase()}</h1>`
    }
    return '<div class="card"><div class="row top-row"><div class="col-12"><div class="row"><div class="col-2 profile"><div class="card">'+ profile_image +'</div></div><div class="col-10 content"><div><p class="main-name"><b onclick="window.open(\''+ url1 +'\', \'_top\')">'+ news.u_name +'</b>&nbsp;&nbsp;<span style="color: #9c9c9c;"> ने </span>&nbsp;&nbsp;<span style="color: #ff6600;cursor: pointer;" onclick="window.open(\''+ url2 +'\', \'_top\')">'+ (news.tags != null ? (news.district.includes('क्षेत्र') ? news.city : (news.district.split('(')[0]).split(' ')[0] ) + ' ' + news.tags : '') +'</span></p><p class="sub-text">के बारे मै पोस्ट किया | '+ message_time +'</p></div></div></div></div><div class="col-12 title" onclick="window.open(\''+ url +'\', \'_top\')"><h6>'+ title +''+ (short_description.length >= 30 ? (short_description.slice(0,30) + '..') : short_description) +'</h6></div><div class="col-12 image" onclick="window.open(\''+ url +'\', \'_top\')"><div class="card"><iframe width="100%" height="100%" id="youtube-video0"  src="https://www.youtube.com/embed/'+ str +'?controls=1" frameborder="0"  allowfullscreen></iframe></div></div></div><div class="row bottom-row"><div class="col-4" onclick="like('+ (`${news_id}`) +')">'+ string +'</div><div class="col-4" onclick="comment('+ (`${news_id}`) +')"><a href="#"><i class="fas fa-comment"></i>&nbsp;&nbsp;टिप्पणी</a></div><div class="col-4" onclick="share('+ (`${news_id}`) +')"><a href="#"><i class="fas fa-share"></i>&nbsp;&nbsp;शेयर</a></div></div></div><div class="popup" id="popup'+ (`${news_id}`) +'" style="display: none;" onclick="closeNewsPopup('+ (`${news_id}`) +')"></div><div class="popup" id="sharepopup'+ (`${news_id}`) +'" style="display: none;" onclick="closeSharePopup('+ (`${news_id}`) +')"></div><div class="comment_box" id="comment_box'+ (`${news_id}`) +'" style="display:none"><div class="heading"><div class="row"><div class="col-10"><h4>Comment Box</h4></div><div class="col-2"><button onclick="closeNewsPopup('+ (`${news_id}`) +')"><i class="fas fa-times"></i></button></div></div></div><div class="message_box" id="message_box'+ (`${news_id}`) +'"></div><div class="input_box"><form onsubmit="addComment('+ (`${news_id}`) +')"><div class="row"><div class="col-10"><div class="form-group"><input type="text" class="form-control" id="comment_message'+ (`${news_id}`) +'" name="comment_message" placeholder="Type a Comment.."></div></div><div class="col-2"><button type="submit" class="btn btn-primary"><i class="fas fa-paper-plane"></i></button></div></div></form></div></div><div class="share_box" id="share_options'+ (`${news_id}`) +'" style="display:none"><div class="heading"><div class="row"><div class="col-10"><h4>Share Box</h4></div><div class="col-2"><button onclick="closeSharePopup('+ (`${news_id}`) +')"><i class="fas fa-times"></i></button></div></div></div><br><div class="options"><div class="row"><div class="col-4" style="text-align: center"><a href="https://www.facebook.com/sharer.php?u=primeapp.co.in/each-news/'+ (`${news_id}`) +'" target="_blank" style="background-color: #3b5998;font-size: 24px;color: white;padding: 5px 14px;border-radius: 50%;text-decoration: none"><i class="fab fa-facebook-f"></i></a></div><div class="col-4" style="text-align: center"><a href="https://wa.me/?text=http://primeapp.co.in/each-news/'+ (`${news_id}`) +'%0D%0Dन्यूज़ के लिए आज ही ऐप इंस्टॉल करें।%0Dhttps://play.google.com/store/apps/details?id=%0D%0Dसंपर्क करें 902-412-3007%0DGmail: primeapp.co.in@gmail.com%0D%0Dवीडियो खबरों के लिए नीचे दिए लिंक को पर क्लिक करें और तुरंत सब्सक्राइब करें ।%0Dhttps://www.youtube.com/channel/UCMSgxxG0wN5lSjHP1mXKjBA"  target="_blank" style="background-color: #25d366;font-size: 24px;color: white;padding: 5px 12px;border-radius: 50%;text-decoration: none"><i class="fab fa-whatsapp"></i></a></div><div class="col-4" style="text-align: center"><a href="https://twitter.com/share?url=http://primeapp.co.in/each-news/'+ (`${news_id}`) +'&text='+ (`${title}`) +'" data-show-count="false" target="_blank" style="background-color: #00acee;text-decoration: none;font-size: 24px;color: white;border-radius: 50%;padding: 5px 10px"><i class="fab fa-twitter"></i></a></div></div></div><br></div>';
}

function createNewVideoCard(news) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = (news.url).match(regExp);
    var str = (match&&match[7].length==11)? match[7] : false;
    var today = new Date();
    var date = new Date(news.created_at);
    var time = Math.round(Math.abs((today - date) / (24 * 60 * 60 * 1000)))
    if(time == 0){
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var message_time = hours + ':' + minutes + ' ' + ampm;
    } else {
        if(time < 7){
            var message_time = time + ' day ago';
        } else if(time < 28) {
            var message_time = parseInt(time/7) + ' week ago';
        } else if(time >= 28){
            var message_time = parseInt(time/28) + ' month ago';
        }
    }              
    var news_id = news.news_id;
    var short_description = news.short_description;
    var front_image_path = news.front_image_path;
    var title = (news.title !=null ? (news.title + ':') : '');
    var url = `/mobile/each-news/${news_id}`;
    var url1 = `/mobile/user-profile/${news.user_id}`;
    var url2 = `/mobile/search/${news.district}/${news.tags}`;
    if(front_image_path != null) {
        if(front_image_path.slice(0,5) == "https") {
            var img = `<img src="${front_image_path}" alt="" style="border-radius: 5px">`;
        } else {
            var img = `<img src="/images/image_files/${front_image_path}" alt="" style="border-radius: 5px">`;
        }
    } else {
        var img = '<img src="/images/logo/01.png" alt="" style="border-radius: 5px">';
    }
    if(logged_in == 0){
        var string = '<a id="like'+ (`${news_id}`) +'" style="color: #b4b4b4;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
    } else {
        if(news.news_like == null) {
            var string = '<a id="like'+ (`${news_id}`) +'" style="color: #b4b4b4;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
        } else {
            var string = '<a id="like'+ (`${news_id}`) +'" style="color: #112244;"><i class="fas fa-thumbs-up"></i>&nbsp;&nbsp;लाइक</a>';
        }
    }
    if(news.profile_image != null){
        var profile_image = `<img src="/images/user_profile/photo/<%= news2[i].profile_image%>" alt="" style="border-radius: 5px">`;
    } else {
        var profile_image = `<h1>${news.f_name.slice(0,1).toUpperCase()}</h1>`
    }
    return '<div class="section"><div class="top-row"><div class="row "><div class="col-12"><div class="row"><div class="col-2 profile"><div class="card">'+ profile_image +'</div></div> <div class="col-10 content"><div><p class="main-name"><b onclick="window.open(\''+ url1 +'\', \'_top\')">'+ news.u_name +'</b>&nbsp;&nbsp;<span style="color: #9c9c9c;"> ने </span>&nbsp;&nbsp;<span style="color: #ff6600;cursor: pointer;" onclick="window.open(\''+ url2 +'\', \'_top\')">'+ (news.tags != null ? (news.district.includes('क्षेत्र') ? news.city : (news.district.split('(')[0]).split(' ')[0] ) + ' ' + news.tags : '') +'</span></p><p class="sub-text">के बारे मै पोस्ट किया | '+ message_time +'</p></div></div></div></div><div class="col-12 title" onclick="window.open(\''+ url +'\', \'_top\')"><h6>'+ title +''+ (short_description.length >= 30 ? (short_description.slice(0,30) + '..') : short_description) +'</h6></div></div></div><div class="image" onclick="window.open(\''+ url +'\', \'_top\')"><div class="card"><iframe width="100%" height="100%" id="youtube-video0"  src="https://www.youtube.com/embed/'+ str +'?controls=1" frameborder="0"  allowfullscreen></iframe></div></div></div>';
}

function sendLikeAjax(news_id) {
    $.ajax({
        url:"/mobile/like/" + news_id,
        dataType: "jsonp",
        type:"GET",
        success: function(data){
            console.log('success');
        },
        error: function(err){
            console.log(err.status);
        }
    });
}

function like(news_id) {
    if(logged_in == 0){
        document.getElementById('popup').style.display = "block";
        document.getElementById('cross').style.display = "flex";
        document.getElementById('login-box').style.display = "block";
    } else {
        var element = document.getElementById('like'+news_id);
        if(element.style.color === "rgb(17, 34, 68)") {
            document.getElementById('like'+news_id).style.color = "#b4b4b4";
            sendLikeAjax(news_id);
        } else if(element.style.color === "rgb(180, 180, 180)"){
            document.getElementById('like'+news_id).style.color = "#112244";
            sendLikeAjax(news_id);
        }
    }
}

function follow(user_id) {
    if(logged_in == 0){
        document.getElementById('popup').style.display = "block";
        document.getElementById('cross').style.display = "flex";
        document.getElementById('login-box').style.display = "block";
    } else {
        $.ajax({
            url:"/mobile/follow/" + user_id,
            dataType: "jsonp",
            type:"GET",
            success: function(news){
                location.reload();
            },
            error: function(err){
                console.log(err.status);
            }
        });
    }
}

function unfollow(user_id) {
    if(logged_in == 0){
        document.getElementById('popup').style.display = "block";
        document.getElementById('cross').style.display = "flex";
        document.getElementById('login-box').style.display = "block";
    } else {
        $.ajax({
            url:"/mobile/unfollow/" + user_id,
            dataType: "jsonp",
            type:"GET",
            success: function(news){
                location.reload();
            },
            error: function(err){
                console.log(err.status);
            }
        });
    }
}

function comment(news_id) {
    if(logged_in == 0){
        document.getElementById('popup').style.display = "block";
        document.getElementById('cross').style.display = "flex";
        document.getElementById('login-box').style.display = "block";
    } else {
        document.getElementById('popup'+news_id).style.display = "block";
        document.getElementById('comment_box'+news_id).style.display = "block";
        $.ajax({
            url:"/mobile/getComments/" + news_id,
            dataType: "json",
            type:"GET",
            success: function(comment){
                document.getElementById("message_box"+news_id).innerHTML = "";
                for(var i=0;i<comment.length;i++){
                    var today = new Date();
                    var date = new Date(comment[i].created_at);
                    var time = Math.round(Math.abs((today - date) / (24 * 60 * 60 * 1000)))
                    if(time == 0){
                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var ampm = hours >= 12 ? 'pm' : 'am';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // the hour '0' should be '12'
                        minutes = minutes < 10 ? '0'+minutes : minutes;
                        var message_time = hours + ':' + minutes + ' ' + ampm;
                    } else {
                        if(time < 7){
                            var message_time = time + ' day ago';
                        } else if(time < 28) {
                            var message_time = parseInt(time/7) + ' week ago';
                        } else if(time >= 28){
                            var message_time = parseInt(time/28) + ' month ago';
                        }
                    }
                    $('#message_box'+news_id).append('<div class="card"><div class="row"><div class="col-2"><h3>'+ comment[i].full_name.slice(0,1).toUpperCase() +'</h3></div><div class="col-10"><h6><b>'+ comment[i].full_name +'</b></h6><p>'+ comment[i].message +'</p><p class="time">'+ message_time +'</p></div></div></div>');
                }
                var objDiv = document.getElementById("message_box"+news_id);
                objDiv.scrollTop = objDiv.scrollHeight;
            },
            error: function(err){
                console.log(err.status);
            }
        });
        var objDiv = document.getElementById("message_box"+news_id);
        objDiv.scrollTop = objDiv.scrollHeight;
    }
}

function share(news_id,title) {
    var url = window.location.href.split('/');
    if(url[0] == 'http:'){
        document.getElementById('sharepopup'+news_id).style.display = "block";
        document.getElementById('share_options'+news_id).style.display = "block";
    } else if(url[0] == 'https:'){
        const shareData = {
            title: title,
            text: 'न्यूज़ के लिए आज ही ऐप इंस्टॉल करें।\nhttps://play.google.com/store/apps/details?id=com.technotwist.primeapp.prime_app\n\nसंपर्क करें 70149-41008\nGmail: primeapp.co.in@gmail.com',
            url: 'https://primeapp.co.in/mobile/each-news/'+ news_id +''
        }
        navigator.share(shareData);
    }
}

function addComment(news_id) {
    let message = document.getElementById('comment_message' + news_id).value;
    if(message.length != 0){
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var message_time = hours + ':' + minutes + ' ' + ampm;
        $('#message_box'+news_id).append('<div class="card"><div class="row"><div class="col-2"><h3>'+ full_name.slice(0,1).toUpperCase() +'</h3></div><div class="col-10"><h6><b>'+ full_name +'</b></h6><p>'+ message +'</p><p class="time">'+ message_time +'</p></div></div></div>');
        var add_message = {
            message : message,
            news_id : news_id
        }
        $.ajax({
            url:"/mobile/addComment/",
            dataType: "jsonp",
            type:"POST",
            data:add_message,
            success: function(comment){
                console.log('success');
                document.getElementById('comment_message' + news_id).value = "";
            },
            error: function(err){
                console.log(err.status);
            }
        });
        var objDiv = document.getElementById("message_box"+news_id);
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    event.preventDefault();
    return false;
}

function getMoreNews() {
    $.ajax({
        url:"/mobile/getMoreNews/" + offset,
        dataType: "jsonp",
        type:"GET",
        success: function(news){
            // console.log(news);
            for(var i=0;i<news.length;i++){
                var news_card = createCard(news[i]);
                $('#bottom-section').append(news_card);
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });
    offset = offset +5;
}

function getMoreCategoryNews() {
    $.ajax({
        url:"/mobile/getMoreCategoryNews/" + category_name + "/" + getData + "/" +offset,
        dataType: "jsonp",
        type:"GET",
        success: function(news){
            // console.log(news);
            for(var i=0;i<news.length;i++){
                var news_card = createCard(news[i]);
                $('#bottom-section').append(news_card);
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });
    offset = offset +5;
}

function getMoreExpandedNews() {
    $.ajax({
        url:"/mobile/getMoreNews/" + offset,
        dataType: "jsonp",
        type:"GET",
        success: function(news){
            // console.log(news);
            for(var i=0;i<news.length;i++){
                var news_card = createExpandedCard(news[i]);
                $('#bottom-section').append(news_card);
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });
    offset = offset +5;
}

function getMoreExpandedCategoryNews() {
    $.ajax({
        url:"/mobile/getMoreCategoryNews/" + category_name + "/" + getData + "/" +offset,
        dataType: "jsonp",
        type:"GET",
        success: function(news){
            // console.log(news);
            for(var i=0;i<news.length;i++){
                var news_card = createExpandedCard(news[i]);
                $('#bottom-section').append(news_card);
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });
    offset = offset +5;
}

function getVideos() {
    $.ajax({
        url:"/mobile/getVideos/" + videooffset,
        dataType: "jsonp",
        type:"GET",
        success: function(news){
            // console.log(news);
            for(var i=0;i<news.length;i++){
                var news_card = createNewVideoCard(news[i]);
                $('#middle_section').append(news_card);
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });
    videooffset = videooffset +1;
}

function getMoreProfileNews(user_id) {
    $.ajax({
        url:"/mobile/getMoreUserNews/" + user_id + '/' + useroffset,
        dataType: "jsonp",
        type:"GET",
        success: function(news){
            // console.log(news);
            for(var i=0;i<news.length;i++){
                var news_card = createProfileCard(news[i],0);
                $('#bottom-section').append(news_card);
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });
    useroffset = useroffset +5;
}

function getMoreUserProfileNews(user_id) {
    $.ajax({
        url:"/mobile/getMoreUserNews/" + user_id + '/' + useroffset,
        dataType: "jsonp",
        type:"GET",
        success: function(news){
            // console.log(news);
            for(var i=0;i<news.length;i++){
                var news_card = createProfileCard(news[i],1);
                $('#bottom-section').append(news_card);
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });
    useroffset = useroffset +5;
}

function getMoreEachNews(city,news_id) {
    $.ajax({
        url:"/mobile/getMoreEachNews/" + city + '/' + news_id + '/' + useroffset,
        dataType: "jsonp",
        type:"GET",
        success: function(news){
            // console.log(news);
            for(var i=0;i<news.length;i++){
                var news_card = createProfileCard(news[i],3);
                $('#bottom-section').append(news_card);
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });
    useroffset = useroffset +5;
}


function closePopup() {
    document.getElementById('popup').style.display = "none";
    document.getElementById('cross').style.display = "none";
    document.getElementById('login-box').style.display = "none";
}

function closeNewsPopup(news_id) {
    document.getElementById('popup'+news_id).style.display = "none";
    document.getElementById('comment_box'+news_id).style.display = "none";
}

function closeSharePopup(news_id) {
    document.getElementById('sharepopup'+news_id).style.display = "none";
    document.getElementById('share_options'+news_id).style.display = "none";
}