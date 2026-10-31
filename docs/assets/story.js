/* Undertone · story page.
   Web: gentle reveals, a karaoke tagline that "sings" once.  Print (?print): one section per 1600 × 900 page. */
(function () {
  const print = /[?&]print\b/.test(location.search);
  if (print) document.body.classList.add('print');

  /* weight as volume: letters get heavier across the word, like turning up */
  document.querySelectorAll('.vol').forEach(el => {
    const a = +el.dataset.from || 200, b = +el.dataset.to || 900, ch = [...el.textContent], n = ch.length;
    el.innerHTML = ch.map((c, i) => '<span style="font-weight:' + Math.round(a + (b - a) * (n > 1 ? i / (n - 1) : 0)) + '">' + c + '</span>').join('');
  });

  /* karaoke lines: lit letters, unlit letters, a ball on the current one */
  function karaoke(el, fill) {
    const ch = [...el.dataset.text], letters = ch.filter(c => c.trim()).length, lit = Math.round(fill * letters);
    let k = 0;
    el.innerHTML = ch.map(c => {
      if (c === ' ') return ' ';
      k++;
      const on = k <= lit, at = k === lit && el.dataset.ball !== 'no';
      return '<span class="c' + (on ? ' on' : '') + (at ? ' at' : '') + '">' + c + (at ? '<i class="ball"></i>' : '') + '</span>';
    }).join('');
  }
  const kys = [...document.querySelectorAll('.ky')];
  kys.forEach(el => { el.dataset.text = el.textContent; karaoke(el, +el.dataset.fill || 0); });

  if (print) {
    /* the film becomes its poster, each page gets a number */
    const v = document.getElementById('film');
    if (v) { const img = document.createElement('img'); img.src = v.getAttribute('poster'); img.alt = ''; v.replaceWith(img); }
    document.querySelectorAll('.sec').forEach((s, i, all) => {
      const n = document.createElement('span'); n.className = 'pn';
      n.textContent = 'Undertone · ' + String(i + 1).padStart(2, '0') + ' / ' + String(all.length).padStart(2, '0');
      s.appendChild(n);
    });
    return;
  }

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* respect reduced motion: the film waits to be played */
  const film = document.getElementById('film');
  if (film && calm) { film.removeAttribute('autoplay'); film.pause(); film.controls = true; }

  /* the cover tagline sings itself once */
  const tag = document.querySelector('.s-cover .ky');
  if (tag && !calm) {
    const target = +tag.dataset.fill || .5, t0 = performance.now() + 600;
    karaoke(tag, 0);
    (function step(now) {
      const p = Math.min(1, Math.max(0, (now - t0) / 2600));
      karaoke(tag, p * target);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /* reveals */
  const els = document.querySelectorAll('.rv');
  if (calm || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in-view')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } }), { threshold: .15 });
  els.forEach(e => io.observe(e));
})();
