function openPopup(state){
    document.getElementById('state').innerHTML = state;
    document.getElementById('cities').innerHTML = '';
    $.ajax({
        url:"/mobile/getDistrict/" + state,
        dataType: "json",
        type:"GET",
        success: function(sub_category){
            document.getElementById('subCategoryPopup').style.transform = 'translateX(0%)';
            for(var i=0;i<sub_category.length;i++){
                var url = '/mobile/save_city/' + sub_category[i] + '/' + state;
                $('#cities').append('<tr><td><div class="card" onclick="openCityPopup(\''+sub_category[i]+'\',\''+state+'\')"><div class="row"><div class="col-10"><a>'+ sub_category[i] +'</a></div><div class="col-2"><a><span class="iconify" data-icon="eva:arrow-ios-forward-outline"></span></a></div></div></div></td></tr>');
            }
        },
        error: function(err){
            console.log(err.status);
        }
    });
}

function openCityPopup(city,state){
    document.getElementById('state1').innerHTML = state;
    document.getElementById('city').innerHTML = city;
    document.getElementById('district').innerHTML = '';
    $.ajax({
        url:"/mobile/getSubDistrict/" + city,
        dataType: "json",
        type:"GET",
        success: function(sub_category){
            document.getElementById('subCategoryCityPopup').style.transform = 'translateX(0%)';
            if(sub_category.length != 0){
                var url1 = '/mobile/save_city/' + city + '/' + state + '/' + (city + ' क्षेत्र');
                $('#district').append('<tr><td><div class="card" onclick="window.open(\''+ url1 +'\', \'_top\')"><div class="row"><div class="col-10"><a>'+ (city + ' क्षेत्र') +'</a></div><div class="col-2"><a><span class="iconify" data-icon="eva:arrow-ios-forward-outline"></span></a></div></div></div></td></tr>');
                for(var i=0;i<sub_category.length;i++){
                    var url = '/mobile/save_city/' + city + '/' + state + '/' + sub_category[i];
                    $('#district').append('<tr><td><div class="card" onclick="window.open(\''+ url +'\', \'_top\')"><div class="row"><div class="col-10"><a>'+ (sub_category[i].split('(')[0]).split(' ')[0] +'</a></div><div class="col-2"><a><span class="iconify" data-icon="eva:arrow-ios-forward-outline"></span></a></div></div></div></td></tr>');
                }
            } else {
                window.location.href = '/mobile/save_city/' + city + '/' + state + '/no_district';
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

function myCityFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myCityInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myCityTable");
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
    document.getElementById('subCategoryCityPopup').style.transform = 'translateX(100%)';
    document.getElementById('state1').innerHTML = '';
    document.getElementById('city').innerHTML = '';
    document.getElementById('district').innerHTML = '';
}

function closeCityPopup(){
    document.getElementById('subCategoryCityPopup').style.transform = 'translateX(100%)';
    document.getElementById('state1').innerHTML = '';
    document.getElementById('city').innerHTML = '';
    document.getElementById('district').innerHTML = '';
}