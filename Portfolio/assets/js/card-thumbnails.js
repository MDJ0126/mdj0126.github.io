(function () {
  document.querySelectorAll('.post-card-thumbnail').forEach(function (thumbnail) {
    var image = thumbnail.querySelector('img');

    function finish(state) {
      thumbnail.classList.remove('is-loading', 'is-loaded', 'is-error');
      thumbnail.classList.add(state);
    }

    if (!image) {
      finish('is-error');
      return;
    }

    image.addEventListener('load', function () {
      finish('is-loaded');
    }, { once: true });

    image.addEventListener('error', function () {
      if (!image.dataset.fallbackAttempted && image.dataset.fallbackSrc) {
        image.dataset.fallbackAttempted = 'true';
        image.src = image.dataset.fallbackSrc;
        return;
      }
      finish('is-error');
    });

    if (image.complete) {
      finish(image.naturalWidth > 0 ? 'is-loaded' : 'is-error');
    }
  });
}());
