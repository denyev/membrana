'use strict';

function createLinkOnHead(path, file) {
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", path + "/" + file);
  document.head.appendChild(link);
}

createLinkOnHead("css", "style.min.css");
createLinkOnHead("css/font", "font.min.css");

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

console.log('script.js is loaded');
