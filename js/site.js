/* needesign — consentimento de cookies (LGPD), Meta Pixel após consentimento e envio de leads. */
(function () {
  'use strict';
  var PIXEL_ID = '3830586160592441';
  var KEY = 'nd-consent';

  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadPixel() {
    if (window.fbq) return;
    var n = window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    var s = document.createElement('script'); s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function banner() {
    var css = document.createElement('style');
    css.textContent =
      '.nd-ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;padding:18px 20px;border-radius:20px;' +
      'background:rgba(14,15,21,.96);border:1px solid rgba(255,255,255,.12);color:#E8EAF0;font:14px/1.55 Manrope,system-ui,sans-serif;' +
      'box-shadow:0 20px 60px rgba(0,0,0,.5);display:flex;flex-direction:column;gap:14px;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}' +
      '.nd-ck p{margin:0;color:#B7BCCB}.nd-ck a{color:#fff}.nd-ck div{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}' +
      '.nd-ck button{min-height:42px;padding:0 18px;border-radius:999px;font:700 14px Manrope,system-ui,sans-serif;cursor:pointer;border:1px solid rgba(255,255,255,.22);background:transparent;color:#E8EAF0}' +
      '.nd-ck button.ok{background:#FD3029;border-color:#FD3029;color:#06070B}';
    document.head.appendChild(css);
    var el = document.createElement('div');
    el.className = 'nd-ck'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Aviso de cookies');
    el.innerHTML = '<p>Usamos cookies para medir o desempenho do site e dos nossos anúncios. Você pode aceitar ou recusar. ' +
      '<a href="/privacidade/">Política de privacidade</a>.</p><div><button type="button" class="no">Recusar</button><button type="button" class="ok">Aceitar</button></div>';
    document.body.appendChild(el);
    el.querySelector('.ok').onclick = function () { setConsent('yes'); el.remove(); loadPixel(); };
    el.querySelector('.no').onclick = function () { setConsent('no'); el.remove(); };
  }

  var c = getConsent();
  if (c === 'yes') loadPixel();
  else if (c !== 'no') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();
  }

  // Lead do simulador → Netlify Forms (formulário "orcamento" declarado no HTML da página)
  window.needLead = function (data) {
    try {
      var body = new URLSearchParams();
      body.append('form-name', 'orcamento');
      Object.keys(data).forEach(function (k) { body.append(k, data[k] == null ? '' : String(data[k])); });
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString(), keepalive: true });
      if (window.fbq) window.fbq('track', 'Lead');
    } catch (e) {}
  };
})();
