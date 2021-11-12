var news_id = document.getElementById('news_id').value;

    // function increaseViewCount() {
    //     $.ajax({
    //         url:"/increaseCount/" + news_id,
    //         dataType: "jsonp",
    //         type:"GET",
    //         success: function(news){
    //             console.log('success');
    //         },
    //         error: function(err){
    //             console.log(err.status);
    //         }
    //     });
    // }

    // window.onload = increaseViewCount();


    var parser = new DOMParser();
    var h = document.getElementById('h').value;
    var k = parser.parseFromString(h,'text/html');
    k.body.style.backgroundColor = "white";
    document.getElementById('desc').append(k.body);
    var k1 = 20;
    function getMoreNews(){
        // $.ajax({
        //     url:"/getSimiliarNews/" + sc_name + '/' + k1,
        //     dataType: "jsonp",
        //     type:"GET",
        //     success: function(news){
        //         if(news.length != 0){
        //             for(var i = 0;i<news.length;i++){
        //                 if(news[i].front_image_path != null){
        //                             if(news[i].front_image_path.slice(0,5) == "https"){
        //                                 var a = news[i].front_image_path;
        //                             } else {
        //                                 var a = '/image_files/' + news[i].news_id + '/' + news[i].front_image_path;
        //                             }
        //                         }
        //                 var b = '/images/logo/01.png';

        //                 $('#add-news').append('');
        //                 $("img").bind("error",function(){
        //                     // Replacing image source
        //                     $(this).attr("src","/images/logo/01.png");
        //                 });
        //             }
        //         }
        //     },
        //     error: function(err){
        //         console.log(err.status);
        //     }
        // });
        k1 = k1 + 5;
    }
    $(document).ready(function (){
        $("img").bind("error",function(){
            // Replacing image source
            $(this).attr("src","/images/logo/01.png");
        });
    });