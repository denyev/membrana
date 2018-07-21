'use strict';

document.documentElement.classList.remove('no-js');

// window.onload = function () {

function createLinkOnHead(path, file) {
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", path + "/" + file);
  document.head.appendChild(link);
}

createLinkOnHead("css", "style.min.css");
createLinkOnHead("css/font", "font.min.css");
createLinkOnHead("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2", "animate.min.css");

function addBackgroundImg(element, url) {
  element = document.querySelector(element);
  element.style.backgroundImage = 'url(' + url + ')';
}

addBackgroundImg('.page-header', '/img/header/main-bg.jpg');

function preventDefaultForElementList(elementList) {
  elementList = document.querySelectorAll(elementList);
  var singleElement = '';

  for (var i = 0; i < elementList.length; i++) {
    singleElement = elementList[i];

    singleElement.addEventListener('click', function (event) {
      event.preventDefault();
    });
  }
}

preventDefaultForElementList('a.btn');

document.addEventListener('change', function (event) {
  var element = event.target;
  if (element && element.matches('.form-element-field')) {
    element.classList[element.value ? 'add' : 'remove']('js-hasvalue');
  }
});

// jQuery

// (function () {
//
//   function loadScript(url, callback) {
//
//     var script = document.createElement('script')
//     script.type = "text/javascript";
//
//     if (script.readyState) { // IE
//       script.onreadystatechange = function () {
//         if (script.readyState == 'loaded' || script.readyState == 'complete') {
//           script.onreadystatechange = null;
//           callback();
//         }
//       };
//     } else { // Others
//       script.onload = function () {
//         callback();
//       };
//     }
//
//     script.src = url;
//     document.getElementsByTagName('head')[0].appendChild(script);
//     console.log(url + ' is loaded');
//   }
//
//   loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js', function () {
//     var $ = window.jQuery;
//     return $;
//   });

//  loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js', function () {
$(document).ready(function () {
  $('input[type="tel"]').mask('+7 (000) 000-00-00');
});
//   })();
// })();

// .vertical-tab

$('.vertical-tab__head').click(function (event) {
  event.preventDefault();
  $(this).addClass('vertical-tab__head--active');
  $(this).siblings().removeClass('vertical-tab__head--active');

  var ph = $(this).parent().height();
  var ch = $(this).next().height();

  if (ch > ph) {
    $(this).parent().css({
      'min-height': ch + 'px'
    });
  } else {
    $(this).parent().css({
      'height': 'auto'
    });
  }
});

function tabParentHeight() {
  var ph = $('.vertical-tab').height();
  var ch = $('.vertical-tab__inner').height();
  if (ch > ph) {
    $('section').css({
      'height': ch + 'px'
    });
  } else {
    $(this).parent().css({
      'height': 'auto'
    });
  }
}

$(window).resize(function () {
  tabParentHeight();
});

$(document).resize(function () {
  tabParentHeight();
});
tabParentHeight();

// /.vertical-tab

// .carousel

var $carousel = $('.carousel');

$carousel
  .slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    draggable: false,
    asNavFor: '.carousel__thumbnails',
  })
  .magnificPopup({
    type: 'image',
    delegate: 'a:not(.slick-cloned)',
    gallery: {
      enabled: true
    },
    callbacks: {
      open: function () {
        var current = $carousel.slick('slickCurrentSlide');
        $carousel.magnificPopup('goTo', current);
      },
      beforeClose: function () {
        $carousel.slick('slickGoTo', parseInt(this.index));
      }
    }
  });

$('.carousel__thumbnails').slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  fade: false,
  draggable: true,
  asNavFor: '.carousel',
  arrows: false,
  dots: false,
  centerMode: true,
  focusOnSelect: true
});

// /.carousel

// .team-carousel

$('.team-carousel').slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  fade: false,
  dots: true,
  arrows: false,
  dotsClass: 'team-carousel__dots'
});

// /.team-carousel

// .reviews__list

$('.reviews__list').slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  fade: false,
  draggable: false,
  prevArrow: '<i class="reviews__arrow reviews__arrow--left"></i>',
  nextArrow: '<i class="reviews__arrow reviews__arrow--right"></i>'
})
  .magnificPopup({
    type: 'image',
    delegate: 'a:not(.slick-cloned)',
    gallery: {
      enabled: true
    },
    callbacks: {
      open: function () {
        var current = $carousel.slick('slickCurrentSlide');
        $carousel.magnificPopup('goTo', current);
      },
      beforeClose: function () {
        $carousel.slick('slickGoTo', parseInt(this.index));
      }
    }
  });

// /.reviews__list


// } // end window.onload

console.log('script.js is loaded');
