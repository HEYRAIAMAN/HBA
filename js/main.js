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

  // 🧷 Collage: har tukda thoda tedha aur thoda khiska hua
  const scatter = (node, j) => {
    node.style.setProperty('--p', j);
    node.style.setProperty('--r', ((j % 2 ? 1 : -1) * rand(1.5, 5)).toFixed(1) + 'deg');
    node.style.setProperty('--dx', rand(-3, 3).toFixed(1) + 'cqw');
    node.style.setProperty('--tr', rand(-7, 7).toFixed(1) + 'deg');
    if (!node.classList.contains('span')) node.style.setProperty('--w', rand(88, 100).toFixed(0) + '%');
  };

  // 🧷 Collage ke special tukde: Drake meme, sticky note, attendance register
  function collagePiece(p) {
    if (p.meme === 'drake') {
      const f = el('figure', 'piece drake span');
      f.setAttribute('role', 'img');
      f.setAttribute('aria-label', (p.rows || []).map(r => r.text).join(' / '));
      (p.rows || []).forEach(r => {
        const pic = el('div', 'drake-pic');
        const ph = photo(r.src, { alt: r.text });
        if (r.pos) ph.firstChild.style.objectPosition = r.pos;
        pic.append(ph, el('span', 'drake-badge', r.yes ? '👍' : '🙅'));
        const row = el('div', 'drake-row' + (r.yes ? ' yes' : ''));
        row.append(pic, el('p', 'drake-text', esc(r.text)));
        f.appendChild(row);
      });
      return f;
    }
    if (p.bunk) {
      const f = el('div', 'piece bunk span', `<h4>${esc(p.bunk.title || 'Attendance register 📒')}</h4>`);
      (p.bunk.rows || []).forEach(r => {
        const pct = Math.max(0, Math.min(100, +r.pct || 0));
        f.appendChild(el('div', 'bunk-row' + (pct < 50 ? ' low' : ''), `
          <span>${esc(r.label)} <b>${pct}%</b> ${esc(r.emoji || '')}</span>
          <div class="bar"><i style="--pct: ${pct}%"></i></div>`));
      });
      return f;
    }
    const f = el('div', 'piece note ' + (p.tone || 'yellow'), esc(p.note));
    if (p.sub) f.appendChild(el('small', '', esc(p.sub)));
    return f;
  }

  // 📅 Har saal ki ek slide
  (function timeline() {
    $('#year-strip').innerHTML = C.timeline.map(t => `<span>${esc(t.year)}</span>`).join('');
    let after = $('#s-timeline');
    const n = C.timeline.length, first = C.timeline[0].year, last = C.timeline[n - 1].year;
    C.timeline.forEach((t, k) => {
      const side = t.firstPhoto || t.cutout;   // side mein dikhne wali photo (poori ya cutout)
      const s = newSlide(t.song || 'timeline', 'year-slide' + (t.meme || side || t.grow || t.game || t.mana || t.calendar || t.love || t.battery ? ' meme-year' : '') + (t.collage ? ' collage-year' : '') + (t.love ? ' love-year' : ''));
      if (t.love) s.appendChild(lovePetals());   // peeche rising hearts
      // 🏍️ safar ki road: bike is saal tak chal ke rukti hai
      const journey = t.journey ? `
        <div class="journey anim" style="--to: ${(((k + 1) / n) * 100).toFixed(1)}%">
          <span>📍 ${esc(first)}</span>
          <div class="road"><span class="bike" aria-hidden="true">🏍️💨</span></div>
          <span>🏁 ${esc(last)}</span>
        </div>
        <p class="journey-label anim">Safar shuru… <b>${k + 1}/${n}</b></p>` : '';
      // 🙅 / 😍 wala meme
      const meme = t.meme ? `
        <div class="meme anim" role="img" aria-label="${esc(t.meme.no)} nahi, ${esc(t.meme.yes)}">
          <span class="meme-face">🙅‍♂️</span><span class="meme-text"><s>${esc(t.meme.no)}</s></span>
          <span class="meme-face yes">😍</span><span class="meme-text yes">${esc(t.meme.yes)}</span>
        </div>` : '';
      const inner = el('div', 'slide-inner center', `
        <div class="year-text">
          <p class="eyebrow anim">Saal ${k + 1} / ${n}</p>
          <div class="year-num anim">${esc(t.year)}</div>
          <h3 class="year-title anim">${esc(t.title)}</h3>
          <p class="muted anim">${esc(t.caption)}</p>
          ${journey}${meme}
        </div>`);
      const grid = el('div', 'polaroids' + (t.collage ? ' collage' : ''));
      (t.photos || []).forEach((p, j) => {
        if (t.collage && typeof p === 'object' && !p.src) {   // meme / sticky note / register
          const piece = collagePiece(p);
          scatter(piece, j);
          grid.appendChild(piece);
          return;
        }
        const src = typeof p === 'string' ? p : p.src;
        const f = el('figure', 'polaroid' + (p.fit === 'contain' ? ' contain' : '') + (p.cutout ? ' cut-item' : '') + (p.wide ? ' wide' : '') + (t.collage ? ' piece tape' + (p.span ? ' span' : '') : ''));
        f.style.setProperty('--r', ((j % 2 ? 1 : -1) * rand(1.5, 4)).toFixed(1) + 'deg');
        f.style.setProperty('--p', j);
        if (t.collage) scatter(f, j);
        const ph = photo(src, { zoom: true, alt: `${C.name} ${t.year}` });
        if (p.pos) ph.firstChild.style.objectPosition = p.pos;   // photo ka kaunsa hissa dikhe (jaise "50% 15%")
        f.appendChild(ph);
        if (p.stick) f.appendChild(el('span', 'stk' + (j % 2 ? ' l' : ''), esc(p.stick)));   // emoji sticker
        if (p.cap) f.appendChild(el('figcaption', 'pol-cap', esc(p.cap)));
        grid.appendChild(f);
      });
      // 🍔 interactive: tap karo to cutout badi hoti jati hai, meters bharte hain
      if (t.grow?.src) grid.prepend(growCard(t.grow));
      // 🦠 covid bhagao mini game (config: timeline[].game)
      if (t.game) grid.prepend(gameCard(t.game));
      // 😤➜🥰 roothna-manana (config: timeline[].mana)
      if (t.mana) grid.prepend(manaCard(t.mana));
      // 🌸 har mahine ki ek photo wala Smile Calendar (config: timeline[].calendar)
      if (t.calendar) grid.prepend(calCard(t.calendar));
      // 💖 love theme: Love Level Up (config: timeline[].love)
      if (t.love) grid.prepend(loveCard(t.love));
      // 🔋 aadat se zaroorat: Battery + Nishu charger (config: timeline[].battery)
      if (t.battery) grid.prepend(batteryCard(t.battery));
      inner.appendChild(grid);
      // 🧷 collage ke tukde scroll karke jab dikhein tab gir ke aate hain (bars bhi tab bharte hain)
      if (t.collage) {
        const io = new IntersectionObserver(entries => {
          entries.filter(e => e.isIntersecting).forEach((e, n) => {
            e.target.style.animationDelay = n * 140 + 'ms';
            e.target.classList.add('in');
            io.unobserve(e.target);
          });
        }, { root: s, threshold: 0.1 });
        s.addEventListener('enter', () => $$('.piece', grid).forEach(n => { n.classList.remove('in'); io.observe(n); }));
        s.addEventListener('leave', () => $$('.piece', grid).forEach(n => { io.unobserve(n); n.classList.remove('in'); }));
      }
      // 😜 side mein photo (firstPhoto = poori photo polaroid mein, cutout = background hata hua): tap karo to squish + 🍫 udte hain
      if (side?.src) {
        const cut = el('div', 'year-cut anim' + (t.firstPhoto ? ' full' : ''), `
          ${side.say ? `<div class="bubble">${esc(side.say)}</div>` : ''}
          <button class="year-cut-btn" aria-label="${esc(C.name)} ${esc(t.year)}, tap karo">
            <img src="${esc(side.src)}" alt="" draggable="false">
            ${t.firstPhoto && side.label ? `<span class="pol-cap">${esc(side.label)}</span>` : ''}
          </button>`);
        const btn = $('button', cut);
        $('img', cut).addEventListener('error', () => cut.remove());
        btn.addEventListener('click', () => {
          btn.classList.remove('squish'); void btn.offsetWidth; btn.classList.add('squish');
          const [x, y] = center(btn);
          sparkle(x, y - 40, 9, 70, 110, ['🍫', '🏍️', '💖', '✨', '😜']);
          burst(x, y, 14, 6);
        });
        inner.appendChild(cut);
      }
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

  // 🎂 Pehli slide ke cutouts: tap karo to squish + 🎂 udte hain
  $$('.cut').forEach(btn => {
    $('img', btn).addEventListener('error', () => btn.remove());   // photo nahi mili to cutout hata do
    btn.addEventListener('click', () => {
      btn.classList.remove('squish'); void btn.offsetWidth; btn.classList.add('squish');
      const [x, y] = center(btn);
      sparkle(x, y - 40, 9, 70, 110, ['🎂', '🍰', '😂', '✨', '💖']);
      burst(x, y, 14, 6);
    });
  });

  // 🍔 "Badi hoti gayi" wala interactive card (config: timeline[].grow)
  function growCard(g) {
    const steps = g.steps?.length ? g.steps : ['Aur khilao! 🍔'];
    const max = steps.length;
    const card = el('div', 'grow-card anim', `
      <div class="grow-left">
        <div class="bubble"></div>
        <div class="grow-stage"><img src="${esc(g.src)}" alt="" draggable="false"></div>
      </div>
      <div class="grow-right">
        ${(g.meters || []).map(m => `<div class="meter"><span>${esc(m)}</span><i><b></b></i></div>`).join('')}
        <button class="btn grow-btn">${esc(g.btn || 'Aur khilao 🍔')}</button>
        <p class="tiny muted grow-hint">${esc(g.hint || 'tap karke dekho 👇')}</p>
      </div>`);
    const img = $('img', card), bubble = $('.bubble', card), btn = $('.grow-btn', card);
    const bars = $$('.meter b', card), tags = $$('.meter span', card);
    let k = 0;
    img.addEventListener('error', () => card.remove());
    const render = () => {
      const f = k / max;
      img.style.transform = `scale(${(1 + f * 0.55).toFixed(3)}, ${(1 + f * 0.3).toFixed(3)})`;
      bars.forEach((b, i) => { b.style.width = (i === bars.length - 1 ? Math.min(100, f * 160) : f * (i ? 75 : 100)) + '%'; });
      if (bars.length) tags[tags.length - 1].textContent = (g.meters[g.meters.length - 1] || '') + (f > 0.45 ? '  ∞' : '');
      bubble.textContent = k ? steps[Math.min(k, max) - 1] : (g.say || '');
      bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
      btn.textContent = k >= max ? 'Phir se chhoti karo 🔄' : (g.btn || 'Aur khilao 🍔');
    };
    btn.addEventListener('click', () => {
      k = k >= max ? 0 : k + 1;
      render();
      const [x, y] = center(img);
      sparkle(x, y - 30, 8, 80, 120, ['🍔', '🍩', '🍕', '❤️', '✨']);
      burst(x, y, k >= max ? 70 : 12, k >= max ? 10 : 5);
    });
    img.addEventListener('click', () => btn.click());
    render();
    return card;
  }

  // 🦠 "Covid bhagao" mini game: virus pe tap karo, vaccine lagao, sanitizer chhidko (config: timeline[].game)
  function gameCard(g) {
    const total = g.viruses || 8;
    const card = el('div', 'game-card anim', `
      <div class="bubble"></div>
      <p class="game-title">${esc(g.title || 'Covid bhagao! 🦠')}</p>
      <div class="game-stage">
        <button class="tool vax" aria-label="Vaccine lagao">💉</button>
        <button class="tool san" aria-label="Sanitizer">🧴</button>
        <div class="game-cuts">
          ${(g.cutouts || []).map((c, i) => `<button class="game-cut c${i}" aria-label="Nishu cutout, tap karo"><img src="${esc(c.src)}" alt="" draggable="false"></button>`).join('')}
        </div>
      </div>
      <div class="game-foot">
        <span class="game-count"></span>
        <button class="btn ghost game-reset" hidden>Phir se khelo 🔄</button>
      </div>
      <p class="tiny muted game-hint">${esc(g.hint || 'virus pe tap karo… ya seedha vaccine 💉 lagao')}</p>`);
    const stage = $('.game-stage', card), bubble = $('.bubble', card), count = $('.game-count', card), reset = $('.game-reset', card);
    const say = text => { bubble.textContent = text; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); };
    let left = 0;

    const render = () => { count.textContent = `Virus bhagaye: ${total - left} / ${total}`; };
    const pop = (v, big) => {
      if (!v.isConnected || v.classList.contains('gone')) return;
      v.classList.add('gone');
      left--;
      render();
      const [x, y] = center(v);
      sparkle(x, y, 4, 40, 60, ['💥', '✨', '😷', '💉']);
      if (big) burst(x, y, 10, 5);
      setTimeout(() => v.remove(), 380);
      if (left <= 0) win();
    };
    const spawn = () => {
      $$('.virus', stage).forEach(v => v.remove());
      left = total;
      for (let i = 0; i < total; i++) {
        const v = el('button', 'virus', '🦠');
        v.setAttribute('aria-label', 'Virus, tap karke bhagao');
        v.style.left = rand(4, 86).toFixed(1) + '%';
        v.style.top = rand(6, 48).toFixed(1) + '%';
        v.style.setProperty('--d', rand(2.2, 4.2).toFixed(2) + 's');
        v.style.setProperty('--delay', (-rand(0, 3)).toFixed(2) + 's');
        v.style.setProperty('--s', rand(1.7, 2.6).toFixed(2) + 'rem');
        v.addEventListener('click', () => { pop(v, true); if (left > 0) say(pick(g.hits || ['Pakda gaya! 🦠💥', 'Ek aur gaya 😎', 'Bhaag corona bhaag! 🏃'])); });
        stage.appendChild(v);
      }
      reset.hidden = true;
      render();
      say(g.say || 'Virus pe tap karo! 🦠');
    };
    const win = () => {
      say(g.win || 'Covid khatam! 🎉 Ab mask utaro, milna hai 🥰');
      reset.hidden = false;
      celebrate();
      $$('.game-cut', card).forEach(c => { c.classList.remove('squish'); void c.offsetWidth; c.classList.add('squish'); });
    };
    const pick = list => list[(Math.random() * list.length) | 0];
    const alive = () => $$('.virus:not(.gone)', stage);

    $('.vax', card).addEventListener('click', e => {
      const list = alive();
      if (!list.length) return say('Vaccine to lag chuki 💉 ab to bas pyaar bacha hai ❤️');
      say(g.vaxSay || 'Vaccine lag gayi! Sab virus bhaag gaye 💉🎉');
      list.forEach((v, i) => setTimeout(() => pop(v, false), i * 90));
    });
    $('.san', card).addEventListener('click', () => {
      const list = alive().sort(() => Math.random() - .5).slice(0, 3);
      if (!list.length) return say('Sab saaf hai! Ab haath dhone ki zaroorat nahi 🧼');
      say('Psssh! Sanitizer ne 3 virus maare 🧴💨');
      list.forEach(v => pop(v, false));
    });
    $$('.game-cut', card).forEach((c, i) => {
      $('img', c).addEventListener('error', () => c.remove());
      c.addEventListener('click', () => {
        c.classList.remove('squish'); void c.offsetWidth; c.classList.add('squish');
        const [x, y] = center(c);
        sparkle(x, y - 20, 6, 60, 90, ['😷', '❤️', '✨', '🎮']);
        const lines = g.cutouts[i]?.say;
        if (lines) say(lines);
      });
    });
    reset.addEventListener('click', spawn);
    spawn();
    return card;
  }

  // 😤➜🥰 "Roothna-Manana": chocolate / phool / sorry / hug se Nishu ko manao (config: timeline[].mana)
  function manaCard(m) {
    const levels = m.moods?.length ? m.moods : ['Gussa 😡', 'Naraaz 😒', 'Thodi maan gayi 🙂', 'Lagbhag maan gayi 😍'];
    const faces = ['😡', '😒', '🙂', '😍'];
    const acts = m.actions || [];
    const card = el('div', 'mana-card anim', `
      <div class="bubble"></div>
      <p class="game-title">${esc(m.title || 'Roothi Nishu ko manao 😤')}</p>
      <div class="mana-stage">
        <div class="mana-badge">😡</div>
        <div class="mana-char">
          <img class="rooth" src="${esc(m.rooth)}" alt="" draggable="false">
          ${m.happy ? `<img class="happy" src="${esc(m.happy)}" alt="" draggable="false">` : ''}
        </div>
      </div>
      <div class="mana-meter"><span class="mana-level"></span><i><b></b></i></div>
      <div class="mana-actions">
        ${acts.map((a, i) => `<button class="mana-btn" data-i="${i}"><span>${esc(a.icon)}</span>${esc(a.label)}</button>`).join('')}
        ${m.tease ? `<button class="mana-btn tease"><span>${esc(m.tease.icon || '😜')}</span>${esc(m.tease.label || 'Chhedo')}</button>` : ''}
      </div>
      <p class="tiny muted game-hint">${esc(m.hint || 'Nishu ke gusse ka meter 100% karo 👇')}</p>`);
    const bubble = $('.bubble', card), stage = $('.mana-stage', card), char = $('.mana-char', card);
    const badge = $('.mana-badge', card), level = $('.mana-level', card), bar = $('.mana-meter b', card);
    $('.rooth', card).addEventListener('error', () => card.remove());
    $('.happy', card)?.addEventListener('error', function () { this.remove(); });
    const say = text => { bubble.textContent = text; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); };
    const pick = list => list[(Math.random() * list.length) | 0];
    let mood = 0;

    const render = () => {
      const won = mood >= 100;
      const idx = Math.min(levels.length - 1, Math.floor((mood / 100) * levels.length));
      card.style.setProperty('--f', (mood / 100).toFixed(2));
      card.classList.toggle('won', won);
      card.classList.toggle('turned', mood < 25);
      level.textContent = won ? (m.winLabel || 'Maan gayi 🥰') : levels[idx];
      badge.textContent = won ? '🥰' : faces[Math.min(idx, faces.length - 1)];
      bar.style.width = mood + '%';
    };
    const fx = (icons, n = 7) => { const [x, y] = center(stage); sparkle(x, y - 10, n, 80, 110, icons); };

    $$('.mana-btn:not(.tease)', card).forEach(btn => btn.addEventListener('click', () => {
      const a = acts[+btn.dataset.i];
      if (mood >= 100) { say(m.after || 'Maan to gayi… ab aur kitna manaoge 🥰'); fx(['💖', '🥰'], 4); return; }
      mood = Math.min(100, mood + a.gain + Math.round(rand(-3, 4)));
      say(pick(a.lines || ['Hmm… 🙂']));
      fx([a.icon, '✨', '💖']);
      render();
      if (mood >= 100) {
        say(m.win || 'Maan gayi! 🥰 Ab ek tight hug do 🤗');
        celebrate();
        const happy = $('.happy', card);
        if (happy) { happy.classList.remove('squish'); void happy.offsetWidth; happy.classList.add('squish'); }
      }
    }));
    $('.tease', card)?.addEventListener('click', () => {
      mood = Math.max(0, mood - (m.tease.lose || 25));
      say(pick(m.tease.lines || ['Tune phir chheda?! 😤']));
      fx(['😤', '💢', '🙄'], 5);
      char.classList.remove('shake'); void char.offsetWidth; char.classList.add('shake');
      render();
    });
    char.addEventListener('click', () => {
      const lines = m.taps || {};
      const pool = mood >= 100 ? lines.happy : mood >= 50 ? lines.mid : lines.angry;
      say(pick(pool?.length ? pool : ['😤']));
      char.classList.remove('shake'); void char.offsetWidth; char.classList.add('shake');
    });
    say(m.say || 'Nishu rooth gayi hai 😤 Manao use!');
    render();
    return card;
  }

  // 🌸 "Smile Calendar": 12 mahine ke tiles, tap karo to us mahine ki photo khulti hai (config: timeline[].calendar)
  function calCard(c) {
    const months = c.months || [];
    const total = months.length;
    const card = el('div', 'cal-card anim', `
      <div class="bubble"></div>
      <p class="game-title">${esc(c.title || 'Smile Calendar 🙏')}</p>
      <div class="cal-stage">
        <span class="petal p1">🌸</span><span class="petal p2">✨</span><span class="petal p3">🌷</span><span class="petal p4">🌸</span><span class="petal p5">✨</span>
        <figure class="cal-frame empty">
          <div class="cal-photo"><div class="cal-empty"><span>🌸</span><small>kisi bhi mahine pe tap karo</small></div></div>
          <figcaption class="cal-cap"></figcaption>
        </figure>
        ${c.mascot?.src ? `<button class="cal-mascot" aria-label="${esc(C.name)}, tap karo"><img src="${esc(c.mascot.src)}" alt="" draggable="false"></button>` : ''}
      </div>
      <div class="cal-bar">
        <div class="cal-meter"><span class="cal-count"></span><i><b></b></i></div>
        <button class="btn cal-next">Agla mahina ➜</button>
      </div>
      <div class="cal-grid">
        ${months.map((m, i) => `<button class="cal-tile" data-i="${i}" aria-label="${esc(m.m)} ki photo kholo"><span class="cal-th"></span><span class="cal-m">${esc(m.m)}</span></button>`).join('')}
      </div>
      <p class="tiny muted game-hint">${esc(c.hint || 'saare 12 mahine kholo… har ek mein ek nayi smile hai 🙏')}</p>`);
    const bubble = $('.bubble', card), frame = $('.cal-frame', card), photoBox = $('.cal-photo', card), cap = $('.cal-cap', card);
    const count = $('.cal-count', card), bar = $('.cal-meter b', card), tiles = $$('.cal-tile', card), next = $('.cal-next', card);
    const mascot = $('.cal-mascot', card);
    $('img', mascot || card)?.addEventListener('error', () => mascot?.remove());
    const say = text => { bubble.textContent = text; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); };
    const pick = list => list[(Math.random() * list.length) | 0];
    const praise = c.praise?.length ? c.praise : ['Wah! 😍', 'Smile ne din bana diya ☀️'];
    const opened = new Set();
    let cur = -1;

    const render = () => {
      count.textContent = `${opened.size} / ${total} smiles mile 🙏`;
      bar.style.width = (total ? (opened.size / total) * 100 : 0) + '%';
    };
    const show = i => {
      const m = months[i];
      if (!m) return;
      cur = i;
      const first = !opened.has(i);
      opened.add(i);
      const ph = photo(m.src, { zoom: true, alt: `${C.name} ${m.m}` });
      if (m.pos && ph.firstChild) ph.firstChild.style.objectPosition = m.pos;
      photoBox.replaceChildren(ph);
      cap.textContent = `${m.m} · ${m.cap || ''}`;
      frame.classList.remove('empty', 'swap'); void frame.offsetWidth; frame.classList.add('swap');
      tiles.forEach((t, j) => t.classList.toggle('active', j === i));
      const tile = tiles[i];
      if (first) {
        tile.classList.add('open');
        const th = photo(m.src, { alt: '' });
        if (m.pos && th.firstChild) th.firstChild.style.objectPosition = m.pos;
        $('.cal-th', tile).replaceChildren(th);
      }
      render();
      const [x, y] = center(frame);
      sparkle(x, y, first ? 8 : 4, 90, 120, ['🌸', '✨', '🙏', '💖', '🌷']);
      if (first) say(pick(praise));
      if (opened.size === total && first) win();
      // phone pe: photo upar hai, isliye dikha do
      $('.cal-stage', card).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    const win = () => {
      card.classList.add('done');
      say(c.win || 'Saare 12 mahine! Tumhari smile mera sabse bada blessing 🙏❤️');
      celebrate();
      setTimeout(celebrate, 900);
    };
    tiles.forEach(t => t.addEventListener('click', () => show(+t.dataset.i)));
    next.addEventListener('click', () => {
      let i = months.findIndex((_, j) => j > cur && !opened.has(j));
      if (i < 0) i = months.findIndex((_, j) => !opened.has(j));
      if (i < 0) i = (cur + 1) % total;
      show(i);
    });
    mascot?.addEventListener('click', () => {
      mascot.classList.remove('squish'); void mascot.offsetWidth; mascot.classList.add('squish');
      say(pick(c.mascot.lines?.length ? c.mascot.lines : ['Hehe 😊']));
      const [x, y] = center(mascot);
      sparkle(x, y - 20, 6, 60, 90, ['🌸', '💖', '✨']);
    });
    say(c.say || 'Kisi bhi mahine pe tap karo ✨');
    render();
    return card;
  }

  // 💖 peeche udte hue dil (love-year slide ke liye)
  function lovePetals() {
    const box = el('div', 'love-hearts');
    box.setAttribute('aria-hidden', 'true');
    const list = ['💖', '💕', '💗', '❤️', '💘', '🌸'];
    for (let i = 0; i < 12; i++) {
      const h = el('span', '', list[i % list.length]);
      h.style.left = rand(2, 96).toFixed(1) + '%';
      h.style.setProperty('--fs', rand(1, 2.2).toFixed(2) + 'rem');
      h.style.setProperty('--d', rand(8, 15).toFixed(1) + 's');
      h.style.setProperty('--delay', (-rand(0, 14)).toFixed(1) + 's');
      h.style.setProperty('--x', rand(-30, 30).toFixed(0) + 'px');
      box.appendChild(h);
    }
    return box;
  }

  // 💖 "Love Level Up": dil ke shape ki photo, har level pe Nishu aur pyaari (config: timeline[].love)
  function loveCard(c) {
    const levels = c.levels || [];
    const N = levels.length;
    const card = el('div', 'love-card anim', `
      <div class="bubble"></div>
      <p class="game-title">${esc(c.title || 'Love Level Up ❤️')}</p>
      <div class="love-lv"><b class="love-lvnum"></b><span class="love-lvtitle"></span></div>
      <div class="love-stage">
        <button class="love-heart" aria-label="Dil pe tap karo, level up">
          <span class="heart-back"></span>
          <span class="heart-photo"></span>
          <span class="heart-shine"></span>
        </button>
        <p class="love-cap"></p>
        <button class="love-zoom" aria-label="Poori photo dekho">🔍 poori photo</button>
        ${c.couple?.src ? `<button class="love-couple" aria-label="Jodi, tap karo"><img src="${esc(c.couple.src)}" alt="" draggable="false"></button>` : ''}
      </div>
      <div class="cal-bar">
        <div class="cal-meter"><span class="cal-count"></span><i><b></b></i></div>
        <button class="btn cal-next love-up">Level Up ⬆️</button>
      </div>
      <div class="love-dots">${levels.map((_, i) => `<button class="love-dot" data-i="${i}" aria-label="Level ${i + 1}">♡</button>`).join('')}</div>
      <p class="tiny muted game-hint">${esc(c.hint || 'dil pe tap karo… har level pe Nishu aur pyaari lagti hai 💖')}</p>`);
    const bubble = $('.bubble', card), stage = $('.love-stage', card), heart = $('.love-heart', card), box = $('.heart-photo', card);
    const lvNum = $('.love-lvnum', card), lvTitle = $('.love-lvtitle', card), capEl = $('.love-cap', card);
    const count = $('.cal-count', card), bar = $('.cal-meter b', card), up = $('.love-up', card), dots = $$('.love-dot', card);
    const couple = $('.love-couple', card), zoom = $('.love-zoom', card);
    $('img', couple || card)?.addEventListener('error', () => couple?.remove());
    const say = text => { bubble.textContent = text; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); };
    const pick = list => list[(Math.random() * list.length) | 0];
    const praise = c.praise?.length ? c.praise : ['Aur pyaari 😍'];
    let lv = 0, maxed = false, reached = 0;

    const render = swap => {
      const L = levels[lv];
      if (!L) return;
      const ph = photo(L.src, { alt: `${C.name} level ${lv + 1}` });
      if (L.pos && ph.firstChild) ph.firstChild.style.objectPosition = L.pos;
      box.replaceChildren(ph);
      lvNum.textContent = `LV ${lv + 1}`;
      lvTitle.textContent = L.title || '';
      capEl.textContent = L.cap || '';
      const pct = Math.round(((lv + 1) / N) * 100);
      count.textContent = lv + 1 >= N ? 'Pyaar level: ∞ ♾️' : `Pyaar level: ${pct}% 💖`;
      bar.style.width = pct + '%';
      dots.forEach((d, i) => { d.textContent = i <= reached ? '♥' : '♡'; d.classList.toggle('on', i <= reached); d.classList.toggle('cur', i === lv); });
      card.classList.toggle('maxed', lv + 1 >= N);
      up.textContent = lv + 1 >= N ? 'Phir se Level 1 ↺' : 'Level Up ⬆️';
      if (swap) { heart.classList.remove('pop'); void heart.offsetWidth; heart.classList.add('pop'); }
    };
    const fx = (n = 8) => { const [x, y] = center(heart); sparkle(x, y, n, 100, 130, ['❤️', '💖', '💕', '💗', '😍']); };
    const go = i => { lv = Math.max(0, Math.min(N - 1, i)); reached = Math.max(reached, lv); render(true); fx(); };
    const levelUp = () => {
      if (lv + 1 >= N) {            // max ho chuka: wapas level 1
        lv = 0; maxed = false; render(true); fx(5);
        say(c.say || 'Chalo phir se! Dil pe tap karo 💖');
        return;
      }
      go(lv + 1);
      if (lv + 1 >= N) {
        maxed = true;
        say(c.win || 'MAX LEVEL! 🎉 Par pyaar ka level kabhi max nahi hota ♾️❤️');
        celebrate(); setTimeout(celebrate, 900);
      } else say(pick(praise));
    };
    heart.addEventListener('click', levelUp);
    up.addEventListener('click', levelUp);
    dots.forEach(d => d.addEventListener('click', () => { const i = +d.dataset.i; if (i <= reached) { go(i); say(levels[i].title || ''); } else say('Pehle pichhle level kholo 😉'); }));
    zoom.addEventListener('click', () => { const L = levels[lv]; if (!L) return; $('img', lightbox).src = L.src; lightbox.hidden = false; });
    couple?.addEventListener('click', () => {
      couple.classList.remove('squish'); void couple.offsetWidth; couple.classList.add('squish');
      say(pick(c.couple.lines?.length ? c.couple.lines : ['❤️']));
      const [x, y] = center(couple);
      sparkle(x, y - 20, 7, 60, 100, ['💖', '💕', '❤️']);
    });
    say(c.say || 'Dil pe tap karo 💖');
    render(false);
    return card;
  }

  // 🔋 "Aadat se Zaroorat": Aman ki battery low, Nishu = charger (config: timeline[].battery)
  function batteryCard(b) {
    const needs = b.needs || [];
    const card = el('div', 'bat-card anim', `
      <div class="bubble"></div>
      <p class="game-title">${esc(b.title || 'Aman ki battery 🔋')}</p>
      <div class="bat-stage">
        <div class="bat-phone">
          <div class="bat-top"><span>${esc(b.device || 'Aman 📱')}</span><span class="bat-warn">⚠️</span></div>
          <div class="bat-body"><div class="bat-fill"></div><div class="bat-pct">0%</div><div class="bat-bolt">⚡</div></div>
          <p class="bat-status"></p>
        </div>
        <div class="bat-cable"><span>🔌</span></div>
        <button class="bat-charger" aria-label="${esc(C.name)} charger, tap karo"><img src="${esc(b.charger)}" alt="" draggable="false"></button>
        ${b.couple ? `<img class="bat-couple" src="${esc(b.couple)}" alt="" draggable="false">` : ''}
      </div>
      <div class="bat-needs">${needs.map(n => `<span class="bat-chip"><i>Aadat</i><b>${esc(n.aadat)}</b><em>${esc(n.zaroorat)}</em></span>`).join('')}</div>
      <div class="bat-actions">
        <button class="btn bat-go">🔌 Charge karo</button>
        <button class="btn ghost bat-away">🚶 Door jao</button>
      </div>
      <p class="tiny muted game-hint">${esc(b.hint || 'Nishu (charger) pe tap karo… ya Door jao se battery gira ke dekho 😜')}</p>`);
    const bubble = $('.bubble', card), stage = $('.bat-stage', card), fill = $('.bat-fill', card), pctEl = $('.bat-pct', card);
    const status = $('.bat-status', card), warn = $('.bat-warn', card), chips = $$('.bat-chip', card);
    const goBtn = $('.bat-go', card), away = $('.bat-away', card), charger = $('.bat-charger', card);
    $('img', charger).addEventListener('error', () => charger.remove());
    $('.bat-couple', card)?.addEventListener('error', function () { this.remove(); });
    const say = text => { bubble.textContent = text; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); };
    const pick = list => list[(Math.random() * list.length) | 0];
    let pct = b.start ?? 9, won = false, shown = null;

    const level = v => v < 20 ? 'low' : v < 55 ? 'mid' : 'high';
    const render = () => {
      pct = Math.max(1, Math.min(100, pct));
      fill.style.height = pct + '%';
      pctEl.textContent = pct + '%';
      card.dataset.lv = level(pct);
      card.classList.toggle('full', pct >= 100);
      status.textContent = pct >= 100 ? (b.fullStatus || 'Full charge ✅ Ab sab theek hai') : pct < 20 ? (b.lowStatus || 'Low battery… Nishu miss kar rahi hai 🪫') : (b.midStatus || 'Charging… 🔌');
      warn.textContent = pct < 20 ? '⚠️' : pct >= 100 ? '💚' : '⚡';
      const done = Math.floor((pct / 100) * needs.length + (pct >= 100 ? 1 : 0));
      chips.forEach((c, i) => c.classList.toggle('on', i < Math.min(done, needs.length)));
      $('.bat-couple', card)?.classList.toggle('show', pct >= 100);
    };
    const fx = icons => { const [x, y] = center(charger.isConnected ? charger : stage); sparkle(x, y - 30, 6, 70, 100, icons); };

    const charge = () => {
      if (pct >= 100) { say(b.afterFull || 'Battery full hai… par tumhara saath kabhi full nahi hota 🥰'); fx(['💖', '🥰']); return; }
      pct = Math.min(100, pct + (b.step || 22) + Math.round(rand(-4, 6)));
      stage.classList.remove('zap'); void stage.offsetWidth; stage.classList.add('zap');
      render();
      if (pct >= 100) {
        won = true;
        say(b.win || 'Full charge! 🎉 Tum meri aadat nahi, meri zaroorat ho ❤️');
        celebrate(); setTimeout(celebrate, 900);
      } else say(pick(b.charging || ['Charging… 🔌', 'Thodi si jaan aayi ⚡']));
      fx(['⚡', '💖', '✨']);
    };
    const leave = () => {
      pct = Math.max(1, pct - (b.drain || 38));
      render();
      say(pick(b.leaving || ['Door jaate hi battery gir gayi 😭', 'Bina tumhare mera signal nahi 📵']));
      fx(['🪫', '😭', '💔']);
    };
    goBtn.addEventListener('click', charge);
    charger.addEventListener('click', () => { charger.classList.remove('squish'); void charger.offsetWidth; charger.classList.add('squish'); charge(); });
    away.addEventListener('click', leave);
    say(b.say || 'Meri battery low hai 🪫 Nishu se charge karo!');
    render();
    return card;
  }

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
