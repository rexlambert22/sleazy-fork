// ==UserScript==
// @name         Erome Improved
// @namespace    http://tampermonkey.net/
// @version      2.2
// @license      MIT
// @description  Infinite scroll. Filter photo albums. Filter photos in albums. Skips 18+ dialog
// @author       smartacephale
// @supportURL   https://github.com/smartacephale/sleazy-fork
// @match        *://*.erome.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erome.com
// @run-at       document-idle
// @grant        none
// @downloadURL  https://update.sleazyfork.org/scripts/492883/Erome%20Improved.user.js
// @updateURL    https://update.sleazyfork.org/scripts/492883/Erome%20Improved.meta.js
// ==/UserScript==
/* globals jQuery, $, LazyLoad */

const LOGO = `
⡝⣝⢝⢝⢝⢝⢝⢝⢍⠭⡩⢍⠭⡩⡍⡭⢍⠭⡍⡭⡙⡍⢏⢝⠩⡩⡋⡍⡏⡝⡝⡽⡹⡹⡹⡙⡝⡙⡝⢍⠭⡩⢍⠭⡩⡩⡩⡩⡩⡍⡭⡩⡍⣍⢫⡩⡹⡩⡹⡩
⡱⡱⡕⡇⣏⢎⢮⣪⢪⡪⣪⢪⡪⣪⢪⡪⣪⡪⡪⡢⡣⢪⢢⡣⡑⢌⠆⡪⡪⡪⡚⡜⢜⢸⠨⡊⡎⢎⢮⢣⠯⢮⠳⡝⡼⡪⢮⢣⠳⡕⠵⡕⠧⡳⢕⠧⡫⠮⡳⡹
⢕⢝⡜⡎⣎⢧⢓⢎⠇⠕⢅⠣⡩⡘⡌⡎⡆⢇⠕⡕⢅⢇⢷⢱⢘⢔⢅⢇⢕⢅⠇⡪⢨⢂⠣⡱⡘⢜⢌⢎⢎⠢⡃⠕⡌⢌⢢⠡⡱⢘⠌⡢⢃⢊⢢⢑⢌⢊⢆⠪
⢳⢱⢕⢝⢜⢜⢎⢇⢇⠣⡡⢱⢐⢅⢇⠎⢜⠰⡑⡜⢜⠜⡜⡜⡌⡺⡵⡣⢣⢑⢌⠢⡑⡐⡑⠔⢅⠣⡊⡆⢇⡳⡘⢌⠌⢆⠆⡃⡊⡢⡑⢌⠢⡑⢅⠆⡕⢌⢢⠱
⡱⡣⡳⡹⡸⡱⡕⣕⢅⠕⢌⢆⢇⠣⢅⠣⡑⢅⢊⠌⡢⡑⡕⡕⡧⡣⣏⠎⢜⠰⡐⡡⠂⢌⠢⢑⠅⢕⢑⠜⡌⡎⢎⢇⢕⢑⢌⠪⡐⡌⢌⠆⡣⢡⠱⡨⡂⡣⠪⡘
⡝⣜⢕⢝⡜⣕⢕⢕⢢⢑⢕⠜⡌⢎⠪⡨⠨⢂⠢⠨⡐⢌⠆⡇⡯⣺⠸⡈⢎⢪⢐⢐⠡⠡⡈⠢⠡⡑⢌⢪⢘⢌⢎⢎⢎⢆⠥⡑⡌⡌⠆⢕⢌⠢⡑⢔⢌⢪⢘⢌
⢪⢎⢮⢣⡣⡇⡗⡝⢔⢅⢇⢕⢑⢅⠕⠌⢌⠢⠨⢂⠪⡐⢕⢕⢝⢜⠅⡊⢜⢔⢕⢐⢅⢑⠨⡈⡊⢌⢢⢑⢅⢣⠪⡢⡣⡳⡹⡸⡲⣘⢌⠢⡂⡣⢊⠢⡱⢨⠢⡱
⡣⡳⣱⢣⡣⡳⣱⢹⠸⡰⡑⡌⣊⠢⡡⠃⠅⠌⢌⢂⠕⢌⢪⢢⢣⡓⡨⠨⡸⡸⡐⢅⠢⡂⠕⡐⢌⠢⡑⢌⢆⢣⠱⡑⡕⡕⡵⡱⡱⡱⡕⣕⡑⢌⠢⡱⡘⠔⡅⢕
⢎⢧⢳⡱⡕⣝⢜⢜⢜⢔⠱⡨⠢⡑⢌⠌⡊⢌⢂⠢⡡⡑⡱⢸⢸⡐⠌⠌⢜⠔⢅⠅⢕⠨⠨⡂⢅⢊⢌⠢⡱⡘⢜⢸⢸⢸⢸⡪⡪⡎⣎⢎⢮⢐⠡⢂⠪⡨⠢⡡
⢫⡪⣣⢣⡫⡪⡎⡇⡇⢎⢪⠨⡊⡌⡢⢑⠨⡐⡐⡡⢂⠪⠨⡊⡆⡇⠌⠌⡆⡣⢡⠡⡑⢌⢊⠔⠡⡂⢆⠣⡪⢸⢘⠬⡒⡕⡵⡱⣣⢣⢇⢗⡕⢔⠡⡡⡑⢌⠪⡰
⣕⢝⡜⣎⢞⢜⢎⢎⢎⠪⡢⢱⠨⡂⡪⢐⠡⢂⢊⠄⢕⠨⢊⠢⡑⢮⢨⢨⢢⢑⠅⡊⢔⠡⢂⠪⡨⢌⠢⡃⢎⢪⠸⡸⡸⡸⡸⣕⢕⢧⡫⡇⡇⢕⠨⣂⢪⢂⢇⢎
⡎⡧⡳⡱⣕⢝⢎⢇⢇⢣⠪⡢⡃⡪⢂⠕⢌⠢⠡⡊⢔⠡⡡⡑⢕⢕⢵⡱⣑⢢⠱⠨⡂⢅⢅⠕⡐⢅⠕⡜⡸⡨⡪⡪⡪⡪⡳⣕⢝⡵⣝⢜⢬⢲⢹⢸⢜⣞⢜⢕
⡮⣚⢎⢧⡣⣫⢺⢸⢸⠰⡱⡨⢢⢑⢅⠪⡂⢕⢑⠌⡢⢑⠰⡘⢔⢱⢱⡣⡪⢢⢃⢇⠪⠢⡑⢌⢊⢆⠣⡊⡆⢇⢎⢆⢇⢗⢽⢜⡵⡝⣜⢜⡜⡜⡜⡜⣝⢜⢜⢌
⣞⢜⡕⣇⢏⢮⢺⢸⢸⢸⠰⡡⢣⢑⢌⢪⠨⡢⠢⡑⡌⡢⠣⡑⢕⢱⠱⡕⡕⢕⠱⡐⢕⢑⢅⠕⢅⠆⡇⡣⡱⡱⡱⡱⡱⣝⢕⢧⡳⡱⢕⢗⢕⢵⡱⡣⡣⣣⢣⢃
⡪⣇⢯⢪⢎⡗⡵⡱⡑⡕⡕⢕⢅⢕⢜⠰⡑⡌⢎⢢⠱⡘⢜⠸⡘⡜⡜⡵⡱⡱⡱⡑⢕⠱⡨⡊⡪⡸⡨⡪⡪⡊⡎⣎⢞⣎⢗⡵⣳⢕⡝⡜⡕⡕⡜⡜⡵⣳⢣⡳
⢽⡸⣪⢳⢕⢽⢜⢜⢌⢎⢎⢎⢆⢣⢊⢎⠜⡌⢆⢕⢱⠸⡘⡜⡜⡜⡜⡵⡣⡣⡪⡪⢪⠪⡢⢣⢱⢸⢘⢌⢎⢎⢎⢮⡳⡵⣝⡾⣵⢝⣮⣺⡸⡜⡜⣎⢞⡵⡫⣫
⡞⡮⡮⡳⣝⢮⢳⠱⡑⢕⢱⢱⢱⢑⢅⢇⢕⠕⡕⡅⡇⡇⡇⡇⡇⡇⡗⣝⡎⡎⡎⡎⡎⡎⢎⢎⢪⢪⢪⢪⡪⣪⢳⢝⡽⣝⣗⢿⣕⡝⣞⣞⢾⢽⣺⢺⢽⡪⡣⡣
⢏⢇⢏⢎⢎⠪⡂⢇⢃⢣⠱⡸⡸⡸⡸⡸⡸⡸⡸⡸⡸⡸⡸⡸⡸⡜⡎⣞⢎⢮⢪⢪⢪⢪⢪⢪⢪⡪⡪⡣⣣⢣⢏⣗⢽⢜⣮⡳⣕⢝⢎⢮⢪⢳⢸⢪⡳⣝⣞⣮
⠔⡅⢕⢅⢣⠱⡸⢨⢪⠢⡣⢢⢪⢪⢪⠪⡪⠸⡘⢜⢜⢜⡜⡎⡮⡪⡺⡸⡕⡇⡗⡕⣕⢵⢱⢣⡣⡇⡯⡺⡸⣪⡳⢕⢝⢜⢔⢕⢕⢣⢳⢱⢱⢱⢱⠱⣹⡪⡎⡎
⡑⢌⠢⠢⡑⢌⢌⡢⡡⣃⠪⠪⡘⡜⢌⠪⡨⢊⠜⡨⡊⡧⡳⣝⢼⣪⡳⡭⣳⡹⡸⡜⡜⣜⢜⢕⡕⣝⢜⢎⢧⢳⡱⡱⡑⡕⢕⠕⡕⢕⢕⢕⢕⢕⢅⢇⢇⢯⢪⠨
⡪⡢⠣⢣⢡⡑⡔⡑⢍⢆⠇⡏⢎⠌⠆⢕⠨⡐⠌⡢⢱⢹⢝⡾⣽⣺⢮⡫⣞⠎⡎⡪⢪⠢⡣⡳⣹⢜⡵⣹⣪⢳⡑⢅⠕⡜⡰⢑⠜⢌⢊⠢⡑⢅⠣⡑⢅⠣⡑⠕
⢕⠬⡩⠪⡒⡜⡬⡪⡜⡔⡥⡣⡣⣑⢅⢅⢂⢂⠑⢌⠪⡪⡯⣞⣞⢮⡻⣾⢑⠕⢅⠣⡑⢕⢱⢱⢱⣻⣺⡵⣳⣇⢧⢣⠣⣊⢢⠱⡘⡔⢕⠱⡘⣌⢎⢌⠆⡇⡣⠣
⣷⣵⣮⣧⣧⣷⣾⣾⣾⣯⣯⣯⣯⣷⣿⣾⣷⣷⣵⣶⣵⣵⣿⣾⣾⣷⣯⣿⣼⣼⣼⣼⣼⣼⣶⣷⣿⣽⣾⣿⣷⣷⣷⣯⣷⣾⣾⣾⣾⣾⣾⣾⣾⣮⣾⣶⣵⣵⣮⣷`;
console.log(LOGO);

// skip 18+ dialog
$('#disclaimer').remove();
$('body').css('overflow', 'visible');

function togglePhotoElements() {
  Array.from(document.querySelectorAll('.media-group')).forEach(a => {
    if (!a.querySelector('.video')) {
      $(a.parentElement).toggle(config.showPhotos);
    }
  });
  $('#togglePhotos').css('backgroundColor', !config.showPhotos ? '#a09f9d' : '#eb6395');
  $('#togglePhotos').text(!config.showPhotos ? 'show photos' : 'hide photos');
}

function hidePhotoOnlyAlbums() {
  document.querySelectorAll('#albums').forEach(a => {
    Array.from(a.children).forEach(a => {
      if (!a.querySelector('.album-videos')) {
        $(a).toggle(config.showPhotoAlbums);
      }
    });
  });
  $('#togglePhotoAlbums').css('color', !config.showPhotoAlbums ? '#eb6395' : '#a09f9d');
}

function infiniteScrollAndLazyLoading() {
  // taken from index.html of erome mobile version
  if (!document.querySelector('.pagination')) return;
  const url = new URL(window.location.href);
  let next_page = parseInt(url.searchParams.get('page')) || 2;
  const limit = parseInt($('.pagination li:last-child()').prev().text()) || 50;

  const infinite = $('#page').infiniteScroll({
    path: () => {
      url.searchParams.set('page', next_page);
      console.log(url.href);
      return url.href;
    },
    append: '.page-content',
    scrollThreshold: 800
  });

  $('#page').on('append.infiniteScroll', (event, body, path, items, response) => {
    hidePhotoOnlyAlbums();
    new LazyLoad();
    scrollFix();
    next_page++;
    if (next_page > limit) {
      infinite.destroy();
    }
  });
}

function scrollFix() {
  setTimeout(() => window.dispatchEvent(new Event('scroll')), 1000);
}

/******************************************* STATE ***********************************************/

const config = {
  showPhotos: false,
  showPhotoAlbums: false
};;

function sync() {
  Object.assign(config, { ...JSON.parse(localStorage.getItem("config")) });
}

function save() {
  localStorage.setItem("config", JSON.stringify(config));
}

//=================================================================================================

const IS_ALBUM_PAGE = /^\/a\//.test(window.location.pathname);

function pageAction() {
  sync();
  if (IS_ALBUM_PAGE) {
    togglePhotoElements();
  } else {
    hidePhotoOnlyAlbums();
  }
}

if (IS_ALBUM_PAGE) {
  $('#user_name').parent().append('<button id="togglePhotos" class="btn btn-pink">show/hide photos</button>');
  $('#togglePhotos').on('click', () => {
    config.showPhotos = !config.showPhotos;
    togglePhotoElements();
    save();
  });
} else {
  infiniteScrollAndLazyLoading();
  $('.navbar-nav').append('<li><a href="#" id="togglePhotoAlbums">video only</span></a></li>');
  $('#togglePhotoAlbums').on('click', () => {
    config.showPhotoAlbums = !config.showPhotoAlbums;
    hidePhotoOnlyAlbums();
    save();
  });
}

window.addEventListener('focus', pageAction);
pageAction();
scrollFix();
