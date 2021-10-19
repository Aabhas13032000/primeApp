$(function(){
    if($('textarea#ta').length){
        CKEDITOR.replace('ta', {
            filebrowserUploadUrl: '/admin/upload',
            filebrowserUploadMethod: 'form'
        });
    }
});


