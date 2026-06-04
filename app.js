(function(){
'use strict';

/* === i18n === */
var clockLocale = (typeof chrome !== 'undefined' && chrome.i18n)
  ? chrome.i18n.getUILanguage() : navigator.language || 'en';

function msg(key, subs) {
  if (typeof chrome !== 'undefined' && chrome.i18n) {
    return chrome.i18n.getMessage(key, subs) || key;
  }
  return key;
}

function applyI18n() {
  var lang = (typeof chrome !== 'undefined' && chrome.i18n)
    ? chrome.i18n.getUILanguage() : navigator.language || 'en';
  document.documentElement.lang = lang;
  document.title = msg('pageTitle');
  var els = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < els.length; i++) els[i].textContent = msg(els[i].dataset.i18n);
  var phs = document.querySelectorAll('[data-i18n-placeholder]');
  for (var j = 0; j < phs.length; j++) phs[j].placeholder = msg(phs[j].dataset.i18nPlaceholder);
  var tts = document.querySelectorAll('[data-i18n-title]');
  for (var k = 0; k < tts.length; k++) tts[k].title = msg(tts[k].dataset.i18nTitle);
}

/* === 默认数据 === */

var DEFAULTS = {
  sites: [
    {id:'s1',name:'Google',url:'https://www.google.com',iconUrl:''},
    {id:'s2',name:'百度',url:'https://www.baidu.com',iconUrl:''},
    {id:'s3',name:'Gemini',url:'https://gemini.google.com/app',iconUrl:''},
    {id:'s4',name:'DeepSeek',url:'https://chat.deepseek.com/',iconUrl:''},
    {id:'s5',name:'ChatGPT',url:'https://chatgpt.com/',iconUrl:''},
    {id:'s6',name:'DuckAI',url:'https://duck.ai/',iconUrl:''},
    {id:'s7',name:'YouTube',url:'https://www.youtube.com',iconUrl:''},
    {id:'s8',name:'Bilibili',url:'https://www.bilibili.com',iconUrl:''},
    {id:'s9',name:'淘宝',url:'https://www.taobao.com/',iconUrl:''},
    {id:'s10',name:'天猫',url:'https://www.tmall.com/',iconUrl:''},
    {id:'s11',name:'京东',url:'https://www.jd.com/',iconUrl:''}
  ],
  layout:{cols:12,iconSize:65,radius:30,gap:26,fontSize:14,showTitle:true},
  background:{type:'image',color:'#1a1a2e',imageData:'',blur:6,overlay:0},
  settings:{showSearch:true,searchEngine:'https://www.google.com/search?q=',showClock:true,showSeconds:false,openInNewTab:false},
  version:5
};

var STORE_KEY = 'pnt_data';
var data = null;
var editId = null;
var clockTimer = null;
var dragEl = null;
var saveTmr = null;

/* === DOM 缓存 === */
var $bg, $clock, $ctime, $cdate, $searchWrap, $sform, $sinput;
var $grid, $addBtn, $setBtn, $panel, $pClose;
var $modalBg, $mTitle, $mForm, $mName, $mUrl, $mIco, $mCancel, $mDel;
var $ctx;

function cacheDom() {
  $bg = document.getElementById('bg');
  $clock = document.getElementById('clock');
  $ctime = document.getElementById('ctime');
  $cdate = document.getElementById('cdate');
  $searchWrap = document.getElementById('searchWrap');
  $sform = document.getElementById('sform');
  $sinput = document.getElementById('sinput');
  $grid = document.getElementById('grid');
  $addBtn = document.getElementById('addBtn');
  $setBtn = document.getElementById('setBtn');
  $panel = document.getElementById('panel');
  $pClose = document.getElementById('pClose');
  $modalBg = document.getElementById('modalBg');
  $mTitle = document.getElementById('mTitle');
  $mForm = document.getElementById('mForm');
  $mName = document.getElementById('mName');
  $mUrl = document.getElementById('mUrl');
  $mIco = document.getElementById('mIco');
  $mCancel = document.getElementById('mCancel');
  $mDel = document.getElementById('mDel');
  $ctx = document.getElementById('ctx');
}

/* === 存储 === */
function migrateData(d) {
  var l = d.layout, b = d.background, s = d.settings;
  if (!l || typeof l !== 'object') d.layout = Object.assign({}, DEFAULTS.layout);
  else {
    if (l.cols === undefined) l.cols = DEFAULTS.layout.cols;
    if (l.showTitle === undefined) l.showTitle = true;
    if (l.iconSize === undefined) l.iconSize = DEFAULTS.layout.iconSize;
    if (l.radius === undefined) l.radius = DEFAULTS.layout.radius;
    if (l.gap === undefined) l.gap = DEFAULTS.layout.gap;
    if (l.fontSize === undefined) l.fontSize = DEFAULTS.layout.fontSize;
  }
  if (!b || typeof b !== 'object') d.background = Object.assign({}, DEFAULTS.background);
  else {
    if (b.blur === undefined) b.blur = 0;
    if (b.overlay === undefined) b.overlay = 0;
    if (b.imageOriginal === undefined) b.imageOriginal = '';
    if (b.blurredData === undefined) b.blurredData = '';
  }
  if (!s || typeof s !== 'object') d.settings = Object.assign({}, DEFAULTS.settings);
  else {
    if (s.showSeconds === undefined) s.showSeconds = false;
    if (s.openInNewTab === undefined) s.openInNewTab = false;
    if (s.showSearch === undefined) s.showSearch = true;
    if (s.showClock === undefined) s.showClock = true;
  }
  if (!Array.isArray(d.sites)) d.sites = DEFAULTS.sites;
  return d;
}
function loadData() {
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      var d = JSON.parse(raw);
      if (d && d.version) return migrateData(d);
    }
  } catch(e) {}
  // localStorage 无数据，尝试从 chrome.storage.local 恢复（防清缓存丢数据）
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new Promise(function(resolve) {
      chrome.storage.local.get('pnt_data', function(result) {
        if (chrome.runtime && chrome.runtime.lastError) { resolve(JSON.parse(JSON.stringify(DEFAULTS))); return; }
        var d = result && result.pnt_data;
        if (d && d.version) {
          localStorage.setItem(STORE_KEY, JSON.stringify(d));
          resolve(migrateData(d));
        } else {
          resolve(JSON.parse(JSON.stringify(DEFAULTS)));
        }
      });
    });
  }
  return JSON.parse(JSON.stringify(DEFAULTS));
}

var _lastJson = null;
function saveData(d) {
  d.version = 5;
  var json = JSON.stringify(d);
  if (json === _lastJson) return;
  _lastJson = json;
  try {
    localStorage.setItem(STORE_KEY, json);
  } catch(e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      try {
        var lite = Object.assign({}, d);
        if (lite.background) lite.background = Object.assign({}, lite.background, {imageData: '', imageOriginal: '', blurredData: ''});
        localStorage.setItem(STORE_KEY, JSON.stringify(lite));
      } catch(e2) {}
    }
  }
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({pnt_data: d}, function() {
      if (chrome.runtime && chrome.runtime.lastError) {
        var lite = Object.assign({}, d);
        if (lite.background) lite.background = Object.assign({}, lite.background, {imageData: '', imageOriginal: '', blurredData: ''});
        chrome.storage.local.set({pnt_data: lite});
      }
    });
  }
}

/* === 工具 === */
function gid() { return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2,9); }
function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h); return h; }
var COLORS = ['#6c63ff','#ff6584','#43e97b','#f8b500','#38f9d7','#667eea','#f093fb','#4facfe','#00c9ff','#92fe9d','#fa709a','#fee140'];
function getColor(name) { return COLORS[Math.abs(hash(name)) % COLORS.length]; }
// 防抖
function debounce(fn, ms) {
  var t;
  return function() { var ctx = this, args = arguments; clearTimeout(t); t = setTimeout(function() { fn.apply(ctx, args); }, ms); };
}

/* === 渲染：背景 === */
var _defaultBgUrl = null;
function getDefaultBgUrl() {
  if (_defaultBgUrl) return _defaultBgUrl;
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
    _defaultBgUrl = chrome.runtime.getURL('default/bg.jpg');
  } else {
    _defaultBgUrl = 'default/bg.jpg';
  }
  return _defaultBgUrl;
}

function applyBg() {
  var bg = data.background;
  $bg.style.filter = '';
  $bg.style.transform = '';
  if (bg.type === 'color') {
    $bg.style.backgroundImage = 'none';
    $bg.style.backgroundColor = bg.color;
  } else if (bg.type === 'image') {
    var src = bg.imageData || getDefaultBgUrl();
    var usePreBlur = bg.blurredData && bg.blur > 0;
    $bg.style.backgroundImage = 'url(' + (usePreBlur ? bg.blurredData : src) + ')';
    if (!usePreBlur && bg.blur > 0) {
      $bg.style.filter = 'blur(' + bg.blur + 'px)';
      $bg.style.transform = 'scale(1.05)';
    }
  }
  $bg.style.setProperty('--ov', bg.overlay / 100);
}

function applyCanvasBlur(src, blur) {
  var radius = Math.max(1, Math.round(blur * 0.5));
  var scale = radius > 20 ? 0.25 : radius > 10 ? 0.5 : 1;
  return new Promise(function(resolve) {
    var img = new Image();
    img.onload = function() {
      var w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      var passes = Math.min(3, Math.ceil(radius / 10));
      var effR = Math.max(1, Math.round(radius * scale));
      for (var p = 0; p < passes; p++) {
        var id = ctx.getImageData(0, 0, w, h);
        var px = id.data, buf = new Uint8ClampedArray(px.length);
        // Horizontal
        for (var y = 0; y < h; y++) {
          var si = y * w * 4, ls = 0, rs = 0, gs = 0, bs = 0;
          for (var r = -effR; r <= effR; r++) {
            var idx = si + Math.min(Math.max(r, 0), w - 1) * 4;
            ls += px[idx]; rs += px[idx+1]; gs += px[idx+2]; bs += px[idx+3];
          }
          for (var x = 0; x < w; x++) {
            var bi = (si + x * 4);
            var d = effR * 2 + 1;
            buf[bi] = ls / d; buf[bi+1] = rs / d; buf[bi+2] = gs / d; buf[bi+3] = bs / d;
            var lo = si + Math.max(x - effR, 0) * 4;
            var hi = si + Math.min(x + effR + 1, w - 1) * 4;
            ls += px[hi] - px[lo]; rs += px[hi+1] - px[lo+1];
            gs += px[hi+2] - px[lo+2]; bs += px[hi+3] - px[lo+3];
          }
        }
        // Vertical
        for (var x2 = 0; x2 < w; x2++) {
          var ls2 = 0, rs2 = 0, gs2 = 0, bs2 = 0;
          for (var r2 = -effR; r2 <= effR; r2++) {
            var idx2 = (Math.min(Math.max(r2, 0), h - 1) * w + x2) * 4;
            ls2 += buf[idx2]; rs2 += buf[idx2+1]; gs2 += buf[idx2+2]; bs2 += buf[idx2+3];
          }
          for (var y2 = 0; y2 < h; y2++) {
            var bi2 = (y2 * w + x2) * 4;
            var d2 = effR * 2 + 1;
            px[bi2] = ls2 / d2; px[bi2+1] = rs2 / d2; px[bi2+2] = gs2 / d2; px[bi2+3] = bs2 / d2;
            var lo2 = (Math.max(y2 - effR, 0) * w + x2) * 4;
            var hi2 = (Math.min(y2 + effR + 1, h - 1) * w + x2) * 4;
            ls2 += buf[hi2] - buf[lo2]; rs2 += buf[hi2+1] - buf[lo2+1];
            gs2 += buf[hi2+2] - buf[lo2+2]; bs2 += buf[hi2+3] - buf[lo2+3];
          }
        }
        ctx.putImageData(id, 0, 0);
      }
      var result = c.toDataURL('image/jpeg', 0.7);
      c.width = 0; c.height = 0;
      resolve(result);
    };
    img.onerror = function() { resolve(src); };
    img.src = src;
  });
}

/* === 渲染：布局 CSS 变量 === */
function applyLayout() {
  var l = data.layout;
  $grid.style.setProperty('--gc', l.cols);
  $grid.style.setProperty('--sz', l.iconSize + 'px');
  $grid.style.setProperty('--rd', l.radius + 'px');
  $grid.style.setProperty('--gp', l.gap + 'px');
  $grid.style.setProperty('--fs', l.fontSize + 'px');
}

/* === 渲染：显隐 === */
function applyVisibility() {
  $searchWrap.style.display = data.settings.showSearch ? 'block' : 'none';
  $clock.style.display = data.settings.showClock ? 'block' : 'none';
}

/* === 时钟 === */
function tickClock() {
  var now = new Date();
  var s = data.settings.showSeconds;
  $ctime.textContent = now.toLocaleTimeString(clockLocale, {hour:'2-digit', minute:'2-digit', second: s ? '2-digit' : undefined});
  $cdate.textContent = now.toLocaleDateString(clockLocale, {year:'numeric', month:'long', day:'numeric'})
    + '  ' + now.toLocaleDateString(clockLocale, {weekday:'long'});
}
var clockMode = null; // 'sec' | 'min'
function clearClock() {
  if (clockMode === 'sec') clearInterval(clockTimer);
  else clearTimeout(clockTimer);
  clockTimer = null;
}
function startClock() {
  var wantSec = data.settings.showSeconds;
  var mode = wantSec ? 'sec' : 'min';
  tickClock();
  if (clockTimer && clockMode === mode) return;
  if (clockTimer) clearClock();
  clockMode = mode;
  if (wantSec) {
    clockTimer = setInterval(tickClock, 1000);
  } else {
    var now = new Date();
    var ms = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    clockTimer = setTimeout(function tick() {
      tickClock();
      clockTimer = setTimeout(tick, 60000);
    }, ms);
  }
}

/* === 渲染：首字母图标 === */
function makeLetter(name) {
  var el = document.createElement('div');
  el.className = 'ico-letter';
  el.textContent = name ? name.charAt(0).toUpperCase() : '?';
  el.style.background = getColor(name);
  return el;
}

/* === 渲染：网站网格（全量重建） === */
function renderSites() {
  var frag = document.createDocumentFragment();
  var sites = data.sites;
  for (var i = 0; i < sites.length; i++) {
    var site = sites[i];
    var el = document.createElement('div');
    el.className = 'site' + (data.layout.showTitle ? '' : ' no-title');
    el.dataset.id = site.id;
    el.draggable = true;

    var wrapper = document.createElement('div');
    wrapper.className = 'ico';

    if (site.iconUrl) {
      var img = document.createElement('img');
      img.src = site.iconUrl;
      img.alt = site.name;
      img.loading = 'lazy';
      img.onload = function() { this.dataset.loaded = '1'; };
      img.onerror = function(w, n) { return function() { if (!this.dataset.loaded) { this.remove(); w.appendChild(makeLetter(n)); } }; }(wrapper, site.name);
      wrapper.appendChild(img);
    } else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      var img2 = document.createElement('img');
      img2.alt = site.name;
      img2.onerror = function(w, n) { return function() { if (!this.dataset.loaded) { this.remove(); w.appendChild(makeLetter(n)); } }; }(wrapper, site.name);
      img2.onload = function() { this.dataset.loaded = '1'; };
      img2.loading = 'lazy';
      img2.src = 'chrome-extension://' + chrome.runtime.id + '/_favicon/?pageUrl=' + encodeURIComponent(site.url) + '&size=64';
      wrapper.appendChild(img2);
    } else {
      wrapper.appendChild(makeLetter(site.name));
    }

    el.appendChild(wrapper);
    var title = document.createElement('div');
    title.className = 'site-name';
    title.textContent = site.name;
    title.title = site.name;
    el.appendChild(title);
    frag.appendChild(el);
  }
  $grid.innerHTML = '';
  $grid.appendChild(frag);
}

/* === 刷新：仅布局（滑块拖动时用，不重建 DOM） === */
function refreshLayout() {
  applyBg();
  applyLayout();
  applyVisibility();
  // 更新已有站点的 class（标题显隐）
  var items = $grid.querySelectorAll('.site');
  for (var i = 0; i < items.length; i++) {
    if (data.layout.showTitle) items[i].classList.remove('no-title');
    else items[i].classList.add('no-title');
  }
}

/* === 刷新：全量 === */
function refreshAll() {
  applyBg();
  applyLayout();
  applyVisibility();
  startClock();
  renderSites();
}

/* === 拖拽 === */
function initDrag() {
  $grid.addEventListener('dragstart', function(e) {
    var item = e.target.closest('.site');
    if (!item) return;
    dragEl = item;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.dataset.id);
    requestAnimationFrame(function() { if (dragEl) dragEl.style.opacity = '0.4'; });
  });
  $grid.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    var t = e.target.closest('.site');
    if (!t || t === dragEl || !dragEl) return;
    $grid.querySelectorAll('.drag-over').forEach(function(el) { el.classList.remove('drag-over'); });
    var r = t.getBoundingClientRect();
    if (e.clientX < r.left + r.width / 2) t.classList.add('drag-over');
  });
  $grid.addEventListener('dragleave', function(e) {
    var t = e.target.closest('.site');
    if (t) t.classList.remove('drag-over');
  });
  $grid.addEventListener('drop', function(e) {
    e.preventDefault();
    var t = e.target.closest('.site');
    if (!t || t === dragEl || !dragEl) { cleanDrag(); return; }
    var items = Array.from($grid.querySelectorAll('.site'));
    var fi = items.indexOf(dragEl), ti = items.indexOf(t);
    if (fi === -1 || ti === -1) { cleanDrag(); return; }
    var r = t.getBoundingClientRect();
    var before = e.clientX < r.left + r.width / 2;
    if (before && fi < ti) ti--;
    if (!before && fi > ti) ti++;
    if (fi !== ti) {
      var moved = data.sites.splice(fi, 1)[0];
      data.sites.splice(ti, 0, moved);
      saveData(data);
      if (before) t.before(dragEl); else t.after(dragEl);
    }
    cleanDrag();
  });
  $grid.addEventListener('dragend', cleanDrag);
}
function cleanDrag() {
  if (dragEl) { dragEl.classList.remove('dragging'); dragEl.style.opacity = ''; }
  dragEl = null;
  $grid.querySelectorAll('.drag-over').forEach(function(el) { el.classList.remove('drag-over'); });
}

/* === 收藏夹读取（延迟加载 + 缓存） === */
var bmCache = null;
function loadBookmarksList(cb) {
  if (bmCache) { cb(bmCache); return; }
  if (typeof chrome === 'undefined' || !chrome.bookmarks) { cb([]); return; }
  chrome.bookmarks.getTree(function(tree) {
    if (!tree || !tree[0] || !tree[0].children) { cb([]); return; }
    var flat = [];
    function walk(nodes, depth) {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.url) flat.push({title: n.title || n.url, url: n.url});
        if (n.children && depth < 3) walk(n.children, depth + 1);
      }
    }
    var top = tree[0].children;
    for (var j = 0; j < top.length; j++) {
      if (top[j].children) walk(top[j].children, 0);
    }
    bmCache = flat;
    cb(flat);
  });
}

function renderBmPicker(list) {
  var $bmList = document.getElementById('bmList');
  var $bmSec = document.getElementById('bmSection');
  if (!list.length) { $bmSec.style.display = 'none'; return; }
  $bmSec.style.display = 'block';
  $bmList.innerHTML = '';

  // 搜索框
  var searchBox = document.createElement('input');
  searchBox.type = 'text';
  searchBox.placeholder = msg('bmSearchPlaceholder');
  searchBox.className = 'bm-search';
  $bmList.appendChild(searchBox);

  var listWrap = document.createElement('div');
  listWrap.className = 'bm-list-wrap';
  $bmList.appendChild(listWrap);

  var hasExt = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

  function renderFiltered(keyword) {
    listWrap.innerHTML = '';
    var kw = (keyword || '').toLowerCase();
    var filtered = kw ? list.filter(function(bm) {
      return bm.title.toLowerCase().indexOf(kw) !== -1 || bm.url.toLowerCase().indexOf(kw) !== -1;
    }) : list;
    var len = filtered.length;
    var show = len > 50 ? filtered.slice(0, 50) : filtered;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < show.length; i++) {
      var bm = show[i];
      var row = document.createElement('div');
      row.className = 'bm-row';
      if (hasExt) {
        var img = document.createElement('img');
        img.loading = 'lazy';
        img.src = 'chrome-extension://' + chrome.runtime.id + '/_favicon/?pageUrl=' + encodeURIComponent(bm.url) + '&size=16';
        img.onerror = function() { this.style.display = 'none'; };
        row.appendChild(img);
      }
      var sp1 = document.createElement('span');
      sp1.textContent = bm.title;
      row.appendChild(sp1);
      var sp2 = document.createElement('span');
      sp2.className = 'bm-url';
      sp2.textContent = bm.url;
      row.appendChild(sp2);
      (function(b) {
        row.addEventListener('click', function() {
          $mName.value = b.title;
          $mUrl.value = b.url;
          searchBox.value = '';
          renderFiltered('');
        });
      })(bm);
      frag.appendChild(row);
    }
    if (len > 50) {
      var more = document.createElement('div');
      more.className = 'bm-row';
      more.style.color = 'rgba(255,255,255,.4)';
      more.style.cursor = 'default';
      more.textContent = msg('bmMoreItems', [String(len - 50)]);
      frag.appendChild(more);
    }
    if (len === 0) {
      var empty = document.createElement('div');
      empty.className = 'bm-row';
      empty.style.color = 'rgba(255,255,255,.4)';
      empty.style.cursor = 'default';
      empty.textContent = msg('bmNoMatch');
      frag.appendChild(empty);
    }
    listWrap.appendChild(frag);
  }

  // 防抖搜索（110ms）
  var debouncedRender = debounce(function() { renderFiltered(searchBox.value); }, 110);
  searchBox.addEventListener('input', debouncedRender);
  renderFiltered('');
}

/* === 弹窗 === */
function openModal(siteId) {
  editId = siteId || null;
  if (siteId) {
    var s = data.sites.find(function(x) { return x.id === siteId; });
    if (!s) return;
    $mTitle.textContent = msg('modalTitleEdit');
    $mName.value = s.name; $mUrl.value = s.url; $mIco.value = s.iconUrl || '';
    $mDel.style.display = 'inline-block';
    document.getElementById('bmSection').style.display = 'none';
  } else {
    $mTitle.textContent = msg('modalTitleAdd');
    $mName.value = ''; $mUrl.value = ''; $mIco.value = '';
    $mDel.style.display = 'none';
    loadBookmarksList(renderBmPicker);
  }
  $modalBg.classList.add('show');
  $mName.focus();
}
function closeModal() {
  $modalBg.classList.remove('show');
  editId = null;
  $mName.value = ''; $mUrl.value = ''; $mIco.value = '';
}
function saveSite() {
  var name = $mName.value.trim(), url = $mUrl.value.trim(), ico = $mIco.value.trim();
  if (!name || !url) return;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  if (editId) {
    var s = data.sites.find(function(x) { return x.id === editId; });
    if (s) { s.name = name; s.url = url; s.iconUrl = ico; }
    saveData(data);
    renderSites();
  } else {
    data.sites.push({id: gid(), name: name, url: url, iconUrl: ico});
    saveData(data);
    renderSites();
  }
  closeModal();
}
function deleteSite(id) {
  var s = data.sites.find(function(x) { return x.id === id; });
  if (!s || !confirm(msg('confirmDelete', [s.name.replace(/["'<>&]/g, '')]))) return;
  data.sites = data.sites.filter(function(x) { return x.id !== id; });
  saveData(data);
  renderSites();
}

/* === 右键菜单 === */
function showCtx(x, y) {
  $ctx.style.left = '-9999px';
  $ctx.style.display = 'block';
  setTimeout(function() { document.addEventListener('click', $ctx._outsideClick); }, 0);
  var rect = $ctx.getBoundingClientRect();
  var w = rect.width || 120, h = rect.height || 80;
  if (x + w > window.innerWidth) x = window.innerWidth - w - 10;
  if (y + h > window.innerHeight) y = window.innerHeight - h - 10;
  if (x < 10) x = 10; if (y < 10) y = 10;
  $ctx.style.left = x + 'px'; $ctx.style.top = y + 'px';
}
function hideCtx() {
  $ctx.style.display = 'none';
  document.removeEventListener('click', $ctx._outsideClick);
}

/* === 设置面板 === */
function initSettings() {
  syncPanelUI();
  // 滑块：只更新布局，不重建 DOM
  bindSlider('pCols', 'layout.cols', 'pColsV', function(v) { return v; });
  bindSlider('pSize', 'layout.iconSize', 'pSizeV', function(v) { return v + 'px'; });
  bindSlider('pRad', 'layout.radius', 'pRadV', function(v) { return v + 'px'; });
  bindSlider('pGap', 'layout.gap', 'pGapV', function(v) { return v + 'px'; });
  bindSlider('pFont', 'layout.fontSize', 'pFontV', function(v) { return v + 'px'; });
  // 模糊滑块：bindSlider 处理即时反馈，IIFE 处理异步重模糊和保存
  bindSlider('pBlur', 'background.blur', 'pBlurV', function(v) { return v + 'px'; });
  (function() {
    var slider = document.getElementById('pBlur');
    if (!slider) return;
    var reblur = debounce(function() {
      if (data.background.imageOriginal) {
        applyCanvasBlur(data.background.imageOriginal, data.background.blur).then(function(blurred) {
          data.background.blurredData = blurred;
          applyBg();
          doSaveLayout();
        });
      } else {
        doSaveLayout();
      }
    }, 150);
    slider.addEventListener('input', reblur);
  })();
  bindSlider('pOv', 'background.overlay', 'pOvV', function(v) { return v + '%'; });
  bindCheck('pTitle', 'layout.showTitle');
  bindCheck('pClock', 'settings.showClock');
  bindCheck('pSec', 'settings.showSeconds');
  bindCheck('pSearch', 'settings.showSearch');
  bindCheck('pNewTab', 'settings.openInNewTab');

  document.getElementById('pBgType').addEventListener('change', function(e) {
    data.background.type = e.target.value; toggleBgRows(); doSave();
  });
  document.getElementById('pBgColor').addEventListener('input', function(e) {
    data.background.color = e.target.value; doSave();
  });
  document.getElementById('pBgImg').addEventListener('change', function(e) {
    var file = e.target.files[0]; if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert(msg('alertImageTooLarge')); return; }
    compressImg(file, data.background.blur).then(function(d) { data.background.imageData = d; doSave(); });
    e.target.value = '';
  });
  document.getElementById('pSE').addEventListener('change', function(e) {
    data.settings.searchEngine = e.target.value; doSave();
  });
  document.getElementById('pExport').addEventListener('click', function() {
    var blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'AirTab-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click(); URL.revokeObjectURL(a.href);
  });
  document.getElementById('pImport').addEventListener('click', function() {
    document.getElementById('pImportFile').click();
  });
  document.getElementById('pImportFile').addEventListener('change', function(e) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var d = JSON.parse(ev.target.result);
        if (!d.sites || !d.layout) throw new Error(msg('errorInvalidFormat'));
        data.sites = d.sites;
        data.layout = Object.assign({}, DEFAULTS.layout, d.layout);
        data.background = Object.assign({}, DEFAULTS.background, d.background);
        data.settings = Object.assign({}, DEFAULTS.settings, d.settings);
        saveData(data); refreshAll(); syncPanelUI();
        alert(msg('alertImportSuccess'));
      } catch(err) { alert(msg('alertImportFailed', [err.message])); }
    };
    reader.readAsText(file); e.target.value = '';
  });
  document.getElementById('pReset').addEventListener('click', function() {
    if (!confirm(msg('confirmReset'))) return;
    data = JSON.parse(JSON.stringify(DEFAULTS));
    saveData(data); refreshAll(); syncPanelUI();
  });
}

function bindSlider(sid, path, vid, fmt) {
  var slider = document.getElementById(sid);
  var disp = document.getElementById(vid);
  if (!slider || !disp) return;
  slider.addEventListener('input', function() {
    var v = parseInt(this.value, 10);
    setPath(data, path, v);
    disp.textContent = fmt(v);
    doSaveLayout(); // 只更新布局，不重建 DOM
  });
}
function bindCheck(cid, path) {
  var el = document.getElementById(cid); if (!el) return;
  el.addEventListener('change', function() {
    setPath(data, path, this.checked);
    doSave(); // 开关变化需要全量刷新
  });
}
function setPath(obj, path, val) {
  var k = path.split('.'), t = obj;
  for (var i = 0; i < k.length - 1; i++) t = t[k[i]];
  t[k[k.length - 1]] = val;
}
// 滑块拖动：只更新布局 + 保存，不重建 DOM
var saveLayoutTmr = null;
function doSaveLayout() {
  clearTimeout(saveLayoutTmr);
  saveLayoutTmr = setTimeout(function() {
    saveData(data);
    refreshLayout();
  }, 100);
}
// 开关/选择变化：全量刷新
function doSave() {
  clearTimeout(saveTmr);
  saveTmr = setTimeout(function() {
    saveData(data);
    refreshAll();
  }, 80);
}
function toggleBgRows() {
  var t = data.background.type;
  document.getElementById('bgColorRow').style.display = t === 'color' ? 'flex' : 'none';
  document.getElementById('bgImgRow').style.display = t === 'image' ? 'flex' : 'none';
  document.getElementById('bgBlurRow').style.display = t === 'image' ? 'flex' : 'none';
}
function syncPanelUI() {
  setS('pCols', data.layout.cols, 'pColsV');
  setS('pSize', data.layout.iconSize, 'pSizeV', 'px');
  setS('pRad', data.layout.radius, 'pRadV', 'px');
  setS('pGap', data.layout.gap, 'pGapV', 'px');
  setS('pFont', data.layout.fontSize, 'pFontV', 'px');
  setS('pBlur', data.background.blur, 'pBlurV', 'px');
  setS('pOv', data.background.overlay, 'pOvV', '%');
  setC('pTitle', data.layout.showTitle);
  setC('pClock', data.settings.showClock);
  setC('pSec', data.settings.showSeconds);
  setC('pSearch', data.settings.showSearch);
  setC('pNewTab', data.settings.openInNewTab);
  var bt = document.getElementById('pBgType'); if (bt) bt.value = data.background.type;
  var bc = document.getElementById('pBgColor'); if (bc) bc.value = data.background.color;
  var se = document.getElementById('pSE'); if (se) se.value = data.settings.searchEngine;
  toggleBgRows();
}
function setS(sid, val, vid, sfx) {
  var s = document.getElementById(sid), d = document.getElementById(vid);
  if (s) s.value = val; if (d) d.textContent = val + (sfx || '');
}
function setC(cid, val) { var e = document.getElementById(cid); if (e) e.checked = val; }

function compressImg(file, blur) {
  blur = blur || 0;
  return new Promise(function(resolve, reject) {
    var img = new Image(), url = URL.createObjectURL(file);
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      var MAX = 1920, w = img.width, h = img.height;
      if (w > MAX || h > MAX) { var r = Math.min(MAX/w, MAX/h); w = Math.round(w*r); h = Math.round(h*r); }
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      var original = c.toDataURL('image/jpeg', 0.7);
      data.background.imageOriginal = original;
      if (blur > 0) {
        applyCanvasBlur(original, blur).then(function(blurred) {
          data.background.blurredData = blurred;
          resolve(original);
        });
      } else {
        data.background.blurredData = '';
        resolve(original);
      }
      c.width = 0; c.height = 0;
    };
    img.onerror = function() { URL.revokeObjectURL(url); reject(new Error(msg('errorImageLoadFailed'))); };
    img.src = url;
  });
}

/* === 事件绑定 === */
function bindEvents() {
  initDrag();
  $addBtn.addEventListener('click', function() { openModal(); });
  $mForm.addEventListener('submit', function(e) { e.preventDefault(); saveSite(); });
  $mCancel.addEventListener('click', closeModal);
  $mDel.addEventListener('click', function() { if (editId) deleteSite(editId); closeModal(); });
  $grid.addEventListener('click', function(e) {
    var item = e.target.closest('.site');
    if (!item) return;
    var s = data.sites.find(function(x) { return x.id === item.dataset.id; });
    if (s) {
      if (data.settings.openInNewTab && chrome && chrome.tabs && chrome.tabs.create) {
        chrome.tabs.create({url: s.url});
      } else if (data.settings.openInNewTab) {
        window.open(s.url, '_blank');
      } else {
        window.location.href = s.url;
      }
    }
  });
  $grid.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var item = e.target.closest('.site');
    if (!item) { hideCtx(); return; }
    editId = item.dataset.id;
    showCtx(e.clientX, e.clientY);
  });
  // 右键菜单：仅在显示时监听外部点击
  $ctx._outsideClick = function(e) { if (!$ctx.contains(e.target)) hideCtx(); };
  $ctx.querySelectorAll('.ctx-item').forEach(function(el) {
    el.addEventListener('click', function() {
      if (el.dataset.a === 'edit') openModal(editId);
      else if (el.dataset.a === 'del') deleteSite(editId);
      hideCtx();
    });
  });
  $sform.addEventListener('submit', function(e) {
    e.preventDefault();
    var q = $sinput.value.trim();
    if (q) window.location.href = data.settings.searchEngine + encodeURIComponent(q);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if ($modalBg.classList.contains('show')) closeModal();
      else if ($panel.classList.contains('open')) $panel.classList.remove('open');
      hideCtx();
    }
  });
  // 不再点击背景关闭弹窗，防止误触。只能通过取消/ESC/保存关闭。
  $setBtn.addEventListener('click', function() { $panel.classList.toggle('open'); });
  $pClose.addEventListener('click', function() { $panel.classList.remove('open'); });
  initSettings();
}

/* === 启动 === */
cacheDom();
var loaded = loadData();
function init(d) {
  data = d;
  applyI18n();
  refreshAll();
  requestAnimationFrame(function() { bindEvents(); });
}
if (loaded && typeof loaded.then === 'function') loaded.then(init);
else init(loaded);

})();