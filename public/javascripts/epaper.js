function moveleft(id){
    // console.log(id);
    const conent = document.querySelector('#insert-epaper'+ id);
    // if(conent.scrollLeft > 1050){
        // conent.scrollLeft = -1050;
    // } else {
        conent.scrollLeft -= 50;
    // }
    // event.preventDefault();
}
function moveright(id){
    // console.log(id);
    const conent = document.querySelector('#insert-epaper'+ id);
    // if(conent.scrollLeft > 1050){
    // conent.scrollLeft = -1050;
    // } else {
    conent.scrollLeft += 50;
    // }
    // event.preventDefault();
}
var k = document.getElementById('k0').value;
var length = parseInt(document.getElementById('length').value);
var j = 0
function getData(){
    $.ajax({
        url:"/mobile/getEpaper/" + k,
        dataType: "jsonp",
        type:"GET",
        success: function(epaper){
            if(epaper.length !=0){
                    console.log(epaper[0].created_at)
                    var date = new Date(epaper[0].created_at);
                    console.log(date.toString().slice(4,15));
                    $('#insert-epaper' + epaper[0].category).append('<a href="/mobile/pdf/'+epaper[0].id+'" style="width: 180px;background-color: transparent;height: 100%;top: 0%;position: relative;overflow: hidden"><img src="/images/thumbnail/'+epaper[0].thumbnail+'" alt="" width="90%" height="220px" style="box-shadow: 0px 0px 10px rgba(0,0,0,0.2)"><h6 style="margin-top: 5px">'+date.toString().slice(4,15)+'</h6></a>');
                $("img").bind("error",function(){
                    // Replacing image source
                    $(this).attr("src","/images/no_image.jpeg");
                });
            }
            j++;
            if(document.getElementById('k' + j) != null) {
                k = document.getElementById('k' + j).value;
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });

    setInterval(function (){
        if(j<length){
            $.ajax({
                url:"/mobile/getEpaper/" + k,
                dataType: "jsonp",
                type:"GET",
                success: function(epaper){
                    if(epaper.length !=0){
                        var date = new Date(epaper[0].created_at);
                        $('#insert-epaper' + epaper[0].category).append('<a href="/mobile/pdf/'+epaper[0].id+'" style="width: 180px;background-color: transparent;height: 100%;top: 0%;position: relative;overflow: hidden"><img src="/images/thumbnail/'+epaper[0].thumbnail+'" alt="" width="90%" height="220px" style="box-shadow: 0px 0px 10px rgba(0,0,0,0.2)"><h6 style="margin-top: 5px">'+date.toString().slice(4,15)+'</h6></a>');
                        $("img").bind("error",function(){
                            // Replacing image source
                            $(this).attr("src","/images/no_image.jpeg");
                        });
                    }
                    j++;
                    if(document.getElementById('k' + j) != null) {
                        k = document.getElementById('k' + j).value;
                    }
                },
                error: function(err){
                    console.log(err.status);
                }
            });
        }
    },1000);
}
$(document).ready(function (){
    $("img").bind("error",function(){
        // Replacing image source
        $(this).attr("src","/images/no_image.jpeg");
    });
});