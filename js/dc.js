/* needesign — runtime leve para as páginas (templates com {{}} , sc-for, sc-if). */
(function () {
  'use strict';

  var EVENTS = {
    onClick: 'click', onChange: 'input', onInput: 'input', onFocus: 'focus', onBlur: 'blur',
    onMouseEnter: 'mouseenter', onMouseLeave: 'mouseleave', onSubmit: 'submit', onKeyDown: 'keydown'
  };
  var BOOL = { disabled: 1, checked: 1, hidden: 1, readonly: 1, required: 1, selected: 1 };
  var VOID = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, source: 1, track: 1, wbr: 1 };

  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function lookup(path, scopes) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return parseFloat(path);
    var parts = path.split('.');
    for (var i = scopes.length - 1; i >= 0; i--) {
      var s = scopes[i];
      if (s && Object.prototype.hasOwnProperty.call(s, parts[0])) {
        var v = s[parts[0]];
        for (var j = 1; j < parts.length; j++) { if (v == null) return undefined; v = v[parts[j]]; }
        return v;
      }
    }
    return undefined;
  }

  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;

  function interp(str, scopes) {
    return str.replace(HOLE, function (_, p) { var v = lookup(p, scopes); return v == null ? '' : String(v); });
  }

  function Renderer(root) { this.root = root; this.handlers = []; }

  Renderer.prototype.node = function (n, scopes) {
    if (n.nodeType === 3) return esc(interp(n.nodeValue, scopes));
    if (n.nodeType !== 1) return '';
    var tag = n.tagName.toLowerCase();
    var out = '';
    var i, c;
    if (tag === 'helmet') return '';
    if (tag === 'sc-for') {
      var list = lookup((n.getAttribute('list') || '').replace(/^\s*\{\{|\}\}\s*$/g, ''), scopes) || [];
      var as = n.getAttribute('as') || 'item';
      for (i = 0; i < list.length; i++) {
        var sc = {}; sc[as] = list[i]; sc.$index = i;
        var ns = scopes.concat([sc]);
        for (c = n.firstChild; c; c = c.nextSibling) out += this.node(c, ns);
      }
      return out;
    }
    if (tag === 'sc-if') {
      var val = lookup((n.getAttribute('value') || '').replace(/^\s*\{\{|\}\}\s*$/g, ''), scopes);
      if (!val) return '';
      for (c = n.firstChild; c; c = c.nextSibling) out += this.node(c, scopes);
      return out;
    }
    var html = '<' + tag;
    var evs = [];
    for (i = 0; i < n.attributes.length; i++) {
      var a = n.attributes[i];
      var name = a.name, v = a.value;
      var orig = n.__names ? n.__names[name] : name;
      var m = WHOLE.exec(v);
      var evName = EVENTS[orig] || EVENTS[toCamel(name)];
      if (evName) {
        var fn = m ? lookup(m[1], scopes) : null;
        if (typeof fn === 'function') { this.handlers.push(fn); evs.push(evName + ':' + (this.handlers.length - 1)); }
        continue;
      }
      if (m) {
        var raw = lookup(m[1], scopes);
        if (BOOL[name]) { if (raw && raw !== 'false') html += ' ' + name; continue; }
        if (raw == null || raw === false) continue;
        html += ' ' + name + '="' + esc(raw) + '"';
      } else if (v.indexOf('{{') >= 0) {
        html += ' ' + name + '="' + esc(interp(v, scopes)) + '"';
      } else {
        html += ' ' + name + (v === '' && BOOL[name] ? '' : '="' + esc(v) + '"');
      }
    }
    if (evs.length) html += ' data-dcev="' + evs.join(',') + '"';
    html += '>';
    if (VOID[tag]) return html;
    for (c = n.firstChild; c; c = c.nextSibling) html += this.node(c, scopes);
    return html + '</' + tag + '>';
  };

  function toCamel(name) {
    // atributos HTML chegam em minúsculas (onclick); mapeia para a forma usada no template
    var map = { onclick: 'onClick', onchange: 'onChange', oninput: 'onInput', onfocus: 'onFocus', onblur: 'onBlur', onmouseenter: 'onMouseEnter', onmouseleave: 'onMouseLeave', onsubmit: 'onSubmit', onkeydown: 'onKeyDown' };
    return map[name] || name;
  }

  function bindEvents(container, handlers) {
    var els = container.querySelectorAll('[data-dcev]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var map = {};
      el.getAttribute('data-dcev').split(',').forEach(function (pair) {
        var p = pair.split(':'); map[p[0]] = handlers[+p[1]];
      });
      el.__dc = map;
      el.__dcb = el.__dcb || {};
      Object.keys(map).forEach(function (type) {
        if (el.__dcb[type]) return;
        el.__dcb[type] = true;
        el.addEventListener(type, function (e) {
          var h = this.__dc && this.__dc[type];
          if (h) h.call(null, e);
        });
      });
    }
  }

  window.DCLogic = function DCLogic() {};
  DCLogic.prototype.setState = function (patch) {
    var self = this;
    var prev = self.state || {};
    self.__prev = self.__prev || prev;
    self.state = Object.assign({}, prev, typeof patch === 'function' ? patch(prev) : patch);
    if (!self.__queued) {
      self.__queued = true;
      Promise.resolve().then(function () { self.__queued = false; var p = self.__prev; self.__prev = null; self.__render(p); });
    }
  };
  DCLogic.prototype.forceUpdate = function () { this.__render(this.state); };

  window.DC = {
    mount: function (Component, props) {
      var tpl = document.getElementById('dc-template');
      var host = document.getElementById('app');
      var frag = tpl.content;
      var comp = new Component();
      comp.props = props || {};
      comp.state = comp.state || {};
      var mounted = false;
      comp.__render = function (prevState) {
        var r = new Renderer();
        var vals = comp.renderVals ? comp.renderVals() : {};
        var html = '';
        for (var c = frag.firstChild; c; c = c.nextSibling) html += r.node(c, [vals]);
        var next = document.createElement('div');
        next.innerHTML = html;
        if (!mounted && host.hasAttribute('data-prerendered')) {
          // HTML já veio pré-renderizado: só reconcilia, sem recriar (evita piscar)
          morphdom(host, next, { childrenOnly: true });
          host.removeAttribute('data-prerendered');
        } else if (!mounted) {
          host.innerHTML = '';
          while (next.firstChild) host.appendChild(next.firstChild);
        } else {
          morphdom(host, next, {
            childrenOnly: true,
            onBeforeElUpdated: function (from, to) {
              if (from === document.activeElement && (from.tagName === 'INPUT' || from.tagName === 'TEXTAREA')) {
                if (from.value !== to.getAttribute('value')) from.value = to.getAttribute('value') || '';
                // mantém o foco e evita reconstruir o campo
                for (var k = 0; k < to.attributes.length; k++) {
                  var at = to.attributes[k];
                  if (at.name !== 'value' && from.getAttribute(at.name) !== at.value) from.setAttribute(at.name, at.value);
                }
                return false;
              }
              return true;
            }
          });
        }
        bindEvents(host, r.handlers);
        if (!mounted) { mounted = true; if (comp.componentDidMount) comp.componentDidMount(); }
        else if (comp.componentDidUpdate) comp.componentDidUpdate(comp.props, prevState || {});
      };
      comp.__render(null);
      return comp;
    }
  };
})();
