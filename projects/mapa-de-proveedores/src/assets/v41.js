
'use strict';
(() => {
  const dialog = document.getElementById('gallery-v41-dialog');
  const image = document.getElementById('gallery-v41-image');
  const label = document.getElementById('gallery-v41-caption');
  const closeBtn = document.getElementById('gallery-v41-close');
  if (!dialog || !image || !closeBtn) return;
  let opener = null;
  document.querySelectorAll('[data-gallery-src]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      image.src = button.dataset.gallerySrc;
      image.alt = button.querySelector('img')?.alt || button.dataset.galleryCaption || 'Diseño';
      label.textContent = button.dataset.galleryCaption || 'Diseño';
      document.body.classList.add('v41-lightbox-open');
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      closeBtn.focus();
    });
  });
  const close = () => { if (dialog.open && typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); };
  closeBtn.addEventListener('click', close);
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('v41-lightbox-open'); opener?.focus(); });
  // Non-dialog fallback also restores the body
  document.addEventListener('keydown',event => { if(event.key==='Escape' && dialog.hasAttribute('open')) { close(); document.body.classList.remove('v41-lightbox-open'); }});
})();
