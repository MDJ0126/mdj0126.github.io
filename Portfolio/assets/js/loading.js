(function () {
  var pageRevealReady = false;

  function setupPageReveal() {
    if (pageRevealReady) return;
    pageRevealReady = true;
    var elements = document.querySelectorAll('[data-page-reveal]');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (element) { element.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      var visibleEntries = entries.filter(function (entry) { return entry.isIntersecting; });
      visibleEntries.sort(function (a, b) {
        return a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
      visibleEntries.forEach(function (entry, index) {
        entry.target.style.setProperty('--page-reveal-delay', (index * 0.07).toFixed(2) + 's');
        var resetRevealDelay = function (event) {
          if (event.propertyName !== 'opacity') return;
          entry.target.style.setProperty('--page-reveal-delay', '0s');
          entry.target.removeEventListener('transitionend', resetRevealDelay);
        };
        entry.target.addEventListener('transitionend', resetRevealDelay);
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 14% 0px' });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        elements.forEach(function (element) { observer.observe(element); });
      });
    });
  }

  if (document.documentElement.classList.contains('portfolio-skip-loading')) {
    var skippedScreen = document.getElementById('loading-screen');
    if (skippedScreen) skippedScreen.remove();
    setupPageReveal();
    return;
  }

  var finished = false;
  var greetingStarted = false;

  function finishLoading() {
    if (finished) return;
    finished = true;
    requestAnimationFrame(function () {
      document.documentElement.classList.remove('page-loading');
      var screen = document.getElementById('loading-screen');
      if (!screen) return setupPageReveal();
      screen.classList.add('is-hidden');
      setTimeout(function () {
        screen.remove();
        setupPageReveal();
      }, 220);
    });
  }

  function showGreeting() {
    if (greetingStarted || finished) return;
    greetingStarted = true;
    var lines = document.querySelectorAll('.greeting-line');
    if (!lines.length) return finishLoading();
    lines.forEach(function (line, index) {
      setTimeout(function () { line.classList.add('is-visible'); }, index * 350);
    });
    setTimeout(finishLoading, ((lines.length - 1) * 350) + 1000);
  }

  window.addEventListener('load', function () {
    var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fonts.then(function () {
      requestAnimationFrame(function () { requestAnimationFrame(showGreeting); });
    });
  });
  setTimeout(finishLoading, 7000);
})();
