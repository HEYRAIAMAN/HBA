/* Birthday site — sab kuch js/config.js se aata hai. Is file ko chhedne ki zaroorat nahi. */
(() => {
  'use strict';
  const C = window.CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rand = (a, b) => a + Math.random() * (b - a);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const center = node => { const r = node.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  /* ---------- Photo with placeholder (agar file nahi mili) ---------- */
  function photo(src, { zoom = false, alt = C.name } = {}) {
    const wrap = el('div', 'ph-wrap' + (zoom ? ' zoomable' : ''));
    const missing = () => {
      wrap.classList.add('missing');
      wrap.innerHTML = `<div class="ph"><span>📷</span><small>${esc(src || 'photo')}</small></div>`;
    };
    if (!src) { missing(); return wrap; }
    const img = new Image();
    img.alt = alt;
    img.decoding = 'async';
    img.draggable = false;
    img.onerror = missing;
    img.src = src;
    wrap.appendChild(img);
    return wrap;
  }

  /* ---------- Lightbox ---------- */
  const lightbox = $('#lightbox');
  document.addEventListener('click', e => {
    const img = e.target.closest('.zoomable img');
    if (!img) return;
    $('img', lightbox).src = img.src;
    lightbox.hidden = false;
  });
  lightbox.addEventListener('click', () => (lightbox.hidden = true));

  /* =========================================================
     🎵 MUSIC — 2 audio players, slide badalne pe crossfade
     ========================================================= */
  let videoPlaying = () => false;
  const Music = (() => {
    const players = [new Audio(), new Audio()];
    players.forEach(a => { a.loop = true; a.preload = 'auto'; a.setAttribute('playsinline', ''); });
    const MAX = 0.9;
    const raf = new Map();
    let cur = 0, curKey = null, wanted = null;
    let unlocked = false, muted = false, held = false;
    const btn = $('#mute');
    const np = $('#now-playing');
    let npTimer;

    function fade(a, to, ms, done) {
      cancelAnimationFrame(raf.get(a));
      const from = a.volume, t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / ms);
        try { a.volume = from + (to - from) * k; } catch (_) {}
        if (k < 1) raf.set(a, requestAnimationFrame(step));
        else if (done) done();
      };
      raf.set(a, requestAnimationFrame(step));
    }

    function toast(text) {
      np.textContent = '🎵 ' + text;
      np.classList.add('show');
      clearTimeout(npTimer);
      npTimer = setTimeout(() => np.classList.remove('show'), 3200);
    }

    function updateBtn() {
      btn.classList.toggle('playing', !players[cur].paused && !muted && !held);
      btn.classList.toggle('off', muted);
    }

    function apply() {
      const song = wanted && C.songs[wanted];
      const A = players[cur];
      if (document.hidden) {        // phone lock / dusra app — turant pause
        players.forEach(p => p.pause());
        updateBtn();
        return;
      }
      if (!unlocked || muted || held || !song) {
        players.forEach(p => { if (!p.paused) fade(p, 0, 500, () => { p.pause(); updateBtn(); }); });
        updateBtn();
        return;
      }
      if (curKey === wanted) {
        if (A.paused) A.play().catch(() => {});
        fade(A, MAX, 900, updateBtn);
        updateBtn();
        return;
      }
      // naya gaana: dusre player pe load karo, crossfade
      const old = A;
      cur = 1 - cur;
      curKey = wanted;
      const next = players[cur];
      cancelAnimationFrame(raf.get(next));
      next.src = song.file;
      try { next.volume = 0; } catch (_) {}
      next.play().then(() => { toast(song.title); updateBtn(); }).catch(() => {});
      fade(next, MAX, 1400);
      if (!old.paused) fade(old, 0, 1000, () => old.pause());
    }

    // phone pe gaana sirf user ke tap ke baad chal sakta hai — tap pe player "unlock" karte hain
    function unlock() {
      players[cur].src = silentWav();
      players[cur].play().catch(() => {});
      unlocked = true;
      btn.hidden = false;
      apply();
    }

    btn.addEventListener('click', () => { muted = !muted; apply(); });
    document.addEventListener('visibilitychange', apply);
    players.forEach(p => p.addEventListener('pause', updateBtn));

    return {
      unlock,
      setSection(key) { if (key && key !== wanted) { wanted = key; if (!videoPlaying()) held = false; apply(); } },
      hold(on) { held = on; apply(); },
    };
  })();

  function silentWav() {
    const sr = 8000, n = 800, b = new ArrayBuffer(44 + n), v = new DataView(b);
    const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    w(36, 'data'); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  }

  /* =========================================================
     💚 CURSOR + ✨🌸🦋 trail
     ========================================================= */
  const EMOJI = ['✨', '🌸', '🦋', '💖', '🌷', '✨', '🦋'];
  let liveTrail = 0;
  function sparkle(x, y, n = 1, spread = 14, lift = 70, list = EMOJI) {
    for (let k = 0; k < n && liveTrail < 60; k++) {
      liveTrail++;
      const s = el('span', 'trail', list[(Math.random() * list.length) | 0]);
      s.style.setProperty('--fs', rand(13, 24).toFixed(0) + 'px');
      document.body.appendChild(s);
      const dx = rand(-spread, spread), dy = -rand(lift * .4, lift), r = rand(-50, 50);
      const at = (px, py, sc, rot) => `translate(${px}px, ${py}px) translate(-50%, -50%) scale(${sc}) rotate(${rot}deg)`;
      const a = s.animate([
        { transform: at(x, y, .3, 0), opacity: 0 },
        { transform: at(x + dx * .3, y + dy * .2, 1, r / 3), opacity: 1, offset: .15 },
        { transform: at(x + dx, y + dy, .6, r), opacity: 0 },
      ], { duration: rand(1100, 1800), easing: 'cubic-bezier(.2,.7,.3,1)' });
      a.onfinish = a.oncancel = () => { s.remove(); liveTrail--; };
    }
  }
  (function cursor() {
    const dot = $('#cursor');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) {   // phone: jahan tap karo wahan ✨🌸🦋
      addEventListener('pointerdown', e => sparkle(e.clientX, e.clientY, 5, 40, 80), { passive: true });
      return;
    }
    document.documentElement.classList.add('has-cursor');
    const HOVER = 'button, a, input, [role=button], .swipe-card, .compare, .zoomable img, .candle';
    let lx = 0, ly = 0, lt = 0;
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      dot.classList.add('show');
      const now = performance.now();
      if (!reduced && Math.hypot(e.clientX - lx, e.clientY - ly) > 26 && now - lt > 40) {
        sparkle(e.clientX, e.clientY);
        lx = e.clientX; ly = e.clientY; lt = now;
      }
    }, { passive: true });
    document.addEventListener('mouseleave', () => dot.classList.remove('show'));
    document.addEventListener('mouseenter', () => dot.classList.add('show'));
    addEventListener('pointerdown', e => { dot.classList.add('down'); sparkle(e.clientX, e.clientY, 7, 50, 90); });
    addEventListener('pointerup', () => dot.classList.remove('down'));
    document.addEventListener('pointerover', e => dot.classList.toggle('hover', !!e.target.closest?.(HOVER)));
  })();

  /* =========================================================
     💖 Background hearts + 🎊 confetti
     ========================================================= */
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function fitCanvas(c) {
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function heartPath(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
    ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s);
    ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3);
    ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
    ctx.fill();
  }

  const bg = $('#hearts-bg'), bgx = bg.getContext('2d');
  const hearts = Array.from({ length: innerWidth < 600 ? 16 : 26 }, () => newHeart(true));
  function newHeart(anywhere) {
    return {
      x: rand(0, innerWidth), y: anywhere ? rand(0, innerHeight) : innerHeight + 30,
      s: rand(8, 22), v: rand(.2, .6), sway: rand(0, Math.PI * 2), a: rand(.08, .28),
      c: Math.random() < .6 ? '255,122,168' : '232,194,122',
    };
  }
  function drawHearts() {
    bgx.clearRect(0, 0, innerWidth, innerHeight);
    for (const h of hearts) {
      h.y -= h.v; h.sway += .01;
      if (h.y < -30) Object.assign(h, newHeart(false));
      bgx.fillStyle = `rgba(${h.c},${h.a})`;
      heartPath(bgx, h.x + Math.sin(h.sway) * 14, h.y, h.s);
    }
    if (!reduced) requestAnimationFrame(drawHearts);
  }

  const cf = $('#confetti'), cfx = cf.getContext('2d');
  const COLORS = ['#e8c27a', '#f8e3b0', '#ff7aa8', '#ffc2d4', '#ffffff', '#ff4f8b'];
  let parts = [], cfRunning = false;
  function burst(x, y, n = 90, power = 9) {
    for (let i = 0; i < n; i++) {
      const ang = rand(0, Math.PI * 2), sp = rand(power * .3, power);
      parts.push({
        x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - power * .5,
        r: rand(0, Math.PI), vr: rand(-.2, .2), s: rand(5, 10),
        c: COLORS[(Math.random() * COLORS.length) | 0], heart: Math.random() < .25, life: 1,
      });
    }
    if (!cfRunning) { cfRunning = true; requestAnimationFrame(drawConfetti); }
  }
  function celebrate() {
    burst(innerWidth * .15, innerHeight * .8, 90, 13);
    burst(innerWidth * .85, innerHeight * .8, 90, 13);
    setTimeout(() => burst(innerWidth / 2, innerHeight * .4, 120, 11), 350);
  }
  function drawConfetti() {
    cfx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.y < innerHeight + 30 && p.life > 0);
    for (const p of parts) {
      p.vy += .22; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= .004;
      cfx.save();
      cfx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.5));
      cfx.translate(p.x, p.y); cfx.rotate(p.r);
      cfx.fillStyle = p.c;
      if (p.heart) heartPath(cfx, 0, -p.s / 2, p.s * 1.4);
      else cfx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      cfx.restore();
    }
    if (parts.length) requestAnimationFrame(drawConfetti);
    else { cfRunning = false; cfx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  function onResize() { fitCanvas(bg); fitCanvas(cf); }
  addEventListener('resize', onResize);
  onResize();
  drawHearts();

  /* =========================================================
     🧱 Config se slides banao
     ========================================================= */
  $$('[data-name]').forEach(n => (n.textContent = C.name));
  document.title = `Happy Birthday ${C.name} ❤️`;
  $('#hero-sub').textContent = C.heroLine || '';
  $('#pw-hint').textContent = C.passwordHint || '';
  const newSlide = (song, cls = '') => {
    const s = el('section', ('slide ' + cls).trim());
    s.dataset.song = song;
    return s;
  };

  // 📅 Har saal ki ek slide
  (function timeline() {
    $('#year-strip').innerHTML = C.timeline.map(t => `<span>${esc(t.year)}</span>`).join('');
    let after = $('#s-timeline');
    C.timeline.forEach((t, k) => {
      const s = newSlide('timeline', 'year-slide');
      const inner = el('div', 'slide-inner center', `
        <p class="eyebrow anim">Saal ${k + 1} / ${C.timeline.length}</p>
        <div class="year-num anim">${esc(t.year)}</div>
        <h3 class="year-title anim">${esc(t.title)}</h3>
        <p class="muted anim">${esc(t.caption)}</p>`);
      const grid = el('div', 'polaroids');
      (t.photos || []).forEach((p, j) => {
        const f = el('figure', 'polaroid');
        f.style.setProperty('--r', ((j % 2 ? 1 : -1) * rand(1.5, 4)).toFixed(1) + 'deg');
        f.style.setProperty('--p', j);
        f.appendChild(photo(p, { zoom: true, alt: `${C.name} ${t.year}` }));
        grid.appendChild(f);
      });
      inner.appendChild(grid);
      s.appendChild(inner);
      after.after(s);
      after = s;
    });
  })();

  // 😜 Funny sticker: tap karo to naya joke + 🌼 udte hain
  (function sticker() {
    const wrap = $('#sticker'), btn = $('#sticker-btn'), bubble = $('#bubble'), img = $('img', btn);
    const lines = C.stickerLines?.length ? C.stickerLines : ['😜'];
    let k = -1;
    img.addEventListener('error', () => (wrap.hidden = true));   // photo nahi mili to sticker chhupa do
    const say = () => {
      k = (k + 1) % lines.length;
      bubble.textContent = lines[k];
      bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
    };
    btn.addEventListener('click', () => {
      say();
      btn.classList.remove('squish'); void btn.offsetWidth; btn.classList.add('squish');
      const [x, y] = center(btn);
      sparkle(x, y - 20, 9, 70, 110, ['🌼', '🌼', '✨', '😜', '💛']);
      burst(x, y, 14, 6);
    });
    $('#s-timeline').addEventListener('enter', () => { if (k < 0) setTimeout(say, 1300); });
  })();

  // 🌟 Spotlights
  [['#spot-bholi', 'bholi'], ['#spot-tuhotoh', 'tuhotoh']].forEach(([sel, key]) => {
    const s = C.spotlights?.[key];
    const sec = $(sel);
    if (!s) { sec.remove(); return; }
    sec.dataset.song = s.song;
    const inner = el('div', 'slide-inner center');
    const songTitle = C.songs[s.song]?.title;
    if (songTitle) inner.appendChild(el('span', 'song-tag anim', '🎵 ' + esc(songTitle)));
    const frame = el('div', 'spot-frame anim');
    frame.appendChild(photo(s.photo, { zoom: true }));
    inner.appendChild(frame);
    inner.appendChild(el('p', 'script spot-line anim', esc(s.line)));
    inner.appendChild(el('p', 'spot-sub anim', esc(s.sub)));
    sec.appendChild(inner);
  });

  // 🎬 Har video ki ek slide — video chale to background music ruk jaye
  (function videos() {
    const vids = [];
    videoPlaying = () => vids.some(v => !v.paused && !v.ended);
    const slot = $('#video-slot');
    C.videos.forEach((v, k) => {
      const s = newSlide('videos');
      const inner = el('div', 'slide-inner center', `
        <p class="eyebrow anim">Chapter 2 · Video ${k + 1} / ${C.videos.length}</p>
        <h2 class="script anim">Meri Nishu, Badi Hote Hue</h2>`);
      const card = el('figure', 'vid-card anim');
      if (v.youtube) {
        const f = el('iframe', v.vertical ? 'vertical' : '');
        f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtube)}?rel=0&playsinline=1&modestbranding=1&enablejsapi=1`;
        f.title = v.caption || 'Video';
        f.loading = 'lazy';
        f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        card.appendChild(f);
        s.addEventListener('leave', () => f.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'));
      } else {
        const video = el('video');
        video.controls = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.preload = 'metadata';
        if (v.poster) video.poster = v.poster;
        const fail = () => video.replaceWith(el('div', 'ph-wrap missing', `<div class="ph"><span>🎬</span><small>${esc(v.src || 'video')}</small></div>`));
        card.appendChild(video);
        if (!v.src) fail();
        else {
          video.addEventListener('error', fail);
          video.src = v.src;
          video.addEventListener('play', () => { vids.forEach(o => { if (o !== video) o.pause(); }); Music.hold(true); });
          const release = () => { if (!videoPlaying()) Music.hold(false); };
          video.addEventListener('pause', release);
          video.addEventListener('ended', release);
          vids.push(video);
          s.addEventListener('leave', () => video.pause());
        }
      }
      if (v.caption) card.appendChild(el('figcaption', '', esc(v.caption)));
      inner.appendChild(card);
      s.appendChild(inner);
      slot.before(s);
    });
    // YouTube video pe tap kiya (iframe focus) to music rok do
    addEventListener('blur', () => {
      setTimeout(() => { if (document.activeElement?.tagName === 'IFRAME') Music.hold(true); }, 0);
    });
  })();

  /* =========================================================
     ⏭ CLICK NAVIGATION — "Aage" dabao, agli slide
     ========================================================= */
  const Nav = (() => {
    const slides = $$('#stage > .slide');
    slides.forEach(s => $$('.anim', s).forEach((n, i) => n.style.setProperty('--i', i)));
    const bar = $('#navbar'), prev = $('#prev'), next = $('#next'), counter = $('#counter');
    const progress = $('#progress i');
    let idx = -1;

    function goTo(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      if (i === idx) return;
      const old = slides[idx];
      if (old) { old.classList.remove('active'); old.dispatchEvent(new Event('leave')); }
      slides.forEach((s, j) => s.classList.toggle('past', j < i));
      const cur = slides[i];
      cur.scrollTop = 0;
      cur.classList.add('active');
      idx = i;
      counter.textContent = `${i + 1} / ${slides.length}`;
      progress.style.width = ((i + 1) / slides.length) * 100 + '%';
      prev.disabled = i === 0;
      bar.classList.toggle('last', i === slides.length - 1);
      Music.setSection(cur.dataset.song);
      cur.dispatchEvent(new Event('enter'));
    }
    next.addEventListener('click', () => goTo(idx + 1));
    prev.addEventListener('click', () => goTo(idx - 1));
    addEventListener('keydown', e => {
      if (bar.hidden || e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goTo(idx + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goTo(idx - 1); }
    });
    return { goTo, show: () => (bar.hidden = false) };
  })();

  /* =========================================================
     🔐 LOCK
     ========================================================= */
  const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
  const wrongLines = ['Galat hai madam 😜 phir se try karo', 'Nahi nahi… sochke daalo 🤔', 'Arey! Itna bhi nahi pata? 🥺', 'Hint padho na 😌'];
  let tries = 0;
  $('#lock-form').addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#pw');
    if (norm(input.value) !== norm(C.password)) {
      const card = $('.lock-card');
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      $('#pw-err').textContent = wrongLines[tries++ % wrongLines.length];
      input.select();
      return;
    }
    input.blur();
    Nav.goTo(0);
    Music.unlock();               // tap ke andar hi music unlock hona chahiye
    $('#padlock').classList.add('open');
    $('#pw-err').textContent = '';
    setTimeout(() => {
      $('#lock').classList.add('gone');
      document.body.classList.remove('locked');
      Nav.show();
      startHero();
    }, 650);
  });

  /* =========================================================
     🎉 HERO
     ========================================================= */
  function startHero() {
    const hero = $('#s-hero');
    hero.classList.add('go');
    celebrate();
    const target = $('#typed');
    const text = C.name;
    let i = 0;
    setTimeout(function type() {
      target.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(type, 220);
      else { hero.classList.add('done'); burst(innerWidth / 2, innerHeight * .45, 70, 8); }
    }, 900);
  }

  (function balloons() {
    const box = $('#balloons');
    const cols = ['#ff7aa8', '#e8c27a', '#ffc2d4', '#c9467a', '#f8e3b0', '#ff4f8b'];
    const n = innerWidth < 600 ? 10 : 16;
    for (let i = 0; i < n; i++) {
      const b = el('span', 'balloon');
      b.style.left = rand(0, 94) + '%';
      b.style.setProperty('--s', rand(34, 62) + 'px');
      b.style.setProperty('--c', cols[i % cols.length]);
      b.style.setProperty('--d', rand(11, 19) + 's');
      b.style.setProperty('--delay', -rand(0, 18) + 's');
      b.style.setProperty('--x', rand(-40, 40) + 'px');
      box.appendChild(b);
    }
  })();

  (function countdown() {
    if (!C.birthday) return;
    const box = $('#countdown');
    const [y, m, d] = C.birthday.split('-').map(Number);
    if (!y || !m || !d) return;
    const target = new Date(y, m - 1, d);
    box.hidden = false;
    const tick = () => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        const isToday = now.toDateString() === target.toDateString();
        box.innerHTML = isToday ? '<div class="today">Aaj tumhara din hai 🎂✨</div>' : '';
        if (!isToday) box.hidden = true;
        return;
      }
      const s = Math.floor(diff / 1000);
      const parts = [[Math.floor(s / 86400), 'Din'], [Math.floor(s / 3600) % 24, 'Ghante'], [Math.floor(s / 60) % 60, 'Minute'], [s % 60, 'Second']];
      box.innerHTML = parts.map(([v, l]) => `<div><b>${String(v).padStart(2, '0')}</b><small>${l}</small></div>`).join('');
      setTimeout(tick, 1000);
    };
    tick();
  })();

  /* =========================================================
     ⇆ THEN vs NOW
     ========================================================= */
  (function compare() {
    const box = $('#compare');
    const tn = C.thenNow || {};
    $('.cmp-then', box).appendChild(photo(tn.then));
    $('.cmp-now', box).appendChild(photo(tn.now));
    $('#then-label').textContent = tn.thenLabel || 'Tab';
    $('#now-label').textContent = tn.nowLabel || 'Ab';
    let dragging = false;
    const set = x => {
      const r = box.getBoundingClientRect();
      box.style.setProperty('--pos', Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)) + '%');
    };
    box.addEventListener('pointerdown', e => { dragging = true; box.classList.remove('hint'); set(e.clientX); });
    addEventListener('pointermove', e => { if (dragging) set(e.clientX); });
    ['pointerup', 'pointercancel'].forEach(t => addEventListener(t, () => (dragging = false)));
    $('#s-thennow').addEventListener('enter', () => {
      box.classList.remove('hint');
      setTimeout(() => box.classList.add('hint'), 1200);
    });
  })();

  /* =========================================================
     📸 SWIPE DECK — swipe ya tap
     ========================================================= */
  (function deck() {
    const deck = $('#deck');
    C.swipe.forEach(s => {
      const card = el('div', 'swipe-card');
      card.appendChild(photo(s.photo));
      card.appendChild(el('p', 'swipe-cap', esc(s.caption)));
      deck.appendChild(card);
    });
    const layout = () => {
      const cards = $$('.swipe-card', deck);
      cards.forEach((c, i) => {
        c.style.zIndex = cards.length - i;
        c.style.transform = `translateY(${Math.min(i, 3) * 12}px) scale(${1 - Math.min(i, 3) * .05}) rotate(${i === 0 ? 0 : (i % 2 ? 2 : -2)}deg)`;
        c.style.opacity = i > 3 ? 0 : 1;
      });
    };
    const flyOut = (card, dir) => {
      card.classList.remove('dragging');
      card.style.transform = `translate(${dir * innerWidth}px, -40px) rotate(${dir * 30}deg)`;
      card.style.opacity = 0;
      const [x, y] = center(deck);
      burst(x, y, 24, 6);
      setTimeout(() => { deck.appendChild(card); layout(); }, 350);
    };

    let start = null, dx = 0, top = null;
    deck.addEventListener('pointerdown', e => {
      top = deck.firstElementChild;
      if (!top || !top.contains(e.target)) return;
      start = { x: e.clientX };
      dx = 0;
      top.classList.add('dragging');
    });
    addEventListener('pointermove', e => {
      if (!start) return;
      dx = e.clientX - start.x;
      top.style.transform = `translateX(${dx}px) rotate(${dx / 14}deg)`;
    });
    const end = e => {
      if (!start) return;
      start = null;
      if (Math.abs(dx) > 80) flyOut(top, Math.sign(dx));
      else if (Math.abs(dx) < 6 && e.type === 'pointerup') flyOut(top, 1);   // tap = agli photo
      else { top.classList.remove('dragging'); layout(); }
    };
    addEventListener('pointerup', end);
    addEventListener('pointercancel', end);
    layout();
  })();

  /* =========================================================
     💌 REASONS — tap: card khulta hai, phir tap: agla card
     ========================================================= */
  (function reasons() {
    const R = C.reasons;
    const card = $('#reason-card'), num = $('#reason-num'), txt = $('#reason-text'), count = $('#reason-count');
    let i = 0, flipped = false, busy = false, seen = 0;
    const setCard = k => { num.textContent = '#' + (k + 1); txt.textContent = R[k]; };
    const upd = () => {
      count.textContent = seen >= R.length
        ? 'Saare khul gaye… par ye list kabhi khatam nahi hogi ❤️'
        : `${seen} / ${R.length} khule · ${flipped ? 'agle ke liye phir tap karo' : 'card pe tap karo'}`;
    };
    card.addEventListener('click', () => {
      if (busy) return;
      if (!flipped) {
        flipped = true;
        card.classList.add('flipped');
        seen = Math.max(seen, i + 1);
        upd();
        const [x, y] = center(card);
        burst(x, y, seen === R.length ? 120 : 22, seen === R.length ? 12 : 6);
        if (seen === R.length && i === R.length - 1) setTimeout(celebrate, 400);
        return;
      }
      busy = true;
      card.classList.add('out');
      setTimeout(() => {
        i = (i + 1) % R.length;
        flipped = false;
        card.classList.add('instant', 'in');
        card.classList.remove('flipped', 'out');
        setCard(i);
        void card.offsetWidth;
        card.classList.remove('instant', 'in');
        busy = false;
        upd();
      }, 450);
    });
    setCard(0);
    upd();
  })();

  /* =========================================================
     🎮 QUIZ
     ========================================================= */
  (function quiz() {
    const box = $('#quiz-card');
    const Q = C.quiz;
    let idx = 0, score = 0;
    const wrongMsgs = ['Sach mein? 🥺', 'Uff! Itna bhi yaad nahi? 😤', 'Galat! Ab kiss dena padega 😘', 'Hmm… dobara socho 🙄'];

    function render() {
      if (idx >= Q.length) return finish();
      const q = Q[idx];
      box.innerHTML = `
        <div class="q-progress"><i style="width:${(idx / Q.length) * 100}%"></i></div>
        <p class="q-num">Sawaal ${idx + 1} / ${Q.length}</p>
        <p class="q-text">${esc(q.q)}</p>
        <div class="q-opts"></div>
        <p class="q-msg" aria-live="polite"></p>
        <div class="q-actions"></div>`;
      const opts = $('.q-opts', box);
      q.options.forEach((o, i) => {
        const b = el('button', 'opt', esc(o));
        b.style.setProperty('--o', i);
        b.addEventListener('click', () => answer(i, b));
        opts.appendChild(b);
      });
    }
    function answer(i, b) {
      const q = Q[idx];
      const all = $$('.opt', box);
      all.forEach(x => (x.disabled = true));
      const msg = $('.q-msg', box);
      if (i === q.answer) {
        score++;
        b.classList.add('correct');
        msg.textContent = q.right || 'Sahi jawab! 😍';
        const [x, y] = center(b);
        burst(x, y, 40, 7);
      } else {
        b.classList.add('wrong');
        all[q.answer]?.classList.add('correct');
        msg.textContent = q.wrong || wrongMsgs[idx % wrongMsgs.length];
      }
      const next = el('button', 'btn', idx + 1 < Q.length ? 'Agla sawaal ➜' : 'Result dekho 🎁');
      next.addEventListener('click', () => { idx++; render(); });
      $('.q-actions', box).appendChild(next);
    }
    function finish() {
      const line = score === Q.length ? 'Full marks! Tum sach mein meri ho 😍'
        : score >= Q.length / 2 ? 'Achha hai… par mere liye tum hamesha 100/100 ho ❤️'
        : 'Koi baat nahi, tum phir bhi meri favourite ho 😘';
      box.innerHTML = `<div class="q-final">
          <div class="q-progress"><i style="width:100%"></i></div>
          <p class="q-num">Tumhara score</p>
          <p class="score">${score} / ${Q.length}</p>
          <p class="q-msg">${line}</p>
          <div class="q-actions"><button class="btn ghost" id="q-again">Phir se khelo ↺</button></div>
        </div>`;
      $('#q-again', box).addEventListener('click', () => { idx = 0; score = 0; render(); });
      if (score === Q.length) celebrate();
    }
    render();
  })();

  /* =========================================================
     🎂 CAKE — tap ya mic se phoonk
     ========================================================= */
  (function cake() {
    const wrap = $('#candles');
    const msg = $('#cake-msg');
    const micBtn = $('#mic-btn');
    const n = Math.max(1, Math.min(7, C.candles || 5));
    let stream = null, actx = null, done = false;

    function build() {
      wrap.innerHTML = '';
      done = false;
      for (let i = 0; i < n; i++) {
        const c = el('button', 'candle', '<span class="stick"></span><span class="flame"></span>');
        c.setAttribute('aria-label', 'Candle bujhao');
        c.addEventListener('click', () => blow(c));
        wrap.appendChild(c);
      }
    }
    function blow(c) {
      if (!c || c.classList.contains('out')) return;
      c.classList.add('out');
      if (!$$('.candle:not(.out)', wrap).length) allOut();
    }
    function allOut() {
      if (done) return;
      done = true;
      stopMic();
      celebrate();
      setTimeout(celebrate, 900);
      msg.innerHTML = `Happy Birthday ${esc(C.name)}! 🎉<br>Tumhari har wish poori ho ✨`;
      micBtn.textContent = '🕯️ Phir se jalao';
    }
    function stopMic() {
      stream?.getTracks().forEach(t => t.stop());
      stream = null;
      actx?.close().catch(() => {});
      actx = null;
    }
    micBtn.addEventListener('click', async () => {
      if (done) { build(); msg.textContent = ''; micBtn.textContent = '🎤 Phoonk ke bujhao'; return; }
      if (stream) return;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false } });
      } catch (_) {
        msg.textContent = 'Mic nahi chala 😅 candles pe tap karke bujhao';
        return;
      }
      msg.textContent = 'Ab zor se phoonko… 💨';
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const an = actx.createAnalyser();
      an.fftSize = 512;
      actx.createMediaStreamSource(stream).connect(an);
      const data = new Uint8Array(an.fftSize);
      let loud = 0, last = 0;
      (function listen(t) {
        if (!stream) return;
        an.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) { const x = (v - 128) / 128; sum += x * x; }
        loud = Math.sqrt(sum / data.length) > 0.16 ? loud + 1 : 0;
        if (loud > 5 && t - last > 140) {
          last = t;
          const lit = $$('.candle:not(.out)', wrap);
          blow(lit[(Math.random() * lit.length) | 0]);
        }
        requestAnimationFrame(listen);
      })(0);
    });
    $('#s-cake').addEventListener('leave', stopMic);
    build();
  })();

  /* =========================================================
     ✉️ LETTER
     ========================================================= */
  (function letter() {
    const slide = $('#s-letter');
    const env = $('#envelope');
    const area = $('#envelope-area');
    const paper = $('#letter-paper');
    const textEl = $('#letter-text');
    const sign = $('#sign');
    const full = C.letter || '';
    let opened = false, typing = false, i = 0, timer;

    sign.textContent = `Hamesha tumhara,\n${C.from || ''} ❤️`;

    function open() {
      if (opened) return;
      opened = true;
      env.classList.add('open');
      const [x, y] = center(env);
      burst(x, y, 50, 7);
      setTimeout(() => {
        area.classList.add('away');
        setTimeout(() => {
          area.parentElement.hidden = true;
          paper.hidden = false;
          slide.scrollTop += paper.getBoundingClientRect().top - slide.getBoundingClientRect().top - 60;
          typeLetter();
        }, 600);
      }, 1500);
    }
    function typeLetter() {
      typing = true;
      textEl.classList.add('typing');
      (function step() {
        i++;
        textEl.textContent = full.slice(0, i);
        // likhte waqt neeche follow karo (agar user ne khud upar scroll nahi kiya)
        if (slide.scrollHeight - slide.scrollTop - slide.clientHeight < 220) slide.scrollTop = slide.scrollHeight;
        if (i < full.length) {
          const ch = full[i - 1];
          timer = setTimeout(step, ch === '\n' ? 300 : /[.,!?…]/.test(ch) ? 180 : 38);
        } else finish();
      })();
    }
    function finish() {
      clearTimeout(timer);
      typing = false;
      textEl.textContent = full;
      textEl.classList.remove('typing');
      $('#skip-hint').hidden = true;
      setTimeout(() => sign.classList.add('show'), 400);
      setTimeout(() => {
        slide.scrollTo({ top: slide.scrollHeight, behavior: 'smooth' });
        const [x, y] = center($('#next'));
        sparkle(x, y, 10, 60, 120);
      }, 1400);
    }
    env.addEventListener('click', open);
    env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    paper.addEventListener('click', () => { if (typing) finish(); });
  })();

  /* ❤️ FINALE */
  $('#s-finale').addEventListener('enter', () => setTimeout(celebrate, 500));
  $('#replay').addEventListener('click', () => Nav.goTo(0));
})();
