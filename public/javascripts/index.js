function openPopup(state){
    document.getElementById('state').innerHTML = '';
    document.getElementById('cities').innerHTML = '';
    $.ajax({
        url:"/mobile/getDistrict/" + state,
        dataType: "jsonp",
        type:"GET",
        success: function(sub_category){
            document.getElementById('subCategoryPopup').style.transform = 'translateX(0%)';
            document.getElementById('state').innerHTML = state;
            // console.log(sub_category);
            for(var i=0;i<sub_category.length;i++){
                var url = '/mobile/save_city/' + sub_category[i].name + '/' + state;
                $('#cities').append('<tr><td><div class="card" onclick="window.open(\''+ url +'\', \'_top\')"><div class="row"><div class="col-10"><a>'+ sub_category[i].name +'</a></div><div class="col-2"><a><span class="iconify" data-icon="eva:arrow-ios-forward-outline"></span></a></div></div></div></td></tr>');
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });
}

function myFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function closePopup(){
    document.getElementById('subCategoryPopup').style.transform = 'translateX(100%)';
    document.getElementById('state').innerHTML = '';
    document.getElementById('cities').innerHTML = '';
}