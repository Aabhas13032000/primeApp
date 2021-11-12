var category_length = 5;

function checkTab() {
    var scrollLeftValue = document.getElementById('tab-boxes').scrollLeft;
    var offsetWidthValue = document.getElementById('tab-boxes').offsetWidth;
    var m = scrollLeftValue/offsetWidthValue;
    for(var i=0;i<(category_length);i++){
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

var myCarousel = document.querySelector('#carouselExampleSlidesOnly')
var carousel = new bootstrap.Carousel(myCarousel, {
    wrap: false
});

myCarousel.addEventListener('touchend',() => {
    var selected_value = document.getElementsByClassName('selected-button active')[0].getAttribute('data-bs-slide-to');

    console.log(selected_value);

    document.getElementsByClassName('tab-buttons selected')[0].classList.remove('selected');
    document.getElementsByClassName('line selected-line')[0].classList.remove('selected-line');

    document.querySelectorAll(`[data-selected='${selected_value}']`)[0].classList.add('selected');
    document.querySelectorAll(`[data-selected-line='${selected_value}']`)[0].classList.add('selected-line');

    var elementPos = document.getElementById('inner-tab' + selected_value).getBoundingClientRect().left;
    document.getElementById('tabs').scrollBy(elementPos,0);
},);

function selectActiveTab() {
    var selected_value = document.getElementsByClassName('selected-button active')[0].getAttribute('data-bs-slide-to');

    document.getElementsByClassName('tab-buttons selected')[0].classList.remove('selected');
    document.getElementsByClassName('line selected-line')[0].classList.remove('selected-line');

    document.querySelectorAll(`[data-selected='${selected_value}']`)[0].classList.add('selected');
    document.querySelectorAll(`[data-selected-line='${selected_value}']`)[0].classList.add('selected-line');

    var elementPos = document.getElementById('inner-tab' + selected_value).getBoundingClientRect().left;
    document.getElementById('tabs').scrollBy(elementPos,0);
}