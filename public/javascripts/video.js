var k = 1;
    setInterval(function (){
            $.ajax({
                url:"/mobile/getVideos/" + k,
                dataType: "jsonp",
                type:"GET",
                success: function(videos){
                    if(videos.length !=0){
                        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                        var match = (videos[0].url).match(regExp);
                        var str = (match&&match[7].length==11)? match[7] : false;
                        $('#moreVideo').append('<div class="col-lg-3 col-md-12" style="padding: 5px"><div class="card c4" style="position: relative"><img src="/images/extra1.png" alt="" style="position: absolute;top:18px;width: 40px;height: 40px;border-radius: 50%;left: 19px"><div class="video"><iframe width="100%" height="100%" id="youtube-video'+k+'"  src="https://www.youtube.com/embed/'+str+'?controls=1" frameborder="0"  allowfullscreen></iframe><br></div><br><a href="/each-news/'+videos[0].news_id+'" style="text-decoration: none;color: black"><p style="text-align: justify"><b style="color: '+videos[0].hcolor+'">'+videos[0].title+'</b>:'+videos[0].short_description+'</p></a><div class="row" style="width: 100%;padding: 0;margin: 0"><div class="col-8 col-lg-7"><p class="cat">'+( videos[0].sc_name != null ? videos[0].sc_name : videos[0].c_name )+'</p></div><div class="col-1 col-lg-1"><p><a href="https://www.facebook.com/sharer.php?u=<%= website %>/each-news/'+ videos[0].news_id +'" target="_blank" style="color: #B4B4B4;text-decoration: none"><i class="fab fa-facebook-f"></i></a></p></div><div class="col-1 col-lg-1"><p><a href="https://wa.me/?text= http://<%= website %>/each-news/'+ videos[0].news_id +'"  target="_blank" style="color: #B4B4B4;text-decoration: none"><i class="fab fa-whatsapp"></i></a></p></div><div class="col-1 col-lg-1"><p><a href="https://twitter.com/share?url=http://<%= website %>/each-news/'+videos[0].news_id+'&text=" data-show-count="false" target="_blank" style="color: #B4B4B4;text-decoration: none"><i class="fab fa-twitter"></i></a></p></div></div></div><br></div>')
                    }
                    k=k+1;
                },
                error: function(err){
                    console.log(err.status);
                }
            });
    },1000);