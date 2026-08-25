(function () {
  var viewer = document.getElementById('image-viewer');
  var viewerImage = viewer && viewer.querySelector('img');
  var closeButton = viewer && viewer.querySelector('.image-viewer-close');

  function closeViewer() {
    if (!viewer) return;
    viewer.hidden = true;
    viewerImage.removeAttribute('src');
    document.documentElement.style.overflow = '';
  }

  function openViewer(image) {
    if (!viewer) return;
    viewerImage.src = image.currentSrc || image.src;
    viewerImage.alt = image.alt;
    viewer.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    closeButton.focus();
  }

  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var track = gallery.querySelector('.gallery-track');
    var slides = Array.from(gallery.querySelectorAll('.gallery-slide'));
    var previous = gallery.querySelector('[data-gallery-prev]');
    var next = gallery.querySelector('[data-gallery-next]');
    var current = gallery.querySelector('[data-gallery-current]');
    var index = 0;
    var pointerStart = null;
    var suppressClick = false;

    function render() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      if (current) current.textContent = String(index + 1);
      if (previous) previous.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    }

    function move(step) {
      index = Math.max(0, Math.min(slides.length - 1, index + step));
      render();
    }

    if (previous) previous.addEventListener('click', function () { move(-1); });
    if (next) next.addEventListener('click', function () { move(1); });
    slides.forEach(function (slide) {
      slide.addEventListener('click', function (event) {
        if (suppressClick) {
          event.preventDefault();
          return;
        }
        openViewer(slide.querySelector('img'));
      });
    });
    gallery.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    });
    track.addEventListener('pointerdown', function (event) { pointerStart = event.clientX; });
    track.addEventListener('pointerup', function (event) {
      if (pointerStart === null) return;
      var distance = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(distance) > 45) {
        suppressClick = true;
        move(distance < 0 ? 1 : -1);
        setTimeout(function () { suppressClick = false; }, 0);
      }
    });
    track.addEventListener('pointercancel', function () { pointerStart = null; });
    render();
  });

  if (closeButton) closeButton.addEventListener('click', closeViewer);
  if (viewer) viewer.addEventListener('click', function (event) { if (event.target === viewer) closeViewer(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && viewer && !viewer.hidden) closeViewer(); });
})();
