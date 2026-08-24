(function () {
  if (document.documentElement.classList.contains('portfolio-skip-loading')) {
    var skippedScreen = document.getElementById('loading-screen');
    if (skippedScreen) skippedScreen.remove();
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
      if (!screen) return;
      screen.classList.add('is-hidden');
      setTimeout(function () { screen.remove(); }, 220);
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
