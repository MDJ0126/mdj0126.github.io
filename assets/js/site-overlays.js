(function () {
  var emailAddress = 'ehdwns0126@naver.com';

  function createLink(className, href, label, tooltipText) {
    var link = document.createElement('a');
    link.className = 'site-contact-button ' + className;
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', label);
    link.dataset.pointerTooltip = tooltipText;
    return link;
  }

  function fallbackCopyEmail() {
    var textarea = document.createElement('textarea');
    textarea.value = emailAddress;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    var copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  }

  function showToast(message) {
    var toast = document.querySelector('.site-copy-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  function ensurePointerTooltip() {
    var tooltip = document.querySelector('.site-pointer-tooltip');
    if (tooltip) return tooltip;
    tooltip = document.createElement('span');
    tooltip.className = 'site-pointer-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function positionPointerTooltip(tooltip, clientX, clientY) {
    var gap = 14;
    var edge = 12;
    var rect = tooltip.getBoundingClientRect();
    var left = Math.min(clientX + gap, window.innerWidth - rect.width - edge);
    var top = clientY + gap;
    if (top + rect.height > window.innerHeight - edge) top = clientY - rect.height - gap;
    tooltip.style.left = Math.max(edge, left) + 'px';
    tooltip.style.top = Math.max(edge, top) + 'px';
  }

  function attachPointerTooltip(target, text) {
    if (!target || target.dataset.pointerTooltipBound === 'true') return;
    var tooltip = ensurePointerTooltip();
    target.dataset.pointerTooltipBound = 'true';

    function show(clientX, clientY) {
      tooltip.textContent = text;
      tooltip.classList.add('is-visible');
      positionPointerTooltip(tooltip, clientX, clientY);
    }

    function hide() {
      tooltip.classList.remove('is-visible');
    }

    target.addEventListener('mouseenter', function (event) {
      show(event.clientX, event.clientY);
    });
    target.addEventListener('mousemove', function (event) {
      if (!tooltip.classList.contains('is-visible')) return;
      positionPointerTooltip(tooltip, event.clientX, event.clientY);
    });
    target.addEventListener('mouseleave', hide);
    target.addEventListener('focus', function () {
      if (!target.matches(':focus-visible')) return;
      var rect = target.getBoundingClientRect();
      show(rect.left + (rect.width / 2), rect.bottom);
    });
    target.addEventListener('blur', hide);
  }

  if (!document.querySelector('.site-contact')) {
    var contact = document.createElement('section');
    contact.className = 'site-contact';
    contact.setAttribute('aria-label', '연락처');

    var links = document.createElement('div');
    links.className = 'site-contact-links';
    links.setAttribute('aria-label', '연락처 바로가기');


    if (/^\/(Resume|Portfolio)(\/|$)/.test(window.location.pathname)) {
      var home = createLink('site-contact-home', '/', '홈으로 이동', '홈으로 이동하기');
      home.removeAttribute('target');
      home.removeAttribute('rel');
      links.appendChild(home);
    }

    var email = document.createElement('button');
    email.className = 'site-contact-button site-contact-email';
    email.type = 'button';
    email.setAttribute('aria-label', '이메일 주소 복사');
    email.dataset.pointerTooltip = '이메일 주소 복사하기';
    email.innerHTML = '<span aria-hidden="true">✉</span>';
    email.addEventListener('click', function () {
      var copyTask;
      if (navigator.clipboard && window.isSecureContext) {
        copyTask = navigator.clipboard.writeText(emailAddress).then(function () { return true; });
      } else {
        copyTask = Promise.resolve(fallbackCopyEmail());
      }
      copyTask.then(function (copied) {
        showToast(copied ? '이메일 주소를 복사했습니다.' : '이메일 주소를 복사하지 못했습니다.');
      }).catch(function () {
        showToast(fallbackCopyEmail() ? '이메일 주소를 복사했습니다.' : '이메일 주소를 복사하지 못했습니다.');
      });
    });
    links.appendChild(email);

    links.appendChild(createLink(
      'site-contact-linkedin',
      'https://www.linkedin.com/in/moondongjun/',
      'LinkedIn 프로필 열기',
      'LinkedIn으로 이동하기'
    ));

    links.appendChild(createLink(
      'site-contact-kakao',
      'https://open.kakao.com/o/sWoSndmh',
      '카카오톡 1:1 오픈채팅 열기',
      '카카오톡 오픈채팅으로 이동하기'
    ));

    contact.appendChild(links);
    document.body.appendChild(contact);

    var toast = document.createElement('div');
    toast.className = 'site-copy-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  if (!document.querySelector('.site-footer')) {
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

  document.body.classList.add('has-site-footer');

  var profile = document.querySelector('.github-profile');
  if (profile) attachPointerTooltip(profile, 'GitHub로 이동하기');
  document.querySelectorAll('.site-contact-button').forEach(function (button) {
    attachPointerTooltip(button, button.dataset.pointerTooltip);
  });
})();
