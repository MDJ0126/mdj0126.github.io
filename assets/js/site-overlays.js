(function () {
  if (document.querySelector('.site-overlays')) return;

  var overlays = document.createElement('div');
  overlays.className = 'site-overlays';
  overlays.setAttribute('aria-label', '사이트 바로가기');

  function createButton(options) {
    var link = document.createElement('a');
    link.className = 'site-overlay-button ' + options.className;
    link.href = options.href;
    link.setAttribute('aria-label', options.label);
    if (options.newTab) {
      link.target = '_blank';
      link.rel = 'noopener';
    }

    var label = document.createElement('span');
    label.className = 'site-overlay-label';
    label.textContent = options.text;
    var icon = document.createElement('span');
    icon.className = 'site-overlay-icon';
    icon.setAttribute('aria-hidden', 'true');
    if (options.icon) icon.textContent = options.icon;
    link.appendChild(label);
    link.appendChild(icon);
    return link;
  }

  overlays.appendChild(createButton({
    className: 'site-overlay-kakao',
    href: 'https://open.kakao.com/o/sWoSndmh',
    label: '카카오톡 1:1 오픈채팅 열기',
    text: '1:1 오픈채팅',
    newTab: true
  }));

  document.body.appendChild(overlays);

  if (!document.querySelector('.site-footer')) {
    document.body.classList.add('has-site-footer');
    var footer = document.createElement('footer');
    footer.className = 'site-footer';

    var license = document.createElement('a');
    license.href = '/license.html';
    license.textContent = 'LICENSE';

    var separator = document.createElement('span');
    separator.setAttribute('aria-hidden', 'true');
    separator.textContent = '·';

    var copyright = document.createElement('small');
    copyright.textContent = 'Copyright © 2018 Moon Dongjun. All rights reserved.';

    footer.appendChild(license);
    footer.appendChild(separator);
    footer.appendChild(copyright);
    document.body.appendChild(footer);
  }
})();
