"""Undertone build: one command regenerates every exported file.

    pip install playwright && python -m playwright install chromium
    python src/build.py            # everything
    python src/build.py pdf        # just the PDF
    python src/build.py screens    # just design/screens/*.png
    python src/build.py images     # og image, README images
    python src/build.py film       # the 34-second film (needs ffmpeg)
    python src/build.py poster     # just the film's poster frame

Outputs
  docs/undertone-case-study.pdf                        (the story, one section per page)
  design/screens/*.png, design/screens/history/*.png   (2x, 396 x 484)
  docs/assets/img/og.png                               (1200 x 630 social card)
  docs/assets/img/readme-*.png                         (README images)
  docs/assets/film/undertone.mp4, poster.jpg, docs/assets/img/readme-film.gif
"""
import asyncio, pathlib, shutil, subprocess, sys, tempfile
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / 'docs'
IMG = DOCS / 'assets' / 'img'

async def ready(pg):
    await pg.wait_for_load_state('networkidle')
    await pg.evaluate('document.fonts.ready')
    await pg.wait_for_timeout(500)

async def pdf(b):
    """The story page in print mode: one section per 1600 x 900 page."""
    pg = await b.new_page(viewport={'width': 1600, 'height': 900})
    await pg.goto((DOCS / 'index.html').as_uri() + '?print'); await ready(pg)
    bad = await pg.evaluate("""()=>{const o=[];document.querySelectorAll('.sec').forEach((s,i)=>{const r=s.getBoundingClientRect();
      if(Math.abs(r.height-900)>1)o.push((i+1)+': page is '+Math.round(r.height)+'px tall');
      s.querySelectorAll('h1,h2,h3,p,li,td').forEach(e=>{const q=e.getBoundingClientRect();
      if(q.width&&(q.right>r.right-40||q.bottom>r.bottom-30))o.push((i+1)+': '+e.textContent.trim().slice(0,40))})});return o}""")
    if bad: print('check these pages:', *bad, sep='\n  ')
    out = DOCS / 'undertone-case-study.pdf'
    await pg.pdf(path=str(out), width='1600px', height='900px', print_background=True, prefer_css_page_size=True)
    print('wrote', out.relative_to(ROOT))

async def screens(b):
    pg = await b.new_page(viewport={'width': 1200, 'height': 800}, device_scale_factor=2)
    await pg.goto((ROOT / 'src' / 'templates' / 'screens.html').as_uri()); await ready(pg)
    for el in await pg.query_selector_all('[data-s]'):
        s = await el.get_attribute('data-s')
        name = s.replace('old_', '').replace('touchListen', 'touch-listening')
        d = ROOT / 'design' / 'screens' / ('history' if s.startswith('old_') else '')
        d.mkdir(parents=True, exist_ok=True)
        await el.screenshot(path=str(d / f'{name}.png'), omit_background=True)
    print('wrote design/screens/')

async def images(b):
    IMG.mkdir(parents=True, exist_ok=True)
    pg = await b.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
    await pg.goto((ROOT / 'src' / 'templates' / 'og.html').as_uri()); await ready(pg)
    await pg.locator('.og').screenshot(path=str(IMG / 'og.png'))
    pg2 = await b.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=2)
    await pg2.goto((ROOT / 'src' / 'templates' / 'og.html').as_uri()); await ready(pg2)
    await pg2.locator('.og').screenshot(path=str(IMG / 'readme-hero.png'))
    # the prototype at Duet, for the README
    pg3 = await b.new_page(viewport={'width': 1440, 'height': 900}, device_scale_factor=2)
    await pg3.goto((DOCS / 'play' / 'index.html').as_uri()); await ready(pg3)
    for sel in ['[data-act=enter]', '[data-act=seat]']:
        await pg3.click(sel); await pg3.wait_for_timeout(350)
    for _ in range(3):
        await pg3.keyboard.press('ArrowUp'); await pg3.wait_for_timeout(350)
    await pg3.wait_for_timeout(900)
    await pg3.screenshot(path=str(IMG / 'readme-prototype.png'))
    # four story pages as a 2 x 2 preview
    pg4 = await b.new_page(viewport={'width': 1600, 'height': 900})
    await pg4.goto((DOCS / 'index.html').as_uri() + '?print'); await ready(pg4)
    await pg4.evaluate("""()=>{const keep=[2,3,7,11];const pages=[...document.querySelectorAll('.sec')];
      const g=document.createElement('div');g.id='grid';g.style.cssText='display:grid;grid-template-columns:800px 800px;gap:20px;padding:20px;background:#E6E1D8;width:1660px';
      keep.forEach(i=>{const w=document.createElement('div');w.style.cssText='width:800px;height:450px;overflow:hidden;border-radius:12px';
        const c=pages[i].cloneNode(true);c.style.cssText='width:1600px;transform:scale(.5);transform-origin:0 0';c.querySelectorAll('.rv').forEach(e=>e.classList.add('in-view'));w.appendChild(c);g.appendChild(w)});
      document.querySelector('main').innerHTML='';document.querySelector('main').appendChild(g)}""")
    await pg4.wait_for_timeout(400)
    await pg4.locator('#grid').screenshot(path=str(IMG / 'readme-story.png'))
    print('wrote docs/assets/img/og.png and README images')

async def poster(b, path):
    pg = await b.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=1.5)
    await pg.goto((ROOT / 'src' / 'templates' / 'film.html').as_uri() + '?poster'); await ready(pg)
    await pg.evaluate('render(21.4)')
    await pg.locator('#f').screenshot(path=str(path))

async def film(b, fps=30, length=34.0):
    """Render the film frame by frame (render(t) is deterministic), then encode with ffmpeg."""
    out = DOCS / 'assets' / 'film'; out.mkdir(parents=True, exist_ok=True)
    tmp = pathlib.Path(tempfile.mkdtemp())
    pg = await b.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=1.5)
    await pg.goto((ROOT / 'src' / 'templates' / 'film.html').as_uri()); await ready(pg)
    f = pg.locator('#f')
    n = int(length * fps)
    for i in range(n):
        await pg.evaluate(f'render({i / fps})')
        await f.screenshot(path=str(tmp / f'f{i:05d}.png'))
    await poster(b, tmp / 'poster.png')
    ff = ['ffmpeg', '-y', '-loglevel', 'error']
    subprocess.run(ff + ['-framerate', str(fps), '-i', str(tmp / 'f%05d.png'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
                         '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(out / 'undertone.mp4')], check=True)
    subprocess.run(ff + ['-i', str(tmp / 'poster.png'), '-q:v', '3', str(out / 'poster.jpg')], check=True)
    # README loop: the turning section, small and light
    subprocess.run(ff + ['-ss', '8.6', '-t', '17.6', '-i', str(out / 'undertone.mp4'), '-vf',
                         'fps=12,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4',
                         str(IMG / 'readme-film.gif')], check=True)
    shutil.rmtree(tmp)
    print('wrote docs/assets/film/undertone.mp4, poster.jpg and docs/assets/img/readme-film.gif')

async def main(what):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        if what in ('all', 'pdf'): await pdf(b)
        if what in ('all', 'screens'): await screens(b)
        if what in ('all', 'images'): await images(b)
        if what in ('all', 'film'): await film(b)
        if what == 'poster':
            tmp = pathlib.Path(tempfile.mkdtemp()); await poster(b, tmp / 'p.png')
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(tmp / 'p.png'), '-q:v', '3', str(DOCS / 'assets' / 'film' / 'poster.jpg')], check=True)
        await b.close()

if __name__ == '__main__':
    asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else 'all'))
