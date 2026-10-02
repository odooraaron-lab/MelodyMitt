"""
Paints a cover image for every journal post: public/journal/<slug>.jpg (1200 x 675).

Each picture is generated from the post's slug, so it is unique and never changes, and the scene matches the place
the post is about (lake and ranges for Queenstown, the Taranaki cone for New Plymouth, Mauao for Tauranga ...).

  python3 scripts/journal-images.py          # paint any posts that don't have a picture yet
  python3 scripts/journal-images.py --all    # repaint everything

To use a real photo instead, save it over public/journal/<slug>.jpg (landscape, about 1200 x 675) and it is used
everywhere: lists, the post page and when the post is shared. Needs: pip install pillow numpy
"""
import glob, hashlib, os, re, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "journal")
W, H = 1200, 675

# ---------- helpers ----------
def mix(a, b, t):
    return tuple(float(a[i]) + (float(b[i]) - float(a[i])) * t for i in range(3))

def vgrad(top, bottom, h, w, power=1.0):
    t = np.linspace(0, 1, h)[:, None, None] ** power
    return np.repeat(np.array(top, float)[None, None] * (1 - t) + np.array(bottom, float)[None, None] * t, w, axis=1)

def noise1d(rng, n, octaves=6, rough=0.5, freq=1.4, ridged=False):
    x = np.linspace(0, 1, n)
    y = np.zeros(n); a = 1.0; f = freq; total = 0
    for _ in range(octaves):
        s = np.sin(2 * np.pi * f * x + rng.uniform(0, 2 * np.pi))
        y += a * (1 - 2 * np.abs(s) if ridged else s); total += a
        a *= rough; f *= 2.07
    return y / total

def ridgeline(rng, n, rough=0.55):
    """Midpoint displacement: natural, irregular peaks. Returns values roughly in -1..1."""
    size = 1
    while size + 1 < n: size *= 2
    pts = np.zeros(size + 1); pts[0], pts[-1] = rng.uniform(-0.4, 0.4, 2)
    step, amp = size, 1.0
    while step > 1:
        half = step // 2
        for i in range(half, size, step):
            pts[i] = (pts[i - half] + pts[i + half]) / 2 + rng.uniform(-amp, amp)
        step, amp = half, amp * rough
    out = np.interp(np.linspace(0, size, n), np.arange(size + 1), pts)
    return out / (np.abs(out).max() + 1e-6)

def noise2d(rng, h, w, octaves=5, rough=0.55, base=3):
    out = np.zeros((h, w)); a = 1.0; tot = 0; n = base
    for _ in range(octaves):
        g = rng.uniform(0, 255, (n + 1, int(n * w / h) + 1))
        im = Image.fromarray(np.uint8(g)).resize((w, h), Image.BICUBIC)
        out += a * (np.asarray(im, float) / 127.5 - 1); tot += a; a *= rough; n *= 2
    return out / tot

def tree(d, x, y, r, rng, greens):
    """A leafy tree made of many dabs rather than one circle."""
    d.line([(x, y + r * 0.2), (x + rng.uniform(-4, 4), y + r * 1.1)], fill=(58, 46, 36), width=max(2, int(r * 0.12)))
    for _ in range(int(18 + r * 0.8)):
        ox, oy = rng.normal(0, r * 0.45), rng.normal(-r * 0.1, r * 0.35)
        rr = rng.uniform(r * 0.12, r * 0.3); g = greens[int(rng.integers(len(greens)))]
        shade = 1.12 if ox < 0 and oy < 0 else 0.9
        d.ellipse([x + ox - rr, y + oy - rr, x + ox + rr, y + oy + rr], fill=tuple(int(min(255, v * shade)) for v in g))

def fill_below(img, ys, color, shade=0.35, depth_px=None):
    h, w, _ = img.shape
    rows = np.arange(h)[:, None]
    mask = rows >= ys[None, :]
    d = np.clip((rows - ys[None, :]) / (depth_px or h * 0.45), 0, 1)
    col = np.array(color, float)[None, None] * (1 - shade * d[..., None])
    img[mask] = col[mask]
    return mask

def glow(img, cx, cy, r, color, strength):
    h, w, _ = img.shape
    yy, xx = np.mgrid[0:h, 0:w]
    g = np.exp(-(((xx - cx) ** 2 + (yy - cy) ** 2) / (r * r)))[..., None]
    img[:] = img * (1 - g * strength) + np.array(color, float)[None, None] * g * strength

def clouds(img, rng, n, ymax, color=(255, 255, 255), alpha=0.35):
    h, w, _ = img.shape
    layer = Image.new("L", (w, h), 0); d = ImageDraw.Draw(layer)
    for _ in range(n):
        cx, cy = rng.uniform(-100, w + 100), rng.uniform(h * 0.03, ymax)
        rw, rh = rng.uniform(80, 260), rng.uniform(14, 40)
        for k in range(int(rng.integers(3, 7))):
            ox, oy = rng.uniform(-rw, rw), rng.uniform(-rh, rh * 0.5)
            d.ellipse([cx + ox - rw * 0.6, cy + oy - rh, cx + ox + rw * 0.6, cy + oy + rh], fill=int(255 * alpha))
    m = np.asarray(layer.filter(ImageFilter.GaussianBlur(18)), float)[..., None] / 255
    img[:] = img * (1 - m) + np.array(color, float)[None, None] * m

def reflect(img, hz, rng, water, strength=0.55, ripple=3.0):
    h, w, _ = img.shape
    span = h - hz
    src = img[max(0, hz - span):hz][::-1].copy()
    out = np.empty((span, w, 3))
    for i in range(span):
        row = src[min(i, len(src) - 1)]
        shift = int(np.sin(i * 0.45 + rng.uniform(0, 0.4)) * ripple * (1 + i / 40))
        out[i] = np.roll(row, shift, axis=0)
    t = np.linspace(0.15, 0.85, span)[:, None, None]
    out = out * (1 - strength) * (1 - t * 0.5) + np.array(water, float)[None, None] * (strength + t * 0.3)
    # sparkle streaks
    for _ in range(int(span / 6)):
        y = int(rng.uniform(0, span)); x = int(rng.uniform(0, w)); ln = int(rng.uniform(20, 120))
        out[y:y + 1, x:x + ln] = out[y:y + 1, x:x + ln] * 0.75 + 255 * 0.25
    img[hz:] = np.clip(out, 0, 255)

TIMES = {
    "dawn": dict(top=(118, 146, 186), bottom=(246, 204, 168), sun=(255, 214, 170), sy=0.55),
    "day": dict(top=(86, 136, 194), bottom=(206, 224, 236), sun=(255, 248, 228), sy=0.18),
    "golden": dict(top=(112, 150, 194), bottom=(250, 222, 176), sun=(255, 222, 160), sy=0.42),
    "dusk": dict(top=(56, 62, 104), bottom=(238, 152, 112), sun=(255, 176, 120), sy=0.52),
    "overcast": dict(top=(146, 156, 168), bottom=(214, 214, 210), sun=(240, 236, 226), sy=0.3),
}

def sky(rng, time=None, hz=None):
    name = time or rng.choice(list(TIMES))
    t = TIMES[name]
    img = vgrad(t["top"], t["bottom"], H, W, power=0.9)
    sx = rng.uniform(0.15, 0.85) * W
    glow(img, sx, t["sy"] * H, 260, t["sun"], 0.55 if name != "overcast" else 0.25)
    glow(img, sx, t["sy"] * H, 40, (255, 250, 240), 0.8 if name in ("day", "golden") else 0.5)
    clouds(img, rng, int(rng.integers(3, 9)), (hz or H * 0.5) * 0.85, alpha=0.45 if name == "overcast" else 0.3)
    return img, t, name

def haze_layers(img, rng, hz, haze, specs):
    """specs: list of (height_above_hz, amp, color, haze_t, rough, ridged, snow)"""
    for up, amp, col, ht, rough, ridged, snow in specs:
        ys = hz - up + amp * (ridgeline(rng, W, rough) * 1.4 if ridged else noise1d(rng, W, rough=rough))
        c = mix(col, haze, ht)
        fill_below(img, ys, c, shade=0.25)
        if snow:
            line = hz - up - amp * 0.25
            depth = np.clip((line - ys) * 0.6, 0, 46) * (0.6 + 0.4 * (0.5 + 0.5 * noise1d(rng, W, octaves=5, rough=0.7, freq=14)))
            rows = np.arange(H)[:, None]
            m = (rows >= ys[None, :]) & (rows < ys[None, :] + depth[None, :])
            img[m] = img[m] * 0.25 + np.array(mix((248, 248, 250), haze, ht * 0.5)) * 0.75

# ---------- scenes ----------
def scene_queenstown(rng):
    hz = int(H * rng.uniform(0.6, 0.66))
    img, t, name = sky(rng, hz=hz); hb = t["bottom"]
    haze_layers(img, rng, hz, hb, [
        (int(rng.uniform(250, 300)), 105, (88, 98, 118), 0.55, 0.62, True, True),
        (int(rng.uniform(180, 220)), 80, (70, 82, 98), 0.38, 0.6, True, True),
        (int(rng.uniform(100, 140)), 45, (58, 66, 70), 0.25, 0.55, True, False),
        (int(rng.uniform(30, 60)), 20, (92, 86, 64), 0.12, 0.5, False, False),
    ])
    reflect(img, hz, rng, (46, 92, 118), strength=0.5)
    ys = H - 40 + 18 * noise1d(rng, W, rough=0.7, freq=3)
    fill_below(img, ys, (176, 146, 86), shade=0.5, depth_px=60)
    return img

def scene_new_plymouth(rng):
    hz = int(H * rng.uniform(0.64, 0.7))
    img, t, name = sky(rng, hz=hz); hb = t["bottom"]
    cx = W * rng.uniform(0.35, 0.65); peak = H * rng.uniform(0.12, 0.2)
    x = np.arange(W)
    dd = np.clip(np.abs(x - cx) / (W * 0.5), 0, 1)
    prof = peak + (hz - peak + 50) * (1 - (1 - dd) ** 2.1) + 3 * noise1d(rng, W, freq=10, rough=0.6)
    rows = np.arange(H)[:, None]
    m = fill_below(img, prof, mix((72, 84, 100), hb, 0.3), shade=0.15)
    theta = np.arctan2((x - cx)[None, :], (rows - peak + 1).clip(1))
    gully = 0.07 * np.sin(theta * 70 + 2 * noise2d(rng, H, W, octaves=3)) * (rows > prof[None, :])
    lit = np.where(x < cx, 1.08, 0.9)[None, :]
    img[m] = (img * (1 + gully[..., None]) * lit[..., None])[m]
    snowline = peak + (hz - peak) * rng.uniform(0.28, 0.4) + 34 * np.abs(noise1d(rng, W, freq=22, rough=0.75))
    m = (rows >= prof[None, :]) & (rows < snowline[None, :])
    snow = np.array((246, 246, 250))[None, None] * np.where(x < cx, 1.0, 0.86)[None, :, None]
    img[m] = (img * 0.1 + snow * 0.9)[m]
    haze_layers(img, rng, hz, hb, [(40, 14, (78, 108, 70), 0.25, 0.5, False, False)])
    if rng.random() < 0.55:  # black-sand surf coast
        shore = int(H * 0.88)
        ys = np.full(W, float(hz)); fill_below(img, ys, (58, 84, 96), shade=0.35, depth_px=shore - hz)
        for k in range(7):
            y = int(hz + (shore - hz) * (k + 1) / 8); xs = int(rng.uniform(0, W * 0.4)); ln = int(rng.uniform(W * 0.3, W * 0.9))
            img[y:y + 3, xs:xs + ln] = img[y:y + 3, xs:xs + ln] * 0.4 + 235 * 0.6
        fill_below(img, shore + 10 * noise1d(rng, W, freq=2), (44, 42, 42), shade=0.3, depth_px=H - shore)
        if rng.random() < 0.6:  # Wind Wand
            wx = int(W * rng.uniform(0.7, 0.9)); pts = [(wx + 26 * (1 - (i / 40)) ** 2, H - 4 - i * (H * 0.62) / 40) for i in range(41)]
            pil = Image.fromarray(np.uint8(np.clip(img, 0, 255))); ImageDraw.Draw(pil).line(pts, fill=(196, 44, 38), width=5)
            img[:] = np.asarray(pil, float)
    else:  # dairy country
        haze_layers(img, rng, H, hb, [(H - hz - 30, 10, (88, 128, 64), 0.05, 0.5, False, False)])
    return img

def scene_tauranga(rng):
    hz = int(H * rng.uniform(0.52, 0.58))
    img, t, name = sky(rng, time=rng.choice(["day", "golden", "dawn", "dusk"]), hz=hz); hb = t["bottom"]
    haze_layers(img, rng, hz, hb, [(18, 6, (90, 110, 120), 0.6, 0.5, False, False)])
    cx = W * (rng.uniform(0.62, 0.82) if rng.random() < 0.6 else rng.uniform(0.18, 0.38)); r = W * rng.uniform(0.13, 0.18); hgt = H * rng.uniform(0.22, 0.28)
    x = np.arange(W); u = np.clip(1 - ((x - cx) / r) ** 2, 0, 1)
    dd = np.clip(np.abs(x - cx) / r, 0, 1)
    prof = np.where(dd < 1, hz + 6 - hgt * (1 - dd ** 2) ** 0.85 + 6 * noise1d(rng, W, freq=12, rough=0.6), H + 10)
    m = fill_below(img, prof, mix((56, 82, 58), hb, 0.22), shade=0.15, depth_px=hgt)
    lit = np.where(x < cx, 1.1, 0.88)[None, :, None]
    img[:hz] = np.where(m[:hz, :, None], img[:hz] * lit, img[:hz])
    reflect(img, hz, rng, (52, 112, 140), strength=0.62, ripple=2)
    shore = int(H * rng.uniform(0.74, 0.8))
    for k in range(4):
        y = shore - 6 - k * 9; xs = int(rng.uniform(0, W * 0.3)); ln = int(rng.uniform(W * 0.4, W))
        img[y:y + 3, xs:xs + ln] = img[y:y + 3, xs:xs + ln] * 0.35 + 245 * 0.65
    fill_below(img, shore + 8 * noise1d(rng, W, freq=2), (222, 200, 156), shade=0.3, depth_px=H - shore)
    if rng.random() < 0.6:  # pōhutukawa in a corner
        pil = Image.fromarray(np.uint8(np.clip(img, 0, 255))); d = ImageDraw.Draw(pil)
        side = 0 if rng.random() < 0.5 else W; sg = 1 if side == 0 else -1
        for k in range(3):  # trunk and branches growing from the beach
            bx = side + sg * rng.uniform(60, 200)
            d.line([(side + sg * 90, H), (bx, rng.uniform(150, 260))], fill=(70, 52, 40), width=int(rng.uniform(10, 18)))
        for _ in range(70):
            x0 = side + sg * rng.uniform(0, 320); y0 = rng.uniform(40, 300)
            rr = rng.uniform(20, 50); d.ellipse([x0 - rr, y0 - rr * 0.8, x0 + rr, y0 + rr * 0.8], fill=(46, 70, 44))
        for _ in range(170):
            x0 = side + sg * rng.uniform(0, 300); y0 = rng.uniform(50, 290)
            rr = rng.uniform(3, 8); d.ellipse([x0 - rr, y0 - rr, x0 + rr, y0 + rr], fill=(196, 36, 40))
        img[:] = np.asarray(pil, float)
    return img

def scene_hamilton(rng):
    hz = int(H * rng.uniform(0.46, 0.52))
    img, t, name = sky(rng, time=rng.choice(["dawn", "overcast", "day", "golden"]), hz=hz); hb = t["bottom"]
    haze_layers(img, rng, hz, hb, [(40, 16, (84, 104, 96), 0.55, 0.5, False, False), (14, 6, (86, 116, 70), 0.35, 0.5, False, False)])
    rows = np.arange(H)[:, None].astype(float)
    fields = vgrad(mix((112, 148, 82), hb, 0.3), (70, 112, 52), H - hz, W)
    stripes = 0.06 * np.sin((rows[hz:] - hz) ** 0.7 * 3.1 + noise1d(rng, W, freq=1)[None, :] * 3)[..., None]
    img[hz:] = fields * (1 + stripes)
    # river: a band that narrows towards the horizon
    pil = Image.fromarray(np.uint8(np.clip(img, 0, 255))); d = ImageDraw.Draw(pil)
    a = rng.uniform(0, 6); left, right = [], []
    for i in range(61):
        tt = i / 60; y = hz + (H - hz) * tt ** 1.6
        cxr = W * (0.5 + 0.28 * np.sin(a + tt * 5) * tt); half = 6 + 190 * tt ** 1.7
        left.append((cxr - half, y)); right.append((cxr + half, y))
    river = mix(t["bottom"], (150, 170, 176), 0.5)
    d.polygon(left + right[::-1], fill=tuple(int(v) for v in river))
    for _ in range(int(rng.integers(10, 18))):  # willows
        tt = rng.uniform(0.15, 0.9); y = hz + (H - hz) * tt ** 1.6
        x = W * rng.uniform(0.05, 0.95); rr = 10 + 70 * tt ** 1.5
        tree(d, x, y - rr * 0.6, rr, rng, [(64, 92, 52), (86, 116, 62), (110, 132, 74)])
    img[:] = np.asarray(pil.filter(ImageFilter.GaussianBlur(1.2)), float)
    mist = np.exp(-((rows - hz) / 40) ** 2)[..., None] * 0.55
    img[:] = img * (1 - mist) + np.array((236, 236, 232)) * mist
    return img

def scene_auckland(rng):
    hz = int(H * rng.uniform(0.58, 0.64))
    img, t, name = sky(rng, hz=hz); hb = t["bottom"]
    if rng.random() < 0.6:  # Rangitoto, a broad low cone on the horizon
        cx = W * rng.uniform(0.1, 0.9); x = np.arange(W)
        prof = hz - 70 + (np.abs(x - cx) / (W * 0.32)) ** 1.25 * 75
        fill_below(img, np.minimum(prof, hz + 5), mix((70, 86, 92), hb, 0.5), shade=0.1)
    pil = Image.fromarray(np.uint8(np.clip(img, 0, 255))); d = ImageDraw.Draw(pil)
    city = tuple(int(v) for v in mix((58, 66, 82), hb, 0.35))
    x0 = W * rng.uniform(0.15, 0.4); x1 = x0 + W * rng.uniform(0.35, 0.5); x = x0
    while x < x1:
        bw = rng.uniform(18, 46); bh = rng.uniform(30, 150) * (1 - abs((x - (x0 + x1) / 2) / (x1 - x0)))
        d.rectangle([x, hz - bh, x + bw, hz + 2], fill=city)
        d.rectangle([x, hz - bh, x + bw * 0.35, hz + 2], fill=tuple(int(min(255, v * 1.22)) for v in city))
        x += bw + rng.uniform(0, 4)
    tx = rng.uniform(x0 + 40, x1 - 40); top = hz - rng.uniform(300, 360)
    d.rectangle([tx - 7, top + 60, tx + 7, hz], fill=city)  # Sky Tower shaft
    d.ellipse([tx - 24, top + 70, tx + 24, top + 104], fill=city)  # pod
    d.rectangle([tx - 2, top, tx + 2, top + 70], fill=city)  # mast
    if name == "dusk":
        for _ in range(240):
            wx = rng.uniform(x0, x1); wy = rng.uniform(hz - 120, hz - 4)
            if np.asarray(pil)[int(wy), int(wx)].sum() < sum(city) + 30:
                d.rectangle([wx, wy, wx + 2, wy + 2], fill=(250, 214, 150))
    img[:] = np.asarray(pil, float)
    reflect(img, hz, rng, (44, 82, 112), strength=0.5)
    return img

def scene_christchurch(rng):
    hz = int(H * rng.uniform(0.56, 0.62))
    img, t, name = sky(rng, hz=hz); hb = t["bottom"]
    specs = []
    if rng.random() < 0.6:
        specs.append((int(rng.uniform(150, 190)), 40, (110, 118, 136), 0.65, 0.62, True, True))  # Southern Alps
    specs += [(int(rng.uniform(70, 110)), 34, (112, 104, 78), 0.3, 0.45, False, False), (16, 6, (96, 110, 70), 0.2, 0.5, False, False)]
    haze_layers(img, rng, hz, hb, specs)
    reflect(img, hz, rng, (70, 100, 116), strength=0.55, ripple=2)
    ys = H - 70 + 30 * noise1d(rng, W, rough=0.5, freq=1.2)
    fill_below(img, ys, (196, 180, 140), shade=0.45, depth_px=90)
    return img

def scene_whangarei(rng):
    hz = int(H * rng.uniform(0.58, 0.64))
    img, t, name = sky(rng, hz=hz); hb = t["bottom"]
    haze_layers(img, rng, hz, hb, [(60, 22, (74, 96, 92), 0.55, 0.5, False, False)])
    # Mt Manaia: a ridge with sharp pinnacles
    x = np.arange(W); cx = W * rng.uniform(0.3, 0.7)
    base = hz - 120 * np.exp(-((x - cx) / (W * 0.25)) ** 2) + 6 * noise1d(rng, W, freq=10)
    for k in range(int(rng.integers(4, 7))):
        px = cx + rng.uniform(-W * 0.12, W * 0.12); ph = rng.uniform(60, 150); pw = rng.uniform(14, 34)
        base = np.minimum(base, hz - 110 - ph * np.clip(1 - np.abs(x - px) / pw, 0, 1) ** 0.8)
    fill_below(img, base, mix((44, 70, 56), hb, 0.18), shade=0.25, depth_px=200)
    reflect(img, hz, rng, (46, 98, 104), strength=0.55)
    if rng.random() < 0.7:  # yachts
        pil = Image.fromarray(np.uint8(np.clip(img, 0, 255))); d = ImageDraw.Draw(pil)
        for _ in range(int(rng.integers(1, 4))):
            bx = rng.uniform(80, W - 80); by = hz + rng.uniform(30, 110); s = rng.uniform(0.6, 1.2)
            d.polygon([(bx, by), (bx, by - 60 * s), (bx + 34 * s, by)], fill=(244, 240, 232))
            d.rectangle([bx - 22 * s, by, bx + 40 * s, by + 6 * s], fill=(40, 44, 52))
        img[:] = np.asarray(pil, float)
    ys = H - 50 + 40 * noise1d(rng, W, freq=2, rough=0.6)
    fill_below(img, ys, (40, 62, 44), shade=0.4, depth_px=80)
    return img

def scene_art_history(rng):
    img, t, name = sky(rng, time=rng.choice(["golden", "dusk", "day"]), hz=H * 0.4)
    pil = Image.fromarray(np.uint8(np.clip(img, 0, 255))); d = ImageDraw.Draw(pil)
    stone = (218, 202, 174); shadow = (150, 132, 108); dark = (78, 66, 56)
    n = int(rng.choice([6, 8])); left, right = W * 0.12, W * 0.88; top = H * rng.uniform(0.2, 0.28)
    ent = top + 70; base = H * 0.86
    d.polygon([(left - 20, top + 10), ((left + right) / 2, top - 110), (right + 20, top + 10)], fill=stone)
    d.polygon([(left + 30, top), ((left + right) / 2, top - 82), (right - 30, top)], fill=shadow)
    d.rectangle([left - 20, top + 10, right + 20, ent], fill=stone)
    d.rectangle([left - 20, ent - 12, right + 20, ent], fill=shadow)
    d.rectangle([left, ent, right, base], fill=dark)
    cw = (right - left) / (n * 1.7)
    for i in range(n):
        cx = left + cw / 2 + i * (right - left - cw) / (n - 1)
        d.rectangle([cx - cw / 2, ent, cx + cw / 2, base], fill=stone)
        for f in range(4):
            fx = cx - cw / 2 + cw * (0.15 + f * 0.22); d.line([(fx, ent + 10), (fx, base - 10)], fill=shadow, width=2)
        d.rectangle([cx + cw * 0.15, ent, cx + cw / 2, base], fill=tuple(int(v * 0.86) for v in stone))
        d.rectangle([cx - cw * 0.7, ent, cx + cw * 0.7, ent + 14], fill=stone)
    for s in range(4):
        d.rectangle([left - 30 - s * 18, base + s * 22, right + 30 + s * 18, base + (s + 1) * 22], fill=tuple(int(v) for v in mix(stone, shadow, s * 0.18)))
    img = np.asarray(pil, float)
    glow(img, W * 0.2, H * 0.3, 500, (255, 226, 170), 0.18)
    return img

def scene_living(rng):
    walls = [(232, 224, 210), (214, 202, 184), (204, 210, 200), (196, 176, 156), (222, 214, 196)]
    wall = walls[int(rng.integers(len(walls)))]
    img = vgrad(mix(wall, (255, 255, 255), 0.12), mix(wall, (0, 0, 0), 0.12), H, W)
    floor = int(H * 0.8)
    img[floor:] = vgrad((156, 116, 82), (118, 84, 58), H - floor, W)
    for x in range(0, W, 140):
        img[floor:, x + int(rng.integers(0, 40)):x + 2 + int(rng.integers(0, 40))] *= 0.85
    glow(img, W * rng.uniform(0.2, 0.8), H * 0.2, 520, (255, 246, 226), 0.35)
    pil = Image.fromarray(np.uint8(np.clip(img, 0, 255))); d = ImageDraw.Draw(pil)
    # sideboard
    sx0, sx1 = W * rng.uniform(0.2, 0.3), W * rng.uniform(0.7, 0.8); sy = H * 0.6
    wood = [(92, 64, 44), (150, 110, 74), (60, 58, 56), (210, 196, 176)][int(rng.integers(4))]
    d.rectangle([sx0, sy, sx1, floor + 4], fill=wood)
    d.rectangle([sx0, sy, sx1, sy + 8], fill=tuple(int(v * 0.85) for v in wood))
    d.line([((sx0 + sx1) / 2, sy + 16), ((sx0 + sx1) / 2, floor - 6)], fill=tuple(int(v * 0.7) for v in wood), width=2)
    # framed painting above, filled with a little landscape
    fw = (sx1 - sx0) * rng.uniform(0.55, 0.75); fh = fw * rng.uniform(0.62, 0.75); fx = (sx0 + sx1) / 2 - fw / 2; fy = sy - 50 - fh
    d.rectangle([fx + 10, fy + 14, fx + fw + 10, fy + fh + 14], fill=tuple(int(v * 0.8) for v in wall))  # shadow
    frame = [(36, 34, 32), (176, 136, 92), (240, 236, 228)][int(rng.integers(3))]
    d.rectangle([fx, fy, fx + fw, fy + fh], fill=frame)
    m = 12; d.rectangle([fx + m, fy + m, fx + fw - m, fy + fh - m], fill=(246, 242, 234))
    inner = Image.fromarray(np.uint8(np.clip(SCENES[rng.choice(["queenstown", "tauranga", "hamilton", "whangarei"])](rng), 0, 255)))
    iw, ih = int(fw - 2 * m - 40), int(fh - 2 * m - 40)
    pil.paste(inner.resize((iw, ih)), (int(fx + m + 20), int(fy + m + 20)))
    d = ImageDraw.Draw(pil)
    # vase and plant
    vx = sx1 - rng.uniform(60, 120); d.ellipse([vx - 26, sy - 64, vx + 26, sy + 2], fill=[(226, 220, 208), (92, 104, 96), (178, 104, 74)][int(rng.integers(3))])
    for _ in range(14):
        ang = rng.uniform(-2.6, -0.5); ln = rng.uniform(50, 120); ex, ey = vx + np.cos(ang) * ln, sy - 60 + np.sin(ang) * ln
        d.line([(vx, sy - 58), (ex, ey)], fill=(70, 92, 58), width=3); d.ellipse([ex - 12, ey - 6, ex + 12, ey + 6], fill=(84, 112, 66))
    return np.asarray(pil, float)

SCENES = {
    "queenstown": scene_queenstown, "new-plymouth": scene_new_plymouth, "tauranga": scene_tauranga,
    "hamilton": scene_hamilton, "auckland": scene_auckland, "christchurch": scene_christchurch,
    "whangarei": scene_whangarei, "art-history": scene_art_history, "living-with-art": scene_living,
}

def texture(img, rng):
    n = noise2d(rng, H, W)
    return img * (1 + 0.11 * n[..., None])

def paint(img, rng):
    """Repaint the scene as an oil painting: an underpainting, then layers of brush strokes from broad to fine,
    each following the shapes in the picture."""
    src = np.clip(img, 0, 255)
    base = Image.fromarray(np.uint8(src))
    blur = np.asarray(base.filter(ImageFilter.GaussianBlur(3)), float)
    lum = blur.mean(axis=2)
    gy, gx = np.gradient(lum)
    mag = np.hypot(gx, gy)
    edge = mag / (np.percentile(mag, 98) + 1e-6)
    canvas = base.filter(ImageFilter.GaussianBlur(7)).convert("RGBA")
    for size, step, alpha, detail in [(26, 12, 190, 0.0), (13, 7, 205, 0.35), (6, 4, 225, 0.55)]:
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
        ys, xs = np.mgrid[0:H:step, 0:W:step]
        pts = np.stack([xs.ravel() + rng.uniform(-step / 2, step / 2, xs.size), ys.ravel() + rng.uniform(-step / 2, step / 2, ys.size)], 1)
        rng.shuffle(pts)
        for x, y in pts:
            xi, yi = int(min(W - 1, max(0, x))), int(min(H - 1, max(0, y)))
            if detail and rng.random() > detail + edge[yi, xi]:  # fine strokes go where there is detail
                continue
            c = src[yi, xi] * rng.uniform(0.93, 1.07) + rng.normal(0, 9, 3)
            if mag[yi, xi] > 1.5:
                ang = np.arctan2(gy[yi, xi], gx[yi, xi]) + np.pi / 2  # along the edge
            else:
                ang = rng.normal(0, 0.35)  # loose, mostly horizontal strokes in open areas
            ln = size * rng.uniform(1.4, 2.8)
            dx, dy = np.cos(ang) * ln / 2, np.sin(ang) * ln / 2
            col = tuple(int(v) for v in np.clip(c, 0, 255)) + (alpha,)
            d.line([(x - dx, y - dy), (x + dx, y + dy)], fill=col, width=max(2, int(size * rng.uniform(0.45, 0.7))))
        canvas = Image.alpha_composite(canvas, layer)
    return np.asarray(canvas.convert("RGB"), float)

def finish(img, rng):
    a = paint(texture(img, rng), rng)
    # impasto: a faint emboss so the strokes catch the light
    lum = Image.fromarray(np.uint8(np.clip(a.mean(axis=2), 0, 255)))
    emb = np.asarray(lum.filter(ImageFilter.EMBOSS), float) - 128
    a += emb[..., None] * 0.18
    # canvas weave and grain
    yy, xx = np.mgrid[0:H, 0:W]
    weave = (np.sin(xx * np.pi / 2.2) * np.sin(yy * np.pi / 2.2)) * 3.0
    a += weave[..., None]
    a += np.random.default_rng(int(rng.integers(1 << 30))).normal(0, 2.4, a.shape)
    yy, xx = np.mgrid[0:H, 0:W]
    v = 1 - 0.22 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 2
    a *= v[..., None]
    return Image.fromarray(np.uint8(np.clip(a, 0, 255)))

def posts():
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, "content", "archive", "*.ts"))) + [os.path.join(ROOT, "content", "posts.ts")]:
        s = open(f, encoding="utf-8").read()
        for m in re.finditer(r'\n    slug: "([^"]+)",\s*\n(?:.*\n)*?    category: "([^"]+)"', s):
            out.append((m.group(1), m.group(2)))
    return out

def main():
    redo = "--all" in sys.argv
    os.makedirs(OUT, exist_ok=True)
    made = 0
    for slug, cat in posts():
        path = os.path.join(OUT, slug + ".jpg")
        if os.path.exists(path) and not redo:
            continue
        rng = np.random.default_rng(int(hashlib.sha1(slug.encode()).hexdigest()[:12], 16))
        img = SCENES.get(cat, scene_living)(rng)
        finish(img, rng).save(path, "JPEG", quality=82, optimize=True, progressive=True)
        made += 1
    # list of slugs that have a picture, read by the site
    have = sorted(f[:-4] for f in os.listdir(OUT) if f.endswith(".jpg"))
    with open(os.path.join(ROOT, "content", "post-images.ts"), "w", encoding="utf-8") as fh:
        fh.write("// Generated by scripts/journal-images.py: posts that have a cover in public/journal.\n")
        fh.write("export const postImages = new Set<string>([\n" + "".join(f'  "{s}",\n' for s in have) + "]);\n")
    print(f"painted {made}, {len(have)} covers in public/journal")

if __name__ == "__main__":
    main()
