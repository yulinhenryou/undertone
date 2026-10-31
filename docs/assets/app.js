/* Undertone · interactive prototype
   A faithful, playable version of the final Apple Watch design.
   Screens reuse the same rendering vocabulary as the design system (watchkit.js). */
(function () {
  const I = WatchKit.icons;
  const A = '#FFB547', G = '#C7C7CC';
  const LEVELS = [
    { name: 'Listening', status: 'Mic off', band: '#8EC5F5', mix: 0, db: 'Off', li: 0.22 },
    { name: 'Undertone', status: 'Mic on · softly', band: '#FFB547', mix: 0.3, db: '≈ −18 dB', li: 0.34 },
    { name: 'Harmony', status: 'Mic on · clearly', band: '#FF8F5A', mix: 0.6, db: '≈ −8 dB', li: 0.38 },
    { name: 'Duet', status: 'Mic on · up front', band: '#F2557F', mix: 0.95, db: '≈ 0 dB, level', li: 0.42 }
  ];
  const TOP = LEVELS.length - 1;

  /* ---------------- state ---------------- */
  const S = {
    screen: 'arrival',      // arrival | face | seat | live | lost | ended
    level: 0, noise: false, solo: false, wrist: false,
    touch: false, large: false, sound: false,
    done: new Set()
  };

  /* ---------------- screen markup ---------------- */
  const nav = (t) => `<div class="wk-nav"><span style="color:${A}">${t}</span><span>${clock()}</span></div>`;
  const bar = (n) => `<div class="wk-bar">${[3, 2, 1].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div>`;
  const btn = (t, pri, top, act, dis) => `<button class="wk-btn ${pri ? 'pri' : ''}" style="top:${top}px" data-act="${act}" ${dis ? 'disabled' : ''}>${t}</button>`;
  const off = `<button class="wk-off" data-act="off"><span class="c">${I.micOff}</span><b>Turn off</b></button>`;
  const plat = (ic, t, s, top) => `<div class="wk-plat pop" style="top:${top}px">${ic}<span>${t}<small>${s}</small></span></div>`;
  function clock() { const d = new Date(); return (d.getHours() % 12 || 12) + ':' + String(d.getMinutes()).padStart(2, '0'); }

  function screenHTML() {
    const L = LEVELS[S.level];
    switch (S.screen) {
      case 'arrival':
        return `<div class="wk-b" style="top:24px"><div class="wk-app">${I.app}<span>UNDERTONE</span></div>
          <div class="wk-t" style="margin-top:8px">Room 7 is singing</div><div class="wk-p">Mic stays off. Turn the side wheel when you want to sing.</div></div>
          ${btn('Enter room', 1, 148, 'enter')}${btn('Not tonight', 0, 194, 'decline')}`;
      case 'face':
        return `<div class="wk-face"><div class="tm">${clock()}</div><div class="dt">${new Date().toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()} ${new Date().getDate()}</div>
          <button class="cp" data-act="complication">${I.app}<span>Room 7 · join</span></button></div>`;
      case 'seat':
        return nav('You: seat 6') + `<svg class="wk-map" width="150" height="120" viewBox="0 0 150 120">
          <rect x="34" y="4" width="82" height="6" rx="3" fill="#BF5AF2"/>
          <rect x="50" y="58" width="49" height="31" rx="6" fill="#1C1C1E" stroke="#2C2C2E"/>
          ${[[24, 48], [24, 70], [24, 91], [49, 106], [82, 106], [115, 70], [115, 48]].map(p => `<circle cx="${p[0] + 5}" cy="${p[1] + 5}" r="5" fill="#8E8E93"/>`).join('')}
          <circle cx="119.5" cy="96.5" r="7.5" fill="${A}"/><circle class="ping" cx="119.5" cy="96.5" r="12" fill="none" stroke="${A}" stroke-opacity=".5"/></svg>`
          + btn('I’m in seat 6', 1, 194, 'seat');
      case 'lost':
        return nav('Room 7') + `<div class="wk-b"><span style="color:${G}">${I.wifiOff}</span><div class="wk-t" style="margin-top:4px">Lost Room 7</div>
          <div class="wk-p">Your mic turned off.<br>It stays off.</div></div>` + btn('Reconnect', 1, 194, 'reconnect');
      case 'ended':
        return nav('Room 7') + `<div class="wk-b"><div class="wk-t" style="font-size:15px">Mic off</div>
          <div class="wk-p" style="font-size:14px">The song ended.<br>Your mic stays off.</div></div>` + btn('Next song', 1, 194, 'next');
    }
    /* live */
    let h = WatchKit.glow(S.level) + nav('Room 7') + bar(S.level) + `<div class="wk-b"><div class="wk-lv" key="${S.level}">${L.name}</div>
      <div class="wk-row ${S.level ? 'on' : ''}"><span style="color:${S.level ? A : G}">${S.level ? I.spkOn : I.spkOff}</span>${L.status}</div>`;
    if (S.level === 0) {
      if (S.solo) h += `<div class="wk-row"><span style="color:${G}">${I.note}</span>This song is solo</div><div class="wk-sub" style="margin-top:12px">Join the next open song</div></div>`;
      else if (S.touch) h += `<div class="wk-sub" style="padding-left:0;margin-top:12px">Or turn the wheel.</div></div>` + btn('Join softly', 1, 194, 'up');
      else h += `<div class="wk-hint"><span>${I.crown}</span>Turn wheel to join</div><div class="wk-sub">Turn down to stop.</div></div>`;
      if (S.noise && !S.solo) h += plat(I.warn, 'Room noise is high', 'You’ll join softly', S.touch ? 120 : 140);
      if (S.wrist) h += plat(`<span style="color:${G}">${I.moon}</span>`, 'Screen asleep', 'Raise your wrist', S.touch ? 120 : 140);
      return h;
    }
    h += `</div>`;
    const pt = S.touch ? 96 : 117;
    if (S.wrist) h += plat(`<span style="color:${G}">${I.moon}</span>`, 'Screen asleep', 'Turning down works', pt);
    else if (S.noise) h += plat(I.warn, 'Room noise is high', 'Staying soft', pt);
    if (S.touch) {
      const capped = S.level === TOP || (S.noise && S.level >= 1);
      h += `<div class="wk-tc" style="top:150px"><button data-act="down">−&nbsp; Softer</button><button data-act="up" ${capped ? 'disabled' : ''}>+&nbsp; Louder</button></div>`;
    }
    return h + off;
  }

  /* ---------------- watch element ---------------- */
  const watchEl = document.getElementById('watch');
  let lastBand = null;
  function band() {
    if (S.screen === 'live') return LEVELS[S.level].band;
    return '#CFC9DC';
  }
  function draw() {
    const b = band();
    if (b !== lastBand) {           // rebuild frame only when band colour changes
      watchEl.dataset.band = b; WatchKit.render(watchEl); lastBand = b;
      watchEl.querySelector('.wk-clip').insertAdjacentHTML('afterend', '<div class="crown-hit" title="Drag or scroll the side wheel"></div>');
      bindCrown();
    }
    const scr = watchEl.querySelector('.wk-scr');
    scr.classList.toggle('lg', S.large);
    scr.classList.toggle('asleep', S.wrist && S.screen === 'live');
    scr.innerHTML = screenHTML();
    const live = S.screen === 'live';
    document.documentElement.style.setProperty('--lv', live ? LEVELS[S.level].band : '#8C8794');
    document.documentElement.style.setProperty('--li', live ? LEVELS[S.level].li : 0);
    syncPanel();
    Audio.update();
  }

  /* ---------------- explanations ---------------- */
  const why = document.getElementById('why');
  function say(title, body, kind) {
    why.className = 'why show ' + (kind || '');
    why.innerHTML = `<b>${title}</b><span>${body}</span>`;
    clearTimeout(say.t);
  }
  function nudge(cls) { watchEl.classList.remove('shake', 'bump'); void watchEl.offsetWidth; watchEl.classList.add(cls); haptic(cls === 'shake' ? [12, 40, 12] : 8); }
  function haptic(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { } }
  function tick() { const c = watchEl.querySelector('.crown-hit'); if (c) { c.classList.remove('tk'); void c.offsetWidth; c.classList.add('tk'); } haptic(6); }

  /* ---------------- rules ---------------- */
  function up() {
    tick();
    if (S.screen !== 'live') return say('The wheel only works in the room', 'Enter the room and confirm your seat first. Until then your mic stays off.');
    if (S.wrist) { S.wrist = false; draw(); return say('Screen woke up', 'With your wrist down, turning up only wakes the screen. A sleeve can’t raise your level.'); }
    if (S.solo) { nudge('shake'); return say('Joining is closed', 'The lead chose to keep this song solo. Your watch tells you why, and you can join the next open song.', 'warn'); }
    if (S.level === TOP) { nudge('bump'); return say('Duet is the top', 'You’re singing beside the lead, as loud as her and never louder.'); }
    if (S.noise && S.level >= 1) { nudge('shake'); return say('Held at Undertone', 'The room is loud, so you stay soft and never cover the lead. Turn down any time.', 'warn'); }
    S.level++; draw(); if (S.level === 1) mark('join'); if (S.level === TOP) mark('duet');
    const msg = [null,
      ['You joined, softly', 'Your voice slips into the chorus, about 18 dB under the lead. Turn down to step back out.'],
      ['You’re in Harmony', 'Clearer now, about 8 dB under the lead. One more turn takes you up front.'],
      ['Duet: up front', 'Side by side with the lead, at the same level and never above. You got here one step at a time.']][S.level];
    say(msg[0], msg[1], 'good');
  }
  function down() {
    tick();
    if (S.screen !== 'live') return;
    if (S.level === 0) { nudge('bump'); return say('You’re already listening', 'Mic off. Listening still counts as taking part.'); }
    S.level--; draw();
    if (S.level === 0) mark('off');
    say(S.level === 0 ? 'Back to listening' : 'A little softer', S.level === 0 ? 'Mic off. Every step is reversible, and stopping is never blocked.' : 'Back to ' + LEVELS[S.level].name + '. Every step can be undone.');
  }
  const actions = {
    up, down,
    enter() { S.screen = 'seat'; draw(); say('Mic stays off', 'Entering the room never turns your mic on. Confirm your seat so the room knows where you are.'); },
    decline() { S.screen = 'face'; draw(); say('Not tonight', 'No problem. A small shortcut stays on your watch face if you change your mind.'); },
    complication() { S.screen = 'arrival'; draw(); say('Changed your mind', 'The shortcut brings you straight back. Entering still keeps your mic off.'); },
    seat() { S.screen = 'live'; S.level = 0; draw(); mark('enter'); say('You’re listening', 'Mic off. Turn the side wheel (or scroll, drag, or press ↑) to join.', 'good'); },
    off() { const was = S.level; S.level = 0; draw(); if (was) mark('off'); say('Turned off', 'One tap back to listening. The fastest way out is always on screen.'); },
    reconnect() { S.screen = 'live'; S.level = 0; draw(); say('Reconnected, mic still off', 'The connection can come back by itself. Your mic doesn’t: you choose when to join again.'); },
    next() { S.screen = 'live'; S.level = 0; S.solo = false; restartSong(); draw(); say('New song, mic off', 'Every song starts with your mic off. Join again whenever you like.'); },
  };

  /* scenario controls */
  const scen = {
    noise() { S.noise = !S.noise; if (S.noise && S.screen === 'live' && S.level >= 2) { const was = LEVELS[S.level].name; S.level = 1; draw(); mark('noise'); return say('The room turned you down', 'It got loud, so ' + was + ' dropped to Undertone. The room can turn you down, never up.', 'warn'); }
      draw(); if (S.noise) { mark('noise'); say('The room is loud', 'You can join, but you’ll be held at Undertone so you never cover the lead.', 'warn'); } else say('The room quietened', 'Your level stays where it is. If you want to go higher, that’s your choice.'); },
    solo() { if (S.screen !== 'live') { S.screen = 'live'; } S.solo = !S.solo; if (S.solo) S.level = 0; draw(); if (S.solo) { mark('solo'); say('This song is solo', 'The lead set it before singing. Joining closes, your mic goes off, and the watch says why. No one is turned away in public.', 'warn'); } else say('The song is open again', 'Joining is open. Your mic stays off until you turn the wheel.'); },
    lost() { S.screen = 'lost'; S.level = 0; S.wrist = false; draw(); say('Connection lost', 'Your mic switches off and stays off. Nothing reopens a microphone by itself.', 'warn'); },
    wrist() { if (S.screen !== 'live') return say('Try this in the room', 'Enter the room first.'); S.wrist = !S.wrist; draw(); if (S.wrist) say('Wrist down', 'The screen sleeps. Turning up only wakes it, so a sleeve can’t raise your level. Turning down still works.'); },
    end() { S.screen = 'ended'; S.level = 0; S.wrist = false; draw(); say('The song ended', 'Your mic turns off at the end of every song.'); },
    touch() { S.touch = !S.touch; draw(); say(S.touch ? 'Touch version on' : 'Touch version off', S.touch ? 'For anyone who can’t use the side wheel: Join softly, Softer and Louder buttons, same rules.' : 'Back to the default screen: one word, one wheel.'); },
    large() { S.large = !S.large; draw(); say(S.large ? 'Larger text' : 'Default text', S.large ? 'The layout reflows for larger text sizes.' : 'Default watchOS sizes.'); },
    sound() { S.sound = !S.sound; Audio.toggle(S.sound); syncPanel(); if (S.sound) say('Sound on', 'An original song plays. Listen for your voice, the warm harmony line, coming in as you turn the wheel.'); },
    restart() { Object.assign(S, { screen: 'arrival', level: 0, noise: false, solo: false, wrist: false }); S.done.clear(); draw(); say('Room 7 is singing', 'Your watch has just noticed a song starting. Tap “Enter room”.'); }
  };

  /* ---------------- panel ---------------- */
  function syncPanel() {
    document.querySelectorAll('[data-scen]').forEach(b => {
      const k = b.dataset.scen; const on = { noise: S.noise, solo: S.solo, wrist: S.wrist, touch: S.touch, large: S.large, sound: S.sound, lost: S.screen === 'lost', end: S.screen === 'ended' }[k];
      b.classList.toggle('on', !!on); b.setAttribute('aria-pressed', !!on);
    });
    const L = LEVELS[S.level], live = S.screen === 'live';
    document.getElementById('youDb').textContent = live ? L.db : 'Off';
    document.getElementById('lvName').textContent = live ? L.name : ({ arrival: 'Not in the room', face: 'Watch face', seat: 'Confirming seat', lost: 'Disconnected', ended: 'Between songs' })[S.screen];
    document.getElementById('lvStatus').textContent = live ? L.status : 'Mic off';
    document.querySelectorAll('.ladder i').forEach((el, i) => el.classList.toggle('on', live && i < S.level));
    /* the room's own screen: seat glow and song status */
    const dot = document.getElementById('seatDot'), glow = document.getElementById('seatGlow');
    if (dot) {
      const lit = live && S.level > 0;
      dot.setAttribute('fill', lit ? L.band : (live ? '#C9C4CF' : '#6F6A76'));
      glow.setAttribute('r', lit ? [0, 13, 19, 26][S.level] : 0);
      glow.setAttribute('fill', L.band);
    }
    const tag = document.getElementById('rsTag');
    if (tag) {
      const t = S.screen === 'ended' ? ['Between songs', ''] : S.solo ? ['Solo · joining closed', 'warn'] : S.noise ? ['Room is loud', 'warn'] : (live && S.level ? [S.level === TOP ? 'You’re up front' : 'You’re in the chorus', 'amb'] : ['Open song', '']);
      tag.textContent = t[0]; tag.className = 'rs-tag ' + t[1];
      document.querySelector('.rs').classList.toggle('quiet', S.screen === 'ended');
    }
  }
  const goals = ['enter', 'join', 'duet', 'noise', 'off'];
  function mark(g) {
    if (S.done.has(g)) return; S.done.add(g);
    const li = document.querySelector(`[data-goal="${g}"]`); if (li) li.classList.add('done');
    if (goals.every(x => S.done.has(x))) setTimeout(() => say('That’s Undertone', 'You went from listening to up front one step at a time, the room kept you safe, and you left in one move. Try a solo song or the touch version next.', 'good'), 900);
  }

  /* ---------------- input ---------------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (a && !a.disabled) { actions[a.dataset.act](); return; }
    const s = e.target.closest('[data-scen]'); if (s) scen[s.dataset.scen]();
  });
  let acc = 0, lastWheel = 0;
  watchEl.addEventListener('wheel', e => {
    e.preventDefault(); const now = performance.now(); if (now - lastWheel > 300) acc = 0; lastWheel = now;
    acc += e.deltaY; if (acc <= -60) { acc = 0; up(); } else if (acc >= 60) { acc = 0; down(); }
  }, { passive: false });
  function bindCrown() {
    const c = watchEl.querySelector('.crown-hit'); let y0 = null;
    c.addEventListener('pointerdown', e => { y0 = e.clientY; c.setPointerCapture(e.pointerId); c.classList.add('grab'); });
    c.addEventListener('pointermove', e => { if (y0 === null) return; const d = e.clientY - y0; if (d <= -28) { y0 = e.clientY; up(); } else if (d >= 28) { y0 = e.clientY; down(); } });
    const end = () => { y0 = null; c.classList.remove('grab'); };
    c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
  }
  /* swipe on the screen for touch devices */
  let ty = null;
  watchEl.addEventListener('touchstart', e => { if (e.target.closest('button')) return; ty = e.touches[0].clientY; }, { passive: true });
  watchEl.addEventListener('touchmove', e => { if (ty === null) return; const d = e.touches[0].clientY - ty; if (Math.abs(d) > 34) { e.preventDefault(); d < 0 ? up() : down(); ty = e.touches[0].clientY; } }, { passive: false });
  watchEl.addEventListener('touchend', () => ty = null);
  document.addEventListener('keydown', e => {
    const t = e.target instanceof Element ? e.target : document.body;
    if (t.closest('input,textarea')) return;
    if ((e.key === 'Enter' || e.key === ' ') && t.closest('button,a')) return;   // let focused controls handle their own keys
    const k = e.key.toLowerCase();
    if (k === 'arrowup') { e.preventDefault(); up(); } else if (k === 'arrowdown') { e.preventDefault(); down(); }
    else if (k === 'n') scen.noise(); else if (k === 's') scen.solo(); else if (k === 'l') scen.lost(); else if (k === 'w') scen.wrist(); else if (k === 'e') scen.end(); else if (k === 't') scen.touch();
    else if (k === 'enter') { const b = watchEl.querySelector('.wk-btn.pri,[data-act="complication"]'); b && b.click(); }
  });

  /* ---------------- live mix visual ---------------- */
  const cv = document.getElementById('mix'), cx = cv.getContext('2d');
  const lanes = [
    { k: 'lead', label: 'Lead singer', col: '#8A6CF0' },
    { k: 'chorus', label: 'Friends', col: '#ADA7B4' },
    { k: 'you', label: 'You', col: '#F29A2E' },
    { k: 'noise', label: 'Room noise', col: '#F2557F' }
  ];
  const cur = { lead: 1, chorus: .55, you: 0, noise: .08 };
  function target() {
    const live = S.screen === 'live', playing = S.screen !== 'ended';
    return {
      lead: playing ? 1 : 0.05,
      chorus: playing ? (S.solo ? 0.05 : 0.55) : 0.05,
      you: live ? LEVELS[S.level].mix : 0,
      noise: S.noise ? 0.85 : 0.1
    };
  }
  function resize() { const r = cv.getBoundingClientRect(); cv.width = r.width * devicePixelRatio; cv.height = r.height * devicePixelRatio; }
  window.addEventListener('resize', resize); resize();
  /* karaoke lyrics on the room screen, on the same 92 bpm grid as the synthesised song */
  const LYR = ['Lanterns on the water', 'light the long way home,', 'every voice is softer', 'when it isn’t alone.'];
  const STEP = 60 / 92 / 2 * 1000, LINE = 16;           // one line = two bars of eighth notes
  let songT0 = performance.now(), lastLine = -1;
  const lnA = document.getElementById('lnA'), lnAlit = document.getElementById('lnAlit'), lnB = document.getElementById('lnB');
  function lyrics(now) {
    if (!lnA) return;
    if (S.screen === 'ended') { if (lastLine !== -2) { lnA.textContent = lnAlit.textContent = '— song ended —'; lnAlit.parentNode.style.setProperty('--p', '0%'); lnB.textContent = 'Next song in a moment'; lastLine = -2; } return; }
    const steps = (now - songT0) / STEP, li = Math.floor(steps / LINE) % LYR.length, p = (steps % LINE) / (LINE - 3);
    if (li !== lastLine) { lnA.textContent = lnAlit.textContent = LYR[li]; lnB.textContent = LYR[(li + 1) % LYR.length]; lastLine = li; }
    lnAlit.parentNode.style.setProperty('--p', Math.min(100, p * 100).toFixed(1) + '%');
  }
  function restartSong() { songT0 = performance.now(); lastLine = -1; Audio.sync && Audio.sync(); }
  function frame(t) {
    lyrics(t);
    const T = target(); for (const k in cur) cur[k] += (T[k] - cur[k]) * 0.08;
    const W = cv.width, H = cv.height, dpr = devicePixelRatio; cx.clearRect(0, 0, W, H);
    const lh = H / lanes.length, bars = 30, bw = (W - 104 * dpr) / bars;
    lanes.forEach((ln, li) => {
      const y0 = li * lh, mid = y0 + lh / 2, g = cur[ln.k];
      cx.fillStyle = '#7E7885'; cx.font = `${500} ${12 * dpr}px Geist, Inter`; cx.textBaseline = 'middle'; cx.fillText(ln.label, 0, mid);
      for (let i = 0; i < bars; i++) {
        const ph = t / (ln.k === 'noise' ? 90 : 260) + i * (ln.k === 'noise' ? 1.7 : 0.55) + li * 2;
        let a = ln.k === 'noise' ? (0.35 + 0.65 * Math.abs(Math.sin(ph * 3.1) * Math.cos(ph * 1.3))) : (0.45 + 0.55 * Math.abs(Math.sin(ph) * Math.sin(ph * 0.37 + 1)));
        const h = Math.max(2 * dpr, a * g * (lh * 0.78));
        const x = 104 * dpr + i * bw;
        cx.fillStyle = ln.col; cx.globalAlpha = g < 0.02 ? 0.25 : 0.9;
        roundRect(x + bw * 0.18, mid - h / 2, bw * 0.64, h, Math.min(bw * 0.32, h / 2)); cx.fill(); cx.globalAlpha = 1;
      }
    });
    requestAnimationFrame(frame);
  }
  function roundRect(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
  requestAnimationFrame(frame);

  /* ---------------- sound: an original synthesised song ---------------- */
  const Audio = (function () {
    let ac, master, gLead, gChorus, gYou, gNoise, timer, step = 0;
    const bpm = 92, spb = 60 / bpm / 2;          // eighth notes
    const prog = [[60, 64, 67], [55, 59, 62, 67], [57, 60, 64], [53, 57, 60, 65]]; // C G Am F (original voicing)
    const mel = [76, 74, 72, 74, 76, 76, 76, null, 74, 74, 74, null, 76, 79, 79, null,
      76, 74, 72, 74, 76, 76, 76, 76, 74, 74, 76, 74, 72, null, null, null];   // original melody
    const f = m => 440 * Math.pow(2, (m - 69) / 12);
    function init() {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = 0.0; master.connect(ac.destination);
      const comp = ac.createDynamicsCompressor(); comp.connect(master);
      gLead = ac.createGain(); gChorus = ac.createGain(); gYou = ac.createGain(); gNoise = ac.createGain();
      [gLead, gChorus, gYou, gNoise].forEach(g => g.connect(comp));
      // room noise: filtered noise loop
      const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = buf.getChannelData(0);
      let b = 0; for (let i = 0; i < d.length; i++) { b = 0.97 * b + 0.03 * (Math.random() * 2 - 1); d[i] = b * 3; }
      const n = ac.createBufferSource(); n.buffer = buf; n.loop = true;
      const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.6;
      n.connect(bp).connect(gNoise); n.start();
    }
    function voice(dest, freq, t, dur, type, vol, vib) {
      const o = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter();
      o.type = type; o.frequency.value = freq; lp.type = 'lowpass'; lp.frequency.value = type === 'sawtooth' ? 1400 : 3000;
      if (vib) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = 5.2; lg.gain.value = freq * 0.012; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + dur + 0.1); }
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.04); g.gain.setTargetAtTime(0, t + dur * 0.8, 0.08);
      o.connect(lp).connect(g).connect(dest); o.start(t); o.stop(t + dur + 0.4);
    }
    function sched() {
      const t = ac.currentTime + 0.12;
      if (S.screen === 'ended') { step++; return; }
      const bar = Math.floor(step / 8) % 4, n = mel[step % 32];
      if (step % 8 === 0) prog[bar].forEach(m => voice(gChorus, f(m), t, spb * 8, 'sawtooth', 0.05, false));
      if (step % 4 === 0) voice(gChorus, f(prog[bar][0] - 24), t, spb * 3.5, 'triangle', 0.18, false);
      if (n) {
        voice(gLead, f(n), t, spb * 1.6, 'triangle', 0.22, true);
        voice(gYou, f(n - (bar === 1 ? 3 : 4)), t, spb * 1.6, 'sawtooth', 0.16, true);  // your harmony line
      }
      step++;
    }
    function update() {
      if (!ac) return; const T = target(), now = ac.currentTime;
      gLead.gain.setTargetAtTime(T.lead, now, 0.15); gChorus.gain.setTargetAtTime(T.chorus * 1.2, now, 0.15);
      gYou.gain.setTargetAtTime(T.you * 1.0, now, 0.12); gNoise.gain.setTargetAtTime(S.noise ? 0.45 : 0.02, now, 0.3);
    }
    function sync() { step = Math.floor((performance.now() - songT0) / (spb * 1000)); }
    function toggle(on) {
      if (on) { if (!ac) init(); ac.resume(); sync(); master.gain.setTargetAtTime(0.55, ac.currentTime, 0.2); update(); if (!timer) timer = setInterval(sched, spb * 1000); }
      else if (ac) { master.gain.setTargetAtTime(0, ac.currentTime, 0.15); clearInterval(timer); timer = null; }
    }
    return { toggle, update, sync };
  })();

  /* boot (after watchkit has injected its styles) */
  function boot() { WatchKit.init(); lastBand = null; draw(); say('Room 7 is singing', 'Your watch has noticed a song starting. Tap “Enter room” on the watch to begin.'); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  setInterval(() => { if (S.screen !== 'live') return; const n = watchEl.querySelector('.wk-nav span:last-child'); if (n) n.textContent = clock(); }, 20000);
})();
