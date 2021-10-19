var category_length = parseInt(document.getElementById('category_length').value);

function checkTab() {
    var scrollLeftValue = document.getElementById('tab-boxes').scrollLeft;
    var offsetWidthValue = document.getElementById('tab-boxes').offsetWidth;
    var m = scrollLeftValue/offsetWidthValue;
    for(var i=0;i<(category_length+2);i++){
        if(document.getElementById('selected' + parseInt(i)).classList.contains('selected')) {
            document.getElementById('selected' + parseInt(i)).classList.remove('selected');
        }
        if(document.getElementById('line' + parseInt(i)).classList.contains('selected-line')) {
            document.getElementById('line' + parseInt(i)).classList.remove('selected-line');
        }
    }
    document.getElementById('selected' + parseInt(m)).classList.add('selected');
    document.getElementById('line' + parseInt(m)).classList.add('selected-line');
    var elementPos = document.getElementById('inner-tab' + parseInt(m)).getBoundingClientRect().left;
    if(m == parseInt(m)){
        document.getElementById('tabs').scrollBy(elementPos,0);
    }
}