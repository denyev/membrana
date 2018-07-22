'use strict';

document.documentElement.classList.remove('no-js');

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

(function ($) {
  $(document).ready(function () {
    $('input[type="tel"]').mask('+7 (000) 000-00-00');
  });

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

  $('.carousel').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    draggable: false,
    asNavFor: '.carousel__thumbnails',
  }).magnificPopup({
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
  }).magnificPopup({
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

// .brands__list

  $('.brands__list').slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    fade: false,
    draggable: false,
    prevArrow: '<i class="brands__arrow brands__arrow--left"></i>',
    nextArrow: '<i class="brands__arrow brands__arrow--right"></i>'
  })

// /.brands__list

// Ajax Submit Form

  jQuery.fn.sendForm = function (options) {
    options = $.extend({
      successTitle: "Спасибо, что выбрали нас!",
      successText: "Мы свяжемся с Вами в ближайшее время.",
      errorTitle: "Сообщение не отправлено!",
      errorSubmit: "Ошибка отправки формы!",
      errorNocaptcha: "Вы не заполнили каптчу",
      errorCaptcha: "Вы не прошли проверку каптчи",
      mailUrl: "../submit.php",
      autoClose: false,
      autoCloseDelay: 5000
    }, options);

    var make = function () {
      var $this = $(this);
      $(this).submit(function () {
        function errorRes(errorMessage) {
          $this.find('.btn-submit').parents('.form__form').removeClass('sending');
          $this.append('<div class="form__error">' + errorMessage + '</div>');
          setTimeout(function () {
            $this.find('.form__error').remove();
          }, 5000);
        }

        var data = $(this).serialize();
        $.ajax({
          url: options.mailUrl,
          type: "POST",
          data: data,
          beforeSend: function () {
            $this.find('.btn-submit').parents('.form__form').addClass('sending');
          },
          success: function (res) {
            if (res == 1) {
              $this[0].reset();
              grecaptcha.reset();
              $this.find('.form__hide-success').slideUp().delay(5000).slideDown();
              $this.find('.btn-submit').parents('.form__form').removeClass('sending');
              $this.find('.form__hide-success').after('<div class="form__sys-message"></div>');
              $this.find('.form__sys-message').html('<div class="form__success-title">'
                  + options.successTitle
                  + '</div><p class = "form__success-text" >'
                  + options.successText + '</p>');
              setTimeout(function () {
                $this.find('.form__sys-message').fadeOut().delay(3000).remove();
                if (options.autoClose) {
                  $.magnificPopup.close();
                }
              }, options.autoCloseDelay);
            } else if (res == 2) {
              errorRes(options.errorNocaptcha);
            } else if (res == 3) {
              errorRes(options.errorCaptcha);
            } else {
              errorRes(options.errorSubmit);
            }
          },
          error: function () {
            errorRes(options.errorSubmit);
          }
        });
        return false;
      });

    } // end make

    return this.each(make);
  };

// /Ajax Submit Form

// #callbackForm

  $('.call__btn').magnificPopup({
    type: 'inline',
    fixedContentPos: false,
    fixedBgPos: true,
    overflowY: 'auto',
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'mfp-top-up',
    tClose: 'Закрыть (Esc)',
    closeBtnInside: true,
    closeMarkup: '<button title="%title%" type="button" class="mfp-close">test &#215;</button>',

  });

  $('#callbackForm').sendForm({
    successTitle: "Ваша заявка принята!",
    successText: "Наш сотрудник свяжется с Вами в самое ближайшее время.",
    autoClose: true,
    autoCloseDelay: 3000,
    mailUrl: "submit.php"
  });

// /#callbackForm


})(jQuery);

console.log('script.js is loaded');
