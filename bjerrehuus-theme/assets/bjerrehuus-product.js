/* Bjerrehuus Fine Jewellery — Product page interactions */

(function () {
  'use strict';

  /* ── Gallery ── */
  function initGallery() {
    document.querySelectorAll('.bjfj-gallery').forEach(function (gallery) {
      var thumbs = Array.from(gallery.querySelectorAll('.bjfj-gallery__thumb'));
      var items  = Array.from(gallery.querySelectorAll('.bjfj-media-item'));

      function show(idx) {
        items.forEach(function (item, i) { item.classList.toggle('is-active', i === idx); });
        thumbs.forEach(function (th, i)  { th.classList.toggle('is-active', i === idx); });
      }

      thumbs.forEach(function (th, idx) {
        th.addEventListener('click', function () { show(idx); });
      });

      if (items.length) show(0);
    });
  }

  /* ── Accordion ── */
  function initAccordion() {
    document.querySelectorAll('.bjfj-accordion__trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.bjfj-accordion__item');
        var open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ── Quantity stepper ── */
  function initQty() {
    document.querySelectorAll('.bjfj-qty').forEach(function (widget) {
      var input = widget.querySelector('.bjfj-qty__input');
      widget.querySelector('[data-minus]').addEventListener('click', function () {
        var v = parseInt(input.value, 10);
        if (v > 1) input.value = v - 1;
      });
      widget.querySelector('[data-plus]').addEventListener('click', function () {
        input.value = parseInt(input.value, 10) + 1;
      });
    });
  }

  /* ── Variant option buttons ── */
  function initVariants() {
    var scriptEl = document.getElementById('bjfj-variants-json');
    if (!scriptEl) return;

    var variants;
    try { variants = JSON.parse(scriptEl.textContent); } catch (e) { return; }

    var form      = document.querySelector('.bjfj-product-form');
    var idInput   = form && form.querySelector('.bjfj-variant-id');
    var buyBtn    = form && form.querySelector('.bjfj-btn--primary');
    var priceEl   = document.querySelector('.bjfj-product-info__price');

    var selected = {};

    document.querySelectorAll('.bjfj-option').forEach(function (optEl) {
      var name = optEl.getAttribute('data-option-name');
      var btns = Array.from(optEl.querySelectorAll('.bjfj-option__btn'));
      // seed selected from the pre-selected button
      var pre = btns.find(function (b) { return b.classList.contains('is-selected'); });
      if (pre) selected[name] = pre.getAttribute('data-value');

      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          selected[name] = btn.getAttribute('data-value');
          btns.forEach(function (b) { b.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
          updateVariant();
        });
      });
    });

    function updateVariant() {
      var match = variants.find(function (v) {
        return v.options.every(function (val, i) {
          var optName = Object.keys(selected)[i];
          return selected[optName] === val;
        });
      });

      if (!match) return;

      if (idInput) idInput.value = match.id;

      if (buyBtn) {
        if (match.available) {
          buyBtn.disabled = false;
          buyBtn.textContent = 'Add to bag';
        } else {
          buyBtn.disabled = true;
          buyBtn.textContent = 'Sold out';
        }
      }

      if (priceEl && match.price_formatted) {
        var priceSpan = priceEl.querySelector('.bjfj-price-display');
        if (priceSpan) priceSpan.textContent = match.price_formatted;
      }
    }

    updateVariant();
  }

  /* ── Inquire modal ── */
  function initModal() {
    var overlay = document.getElementById('bjfj-inquire-overlay');
    if (!overlay) return;

    var form      = overlay.querySelector('.bjfj-inquire-form');
    var formBody  = overlay.querySelector('.bjfj-modal__form-body');
    var successEl = overlay.querySelector('.bjfj-modal__success');
    var closeBtn  = overlay.querySelector('.bjfj-modal__close');

    function openModal(data) {
      var nameEl     = overlay.querySelector('.bjfj-modal__product-name');
      var metaEl     = overlay.querySelector('.bjfj-modal__product-meta');
      var imgEl      = overlay.querySelector('.bjfj-modal__product-img');
      var hHandle    = overlay.querySelector('[name="contact[product_handle]"]');
      var hUrl       = overlay.querySelector('[name="contact[product_url]"]');
      var hSubject   = overlay.querySelector('[name="contact[subject]"]');

      if (nameEl) nameEl.textContent = data.name || '';
      if (metaEl) {
        var parts = [data.material, data.price].filter(Boolean);
        metaEl.textContent = parts.join(' — ');
      }
      if (imgEl) {
        if (data.img) { imgEl.src = data.img; imgEl.style.display = 'block'; }
        else { imgEl.style.display = 'none'; }
      }
      if (hHandle) hHandle.value = data.handle || '';
      if (hUrl)    hUrl.value    = data.url    || window.location.href;
      if (hSubject) hSubject.value = '[BFJ Inquiry] ' + (data.name || 'piece');

      if (successEl) successEl.classList.remove('is-visible');
      if (formBody)  formBody.style.display = '';
      if (form)      form.reset();

      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-inquire-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal({
          name:     btn.getAttribute('data-product-name')     || '',
          material: btn.getAttribute('data-product-material') || '',
          price:    btn.getAttribute('data-product-price')    || '',
          img:      btn.getAttribute('data-product-img')      || '',
          handle:   btn.getAttribute('data-product-handle')   || '',
          url:      btn.getAttribute('data-product-url')      || window.location.href,
        });
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

        fetch('/contact', {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          body: new FormData(form),
        })
          .then(function () {
            if (formBody)  formBody.style.display = 'none';
            if (successEl) successEl.classList.add('is-visible');
            setTimeout(closeModal, 3200);
          })
          .catch(function () {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send inquiry'; }
          });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initGallery();
    initAccordion();
    initQty();
    initVariants();
    initModal();
  });
})();
