'use strict';
(() => {
  const heroImgs = document.querySelectorAll('.hero-chef-img, .hero-expansion-photo');
  heroImgs.forEach(img => {
    img.loading = 'eager';
    img.decoding = 'async';
  });
})();
