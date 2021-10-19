function submitData() {
    var myForm = document.getElementById('addNews');
    var tagname = document.getElementById('main-tag').innerHTML;
    document.getElementById('approvalbg').style.display = 'block';
    document.getElementById('approvalPopup').style.transform = 'translate(-50%,-50%) scale(1)';

    var form = new FormData();

    for(var i=0;i<$('#imagegroup .col-lg-2').length;i++){
        var file = document.getElementById('img' + i).files[0];
        if(file != undefined){
            form.append(`images${i}`, file);
        }
    }
    $.ajax({
        url : "/mobile/save-images",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data : form,
        success: function(response){
            // console.log(response);
            var form_final = new FormData();
            form_final.append('title', myForm.elements['title'].value);
            form_final.append('desc', myForm.elements['desc'].value);
            form_final.append('tag', tagname);
            form_final.append('images', response);
            $.ajax({
                url : "/mobile/add-news",
                type: "POST",
                cache: false,
                contentType: false,
                processData: false,
                data : form_final,
                success: function(data){
                    console.log(data);
                    window.location.href = '/mobile/profile';
                },
                error: function(err){
                    console.log(err.status);
                }
            });
        },
        error: function(err){
            console.log(err.status);
        }
    });

    event.preventDefault();
    return false;
}

function openPopup(city,tagname){
    $('#form').append('<form id="addNews" onsubmit="return submitData()" enctype="multipart/form-data"> <div class="form-group"> <input type="text" class="form-control" id="title" name="title" placeholder="यहां शीर्षक दर्ज करें" required> </div> <div class="form-group"> <textarea type="text" class="form-control" id="desc" name="desc" placeholder="यहां विवरण दर्ज करें" rows="20" required></textarea> </div> <div class="form-group"> <div class="row" style="margin: 0;width: 100%;padding: 0"> <div class="col-10" style="padding: 0"> <label for="">Add Images(Select Multiple Images)</label> </div> <div class="col-2" style="padding: 0;text-align: right"> <a onclick="addimage()" style="text-decoration: none;font-size: 1.5rem"><i class="fas fa-plus-circle"></i></a> </div> </div> <div class="row" id="imagegroup"> <div class="col-lg-2 col-md-3 col-sm-4 col-6" style="overflow: hidden;padding: 0;"> <div class="row" style="margin: 0;width: 100%;padding: 0"> <div class="col-8" style="padding: 0;display: flex;align-items: center;overflow: hidden;"> <div class="form-group" style="width: 100%;"> <input type="file" class="form-control-file news-images" name="images" id="img0" accept="image/*" onchange="showPreview(\'0\',this.files)"> <input type="hidden" name="image" id="image0" value=""> </div> </div> <div class="col-4" style="padding: 5px;display: flex;overflow: hidden;justify-content:flex-end"> <a id="forFirstImage" onclick="deleteimage(\'0\')" style="text-decoration: none;font-size: 1.5rem;color: #DC3545;display: none"><i class="fas fa-times-circle"></i></a> </div> <div class="col-12" style="padding: 5px 15px"> <img src="/images/no_image.jpeg" alt="" id="image-preview0" style="width: 100%"> </div> </div> </div> </div> </div> <div class="form-group"> <button class="btn btn-primary" type="submit">Submit For approval</button> </div> </form>');
    document.getElementById('tagname').innerHTML = city + ' ' + '<span id="main-tag">' + tagname + '</span>';
    document.getElementById('addNewsPopup').style.transform = 'translateX(0%)';
}

function closePopup(){
    document.getElementById('approvalbg').style.display = 'none';
    document.getElementById('approvalPopup').style.transform = 'translate(-50%,-50%) scale(0)';
    document.getElementById('addNewsPopup').style.transform = 'translateX(100%)';
    document.getElementById('tagname').innerHTML = '';
    document.getElementById('form').innerHTML = '';
}

function showPreview(id,files){
    if(files) {
        if(id == '0'){
            document.getElementById('forFirstImage').style.display = 'block';
        }
        var reader = new FileReader();

        reader.onload = function(event) {
            $('#image-preview'+ id).attr('src',event.target.result);
        }
        reader.readAsDataURL(files[0]);
    }
}

function deleteimage(i){
    if(i == '0'){
        document.getElementById('img0').value = '';
        var $source = $('#image-preview0');
        $source[0].src = '';
        document.getElementById('forFirstImage').style.display = 'none';
    } else {
        var a = '#removeThisImageColumn' + i;
        $(a).remove();
    }
}

var count1 = 1;
function addimage(){
    $('#imagegroup').append('<div class="col-lg-2 col-md-3 col-sm-4 col-6" style="overflow: hidden;padding:0" id="removeThisImageColumn'+ count1 +'">\n' +
        '                                <div class="row" style="margin: 0;width: 100%;padding: 0">\n' +
        '                                    <div class="col-8" style="padding: 0;display: flex;align-items: center;overflow: hidden;">\n' +
        '                                        <div class="form-group">\n' +
        '                                            <input type="file" class="form-control-file news-images" name="images" id="img'+ count1 +'" accept="image/*" onchange="showPreview(\''+ count1 +'\',this.files)"><input type="hidden" name="image" id="image'+ count1 +'">\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                    <div class="col-4" style="padding: 5px;display: flex;overflow: hidden;justify-content:flex-end">\n' +
        '                                        <a id="removeThisImage'+ count1 +'" onclick="deleteimage(\''+ count1 +'\')" style="text-decoration: none;font-size: 1.5rem;color: #DC3545;"><i class="fas fa-times-circle"></i></a>\n' +
        '                                    </div>' +
        '                                    <div class="col-12" style="padding: 5px 15px">\n' +
        '                                        <img src="/images/no_image.jpeg" alt="" id="image-preview'+ count1 +'" style="width: 100%">\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                            </div>');
    count1++;
}