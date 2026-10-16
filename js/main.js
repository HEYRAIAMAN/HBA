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

  $$('[data-name]').forEach(n => (n.textContent = C.name));
  document.title = `Happy Birthday ${C.name} ❤️`;

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
    img.loading = 'lazy';
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
     🎵 MUSIC — 2 audio players, section badalne pe crossfade
     ========================================================= */
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
      const playing = !players[cur].paused && !muted && !held;
      btn.classList.toggle('playing', playing);
      btn.classList.toggle('off', muted);
    }

    function apply() {
      const song = wanted && C.songs[wanted];
      const A = players[cur];
      if (document.hidden) {        // phone lock / dusra app — turant pause (background mein animation nahi chalti)
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

    // iOS/Android pe gaana sirf user ke tap ke baad chal sakta hai — dono players ko tap pe "unlock" karte hain
    function unlock() {
      const silent = silentWav();
      players[cur].src = silent;
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
      setSection(key) { if (key && key !== wanted) { wanted = key; if (!Video.anyPlaying()) held = false; apply(); } },
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
     🔐 LOCK
     ========================================================= */
  const lock = $('#lock');
  $('#pw-hint').textContent = C.passwordHint || '';
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
    Music.setSection('hero');
    Music.unlock();               // tap ke andar hi music unlock hona chahiye
    $('#padlock').classList.add('open');
    $('#pw-err').textContent = '';
    setTimeout(() => {
      lock.classList.add('gone');
      document.body.classList.remove('locked');
      window.scrollTo(0, 0);
      startHero();
    }, 650);
  });

  /* =========================================================
     🎉 HERO
     ========================================================= */
  function startHero() {
    const hero = $('#hero');
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
  $('#hero-sub').textContent = C.heroLine || '';

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
     📅 TIMELINE
     ========================================================= */
  (function timeline() {
    const list = $('#timeline-list');
    C.timeline.forEach(t => {
      const item = el('article', 'tl-item reveal');
      item.appendChild(el('div', 'tl-dot'));
      item.appendChild(el('div', 'tl-year', esc(t.year)));
      const card = el('div', 'tl-card');
      card.appendChild(el('h3', '', esc(t.title)));
      card.appendChild(el('p', 'muted', esc(t.caption)));
      const grid = el('div', 'polaroids');
      (t.photos || []).forEach((p, j) => {
        const f = el('figure', 'polaroid');
        f.style.setProperty('--r', ((j % 2 ? 1 : -1) * rand(1.5, 4)).toFixed(1) + 'deg');
        f.appendChild(photo(p, { zoom: true, alt: `${C.name} ${t.year}` }));
        grid.appendChild(f);
      });
      card.appendChild(grid);
      item.appendChild(card);
      list.appendChild(item);
    });
  })();

  /* =========================================================
     🌟 SPOTLIGHTS
     ========================================================= */
  [['#spot-bholi', 'bholi'], ['#spot-tuhotoh', 'tuhotoh']].forEach(([sel, key]) => {
    const s = C.spotlights?.[key];
    const sec = $(sel);
    if (!s) { sec.remove(); return; }
    sec.dataset.song = s.song;
    const inner = el('div', 'reveal');
    const songTitle = C.songs[s.song]?.title;
    if (songTitle) inner.appendChild(el('span', 'song-tag', '🎵 ' + esc(songTitle)));
    const frame = el('div', 'spot-frame');
    frame.appendChild(photo(s.photo, { zoom: true }));
    inner.appendChild(frame);
    inner.appendChild(el('p', 'script spot-line', esc(s.line)));
    inner.appendChild(el('p', 'spot-sub', esc(s.sub)));
    sec.appendChild(inner);
  });

  /* =========================================================
     🎬 VIDEOS — video chale to background music ruk jaye
     ========================================================= */
  const Video = (() => {
    const vids = [];
    const anyPlaying = () => vids.some(v => !v.paused && !v.ended);
    const list = $('#video-list');
    C.videos.forEach(v => {
      const card = el('figure', 'vid-card reveal');
      if (v.youtube) {
        const f = el('iframe', v.vertical ? 'vertical' : '');
        f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtube)}?rel=0&playsinline=1&modestbranding=1`;
        f.title = v.caption || 'Video';
        f.loading = 'lazy';
        f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        card.appendChild(f);
      } else {
        const video = el('video');
        video.controls = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.preload = 'metadata';
        if (v.poster) video.poster = v.poster;
        const fail = () => {
          const ph = el('div', 'ph-wrap missing', `<div class="ph"><span>🎬</span><small>${esc(v.src || 'video')}</small></div>`);
          video.replaceWith(ph);
        };
        if (!v.src) { card.appendChild(video); fail(); }
        else {
          video.addEventListener('error', fail);
          video.src = v.src;
          video.addEventListener('play', () => {
            vids.forEach(o => { if (o !== video) o.pause(); });
            Music.hold(true);
          });
          const release = () => { if (!anyPlaying()) Music.hold(false); };
          video.addEventListener('pause', release);
          video.addEventListener('ended', release);
          vids.push(video);
          card.appendChild(video);
        }
      }
      if (v.caption) card.appendChild(el('figcaption', '', esc(v.caption)));
      list.appendChild(card);
    });
    // YouTube video pe tap kiya (iframe focus) to music rok do
    addEventListener('blur', () => {
      setTimeout(() => { if (document.activeElement?.tagName === 'IFRAME') Music.hold(true); }, 0);
    });
    return { anyPlaying };
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
      const pct = Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100));
      box.style.setProperty('--pos', pct + '%');
    };
    box.addEventListener('pointerdown', e => { dragging = true; box.classList.remove('hint'); set(e.clientX); });
    addEventListener('pointermove', e => { if (dragging) set(e.clientX); });
    ['pointerup', 'pointercancel'].forEach(t => addEventListener(t, () => (dragging = false)));
    new IntersectionObserver(([en], obs) => {
      if (en.isIntersecting) { box.classList.add('hint'); obs.disconnect(); }
    }, { threshold: .6 }).observe(box);
  })();

  /* =========================================================
     📸 SWIPE DECK
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
      if (dir > 0) {
        const r = deck.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 24, 6);
      }
      setTimeout(() => { deck.appendChild(card); layout(); }, 350);
    };

    let start = null, dx = 0, top = null;
    deck.addEventListener('pointerdown', e => {
      top = deck.firstElementChild;
      if (!top || !top.contains(e.target)) return;
      start = { x: e.clientX, y: e.clientY };
      dx = 0;
      top.classList.add('dragging');
    });
    addEventListener('pointermove', e => {
      if (!start) return;
      dx = e.clientX - start.x;
      top.style.transform = `translateX(${dx}px) rotate(${dx / 14}deg)`;
    });
    const end = () => {
      if (!start) return;
      start = null;
      if (Math.abs(dx) > 80) flyOut(top, Math.sign(dx));
      else { top.classList.remove('dragging'); layout(); }
    };
    addEventListener('pointerup', end);
    addEventListener('pointercancel', end);
    $('#next-card').addEventListener('click', () => { const t = deck.firstElementChild; if (t) flyOut(t, 1); });
    layout();
  })();

  /* =========================================================
     💌 REASONS
     ========================================================= */
  (function reasons() {
    const list = $('#reason-list');
    const count = $('#reason-count');
    const total = C.reasons.length;
    let opened = 0;
    const upd = () => (count.textContent = opened < total ? `${opened} / ${total} khule 💌` : 'Aur ye list kabhi khatam nahi hogi ❤️');
    C.reasons.forEach((r, i) => {
      const b = el('button', 'flip reveal');
      b.setAttribute('aria-label', `Reason ${i + 1}`);
      b.innerHTML = `<div class="flip-inner">
          <div class="face front"><b>#${i + 1}</b><span>💌</span><small>Tap karo</small></div>
          <div class="face back">${esc(r)}</div>
        </div>`;
      b.addEventListener('click', () => {
        const first = !b.dataset.seen;
        b.classList.toggle('flipped');
        if (first) {
          b.dataset.seen = 1;
          opened++;
          upd();
          const rc = b.getBoundingClientRect();
          burst(rc.left + rc.width / 2, rc.top + rc.height / 2, opened === total ? 120 : 18, opened === total ? 12 : 5);
          if (opened === total) setTimeout(celebrate, 300);
        }
      });
      list.appendChild(b);
    });
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
        const r = b.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 40, 7);
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
        const rms = Math.sqrt(sum / data.length);
        loud = rms > 0.16 ? loud + 1 : 0;
        if (loud > 5 && t - last > 140) {
          last = t;
          const lit = $$('.candle:not(.out)', wrap);
          blow(lit[(Math.random() * lit.length) | 0]);
        }
        requestAnimationFrame(listen);
      })(0);
    });
    build();
  })();

  /* =========================================================
     ✉️ LETTER
     ========================================================= */
  (function letter() {
    const env = $('#envelope');
    const area = $('#envelope-area');
    const paper = $('#letter-paper');
    const textEl = $('#letter-text');
    const sign = $('#sign');
    const finale = $('#finale');
    const full = C.letter || '';
    let opened = false, typing = false, i = 0, timer;

    sign.textContent = `Hamesha tumhara,\n${C.from || ''} ❤️`;
    sign.style.whiteSpace = 'pre-line';

    function open() {
      if (opened) return;
      opened = true;
      env.classList.add('open');
      const r = env.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 50, 7);
      setTimeout(() => {
        area.classList.add('away');
        setTimeout(() => {
          area.hidden = true;
          paper.hidden = false;
          paper.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        finale.hidden = false;
        celebrate();
      }, 1600);
    }
    env.addEventListener('click', open);
    env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    paper.addEventListener('click', () => { if (typing) finish(); });
    $('#replay').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  })();

  /* =========================================================
     👀 Scroll pe reveal + section ka gaana
     ========================================================= */
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(n => revealer.observe(n));

  const songWatcher = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) Music.setSection(e.target.dataset.song); });
  }, { rootMargin: '-48% 0px -48% 0px' });
  $$('[data-song]').forEach(n => songWatcher.observe(n));
})();
