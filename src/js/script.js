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

// preventDefaultForElementList('a.btn');

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

    $('.carousel').slick('setPosition');
    $('.carousel__thumbnails').slick('setPosition');

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
    // swipe: true,
    // autoplay: true,
    // autoplaySpeed: 4000,
    // slide: 'a',
    asNavFor: '.carousel__thumbnails',
  }).magnificPopup({
    type: 'image',
    delegate: 'a:not(.slick-cloned)',
    gallery: {
      enabled: true
    },
    callbacks: {
      open: function () {
        var current = $('.carousel').slick('slickCurrentSlide');
        $('.carousel').magnificPopup('goTo', current);
      },
      beforeClose: function () {
        $('.carousel').slick('slickGoTo', parseInt(this.index));
      }
    }
  });

  $('.carousel').slick('setPosition');

  $('.carousel__thumbnails').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    fade: false,
    draggable: false,
    // swipe: true,
    asNavFor: '.carousel',
    arrows: false,
    dots: false,
    // centerMode: true,
    focusOnSelect: true,
    centerMode: false,
    centerPadding: 0,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
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
    dotsClass: 'team-carousel__dots',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
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
    nextArrow: '<i class="reviews__arrow reviews__arrow--right"></i>',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true
        }
      }
    ]
  }).magnificPopup({
    type: 'image',
    delegate: 'a:not(.slick-cloned)',
    gallery: {
      enabled: true
    },
    callbacks: {
      open: function () {
        var current = $('.reviews__list').slick('slickCurrentSlide');
        $('.reviews__list').magnificPopup('goTo', current);
      },
      beforeClose: function () {
        $('.reviews__list').slick('slickGoTo', parseInt(this.index));
      }
    }
  });

  $('.reviews__img-wrap').matchHeight();

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
    nextArrow: '<i class="brands__arrow brands__arrow--right"></i>',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true
        }
      }
    ]
  })

// /.brands__list

// Ajax Submit Form

/*
  jQuery.fn.sendForm = function (options) {
    options = $.extend({
      successTitle: "Спасибо, что выбрали нас!",
      successText: "Мы свяжемся с Вами в ближайшее время.",
      errorTitle: "Сообщение не отправлено!",
      errorSubmit: "Ошибка отправки формы!",
      errorNocaptcha: "Вы не заполнили каптчу",
      errorCaptcha: "Вы не прошли проверку каптчи",
      mailUrl: "../send.php",
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
*/

//

  $('form').submit(function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    var btn = $(this).find('[type="submit"]');
    var btnClose = $('form + .mfp-close');
    // btn.prop('disabled', true);
    btn.val('Загрузка...');
    $.ajax({
      type: 'POST',
      url: '../send.php',
      data: data,
      success: function (data) {
        swal({
          type: 'success',
          title: 'Заявка отправлена.',
          text: 'Спасибо за обращение!'
        });
        btn.val('Отправлено');
        // btn.prop('disabled', true);
        setTimeout(function () {
          btnClose.click();
        }, 2000);
      },
      error: function (data) {
        swal({
          type: 'error',
          title: 'Оправка не удалась!',
          text: 'Что-то пошло не так :-('
        });
        btn.val('Повторить отправку');
        btn.prop('disabled', false);
      }
    });
  });

// /Ajax Submit Form

// #callbackForm

  $('.call__btn').magnificPopup({
    type: 'inline',
    fixedContentPos: false,
    fixedBgPos: true,
    overflowY: 'hidden',
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'mfp-top-up',
    tClose: 'Закрыть (Esc)',
    closeBtnInside: true,
    closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>'
  });

  // $('#callbackForm').sendForm({
  //   successTitle: "Ваша заявка принята!",
  //   successText: "Наш сотрудник свяжется с Вами в самое ближайшее время.",
  //   autoClose: true,
  //   autoCloseDelay: 3000,
  //   mailUrl: "../send.php"
  // });

// /#callbackForm

// #calculateForm

  $('.calculator-request__btn, .btn__calculate').magnificPopup({
    type: 'inline',
    fixedContentPos: false,
    fixedBgPos: true,
    overflowY: 'hidden',
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'mfp-top-up',
    tClose: 'Закрыть (Esc)',
    closeBtnInside: true,
    closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>'
  });

  // $('#calculateForm').sendForm({
  //   successTitle: "Ваша заявка принята!",
  //   successText: "Наш сотрудник свяжется с Вами в самое ближайшее время.",
  //   autoClose: true,
  //   autoCloseDelay: 3000,
  //   mailUrl: "../send.php"
  // });

// /#calculateForm

// .calculate

  $('#calculateFile').change(function () {
    var filename = $(this).val().replace(/.*\\/, '');
    $('#calculateFilename').val(filename);
  });

// /.calculate

//  scroll

  var scroll = new SmoothScroll('.main-nav__link, .main-nav__btn a, .menu__link', {
    // header: '[data-scroll-header]'
  });

//  /scroll

//  A link handler for the mobile menu

  $('.main-nav__link, .main-nav__btn a, .menu__link').on('click touchend touchstart', function () {
    $('.page-header__checkbox').prop('checked', false);
  });


})(jQuery);

document.addEventListener('change', function (event) {
  var element = event.target;
  if (element && element.matches('.form-element-field')) {
    element.classList[element.value ? 'add' : 'remove']('js-hasvalue');
  }
});

// jQuery

console.log('script.js is loaded');
