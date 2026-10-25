import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { getScrollEl, subscribeScrollEl } from '../scrollStore';

function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const C = { cyan: '#2ee6d6', pink: '#ff3ea5', violet: '#9b6bff' };
const NEON = [C.cyan, C.pink, C.violet];
const WIN = ['#7ffaf0', '#7ffaf0', '#ff7cc4', '#ffd58a', '#b79bff'];
const W = 1600;
const H = 400;
const LANDMARK_X = 930;

function genLayer(seed, o) {
  const r = rng(seed);
  const list = [];
  let x = o.start ?? -40;
  const end = o.end ?? W + 40;
  while (x < end) {
    const w = o.minW + r() * (o.maxW - o.minW);
    const h = o.minH + r() * (o.maxH - o.minH);
    const k = r();
    const b = {
      x, w, h,
      c: NEON[Math.floor(r() * 3)],
      roof: k < 0.3 ? 'step' : k < 0.5 ? 'antenna' : k < 0.62 ? 'slant' : 'flat',
      win: [], sign: null, strip: null,
    };
    if (o.windows) {
      for (let wy = 16; wy < h - 12; wy += 15) {
        for (let wx = 9; wx < w - 14; wx += 13) {
          if (r() < o.windows) b.win.push({ x: wx, y: wy, c: WIN[Math.floor(r() * WIN.length)], o: 0.55 + r() * 0.45 });
        }
      }
    }
    if (o.signs && r() < o.signs && w > 60 && h > 120) {
      b.sign = { y: 28 + r() * h * 0.4, c: NEON[Math.floor(r() * 2)], bars: [r(), r(), r()] };
    } else if (o.signs && r() < o.signs * 0.7 && h > 140) {
      b.strip = { c: NEON[Math.floor(r() * 3)], y: 20 + r() * 60, len: 60 + r() * h * 0.4, left: r() > 0.5 };
    }
    list.push(b);
    x += w + o.gapMin + r() * (o.gapMax - o.gapMin);
  }
  return list;
}

function outline(b) {
  const { w, h } = b;
  switch (b.roof) {
    case 'step': return `M0 ${h} V0 H${w * 0.2} V-12 H${w * 0.8} V0 H${w} V${h}`;
    case 'slant': return `M0 ${h} V16 L${w} 0 V${h}`;
    case 'spire': return `M0 ${h} V34 H${w * 0.34} L${w * 0.5} -70 L${w * 0.66} 34 H${w} V${h}`;
    default: return `M0 ${h} V0 H${w} V${h}`;
  }
}

function Layer({ id, items, body, edgeOp, edgeW, winOp = 1, shift, className = '', reflect = false }) {
  return (
    <svg
      className={`absolute -inset-x-24 ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      style={{
        transform: `translate3d(calc((0.5 - var(--p, 0)) * ${shift}px), 0, 0)`,
        WebkitBoxReflect: reflect ? 'below 0px linear-gradient(transparent 55%, rgba(255,255,255,0.3))' : undefined,
      }}
    >
      <defs>
        <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`body-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={body[0]} />
          <stop offset="0.6" stopColor={body[1]} />
          <stop offset="1" stopColor={body[2]} />
        </linearGradient>
      </defs>

      {/* Badan gedung dan jendela */}
      {items.map((b, i) => (
        <g key={i} transform={`translate(${b.x},${H - b.h})`}>
          <path d={`${outline(b)}Z`} fill={`url(#body-${id})`} />
          {b.win.map((w, j) => (
            <rect key={j} x={w.x} y={w.y} width={w.w ?? 5} height={w.h ?? 7} fill={w.c} opacity={w.o * winOp} />
          ))}
        </g>
      ))}

      {/* Tepi neon, papan iklan, strip vertikal, antena (satu filter glow untuk semuanya) */}
      <g filter={`url(#glow-${id})`} fill="none">
        {items.map((b, i) => (
          <g key={i} transform={`translate(${b.x},${H - b.h})`}>
            <path d={outline(b)} stroke={b.c} strokeOpacity={edgeOp} strokeWidth={edgeW} />
            {b.roof === 'antenna' && (
              <>
                <line x1={b.w / 2} y1="0" x2={b.w / 2} y2="-34" stroke={b.c} strokeWidth="1.5" />
                <circle cx={b.w / 2} cy="-36" r="2.5" fill="#ff3e6c" className="flicker" style={{ animationDelay: `${(i % 5) * 0.7}s` }} />
              </>
            )}
            {b.sign && (
              <rect x={b.w * 0.14} y={b.sign.y} width={b.w * 0.72} height="26" fill={b.sign.c} opacity="0.95" className="flicker" style={{ animationDelay: `${(i % 7) * 0.9}s` }} />
            )}
            {b.strip && (
              <rect x={b.strip.left ? 3 : b.w - 7} y={b.strip.y} width="4" height={b.strip.len} fill={b.strip.c} className="flicker" style={{ animationDelay: `${(i % 6) * 1.1}s` }} />
            )}
          </g>
        ))}
      </g>

      {/* Garis gelap di papan iklan supaya terlihat seperti teks */}
      <g fill="#05061a" opacity="0.75">
        {items.map((b, i) =>
          b.sign
            ? b.sign.bars.map((v, k) => (
                <rect key={`${i}-${k}`} x={b.x + b.w * 0.2} y={H - b.h + b.sign.y + 5 + k * 7} width={b.w * 0.5 * (0.4 + v * 0.6)} height="3" />
              ))
            : null
        )}
      </g>
    </svg>
  );
}

const DRONES = [
  { top: '17%', c: C.cyan, d: 46, delay: -8 },
  { top: '26%', c: C.pink, d: 62, delay: -30 },
  { top: '11%', c: '#ffffff', d: 80, delay: -50 },
];

export default function NeonBackground() {
  const root = useRef(null);
  const scrollEl = useSyncExternalStore(subscribeScrollEl, getScrollEl);

  const { far, mid, near } = useMemo(() => {
    const far = genLayer(11, { minW: 60, maxW: 130, minH: 110, maxH: 300, gapMin: -12, gapMax: 4, windows: 0.18 });
    const mid = genLayer(23, { minW: 64, maxW: 130, minH: 130, maxH: 290, gapMin: 2, gapMax: 14, windows: 0.38, signs: 0.3 })
      .filter((b) => Math.abs(b.x + b.w / 2 - LANDMARK_X) > 80);
    mid.push({
      x: LANDMARK_X - 32, w: 64, h: 300, c: C.cyan, roof: 'spire', sign: null, strip: null,
      win: Array.from({ length: 12 }, (_, i) => ({ x: 8, y: 46 + i * 20, w: 48, h: 3, c: '#7ffaf0', o: 0.9 })),
    });
    const near = [
      ...genLayer(31, { start: -60, end: 190, minW: 90, maxW: 170, minH: 200, maxH: 330, gapMin: -10, gapMax: 0, windows: 0.08, signs: 0.4 }),
      ...genLayer(47, { start: 1410, end: 1700, minW: 90, maxW: 170, minH: 180, maxH: 320, gapMin: -10, gapMax: 0, windows: 0.08, signs: 0.4 }),
    ];
    return { far, mid, near };
  }, []);

  // Parallax: tiap lapisan bergeser berbeda mengikuti scroll (lewat CSS variable, tanpa re-render)
  useEffect(() => {
    const el = root.current;
    if (!el || !scrollEl) return;
    const onScroll = () => {
      const max = scrollEl.scrollHeight - scrollEl.clientHeight;
      el.style.setProperty('--p', String(max > 0 ? scrollEl.scrollTop / max : 0));
    };
    onScroll();
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, [scrollEl]);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Langit: sangat gelap di atas, magenta menyala di horizon */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #02030a 0%, #070a2e 40%, #1c0a4a 68%, #6a1280 88%, #d41f96 100%)' }}
      />

      {/* Cahaya di belakang botol: latar terang agar siluet botol hitam doff terbaca */}
      <div
        className="absolute left-[62%] top-[48%] h-[90vh] w-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,62,165,0.55) 0%, rgba(155,107,255,0.3) 36%, rgba(46,230,214,0.1) 58%, transparent 72%)' }}
      />

      {/* Jalan basah */}
      <div
        className="absolute inset-x-0 bottom-0 h-[15%] overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #2a0a55 0%, #0d0426 35%, #03010d 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 28% 70% at 22% 0%, rgba(255,62,165,0.4), transparent), radial-gradient(ellipse 24% 70% at 68% 0%, rgba(46,230,214,0.32), transparent)' }}
        />
        <div
          className="absolute -inset-x-[50%] top-0 h-[300%] origin-top"
          style={{
            transform: 'perspective(260px) rotateX(62deg)',
            backgroundImage:
              'linear-gradient(rgba(255,62,165,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(46,230,214,0.3) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      {/* Lapisan jauh, berkabut */}
      <Layer id="far" items={far} body={['#0c1248', '#1a1060', '#4a1478']} edgeOp={0.4} edgeW={1} winOp={0.5} shift={30} className="bottom-[15%] h-[62%]" />
      <div
        className="absolute inset-x-0 bottom-[15%] h-[55%]"
        style={{ background: 'linear-gradient(to top, rgba(200,30,150,0.5), rgba(90,30,170,0.15) 45%, transparent)' }}
      />

      {/* Lapisan tengah: gedung hampir hitam, tepi dan jendela neon terang, dengan pantulan di jalan */}
      <Layer id="mid" items={mid} body={['#05072a', '#0a0a38', '#3d0c66']} edgeOp={0.95} edgeW={1.6} shift={80} className="bottom-[15%] h-[58%]" reflect />

      {/* Lapisan depan: siluet di kedua tepi sebagai bingkai */}
      <Layer id="near" items={near} body={['#020310', '#02030c', '#1a0636']} edgeOp={0.85} edgeW={1.4} winOp={0.7} shift={150} className="bottom-[15%] h-[50%]" />

      {/* Kendaraan terbang */}
      {DRONES.map((d, i) => (
        <span
          key={i}
          className="drone"
          style={{ top: d.top, background: d.c, boxShadow: `0 0 10px 3px ${d.c}`, animationDuration: `${d.d}s`, animationDelay: `${d.delay}s` }}
        />
      ))}

      {/* Garis horizon neon */}
      <div
        className="horizon-pulse absolute inset-x-0 bottom-[15%] h-[3px] bg-neon-pink"
        style={{ boxShadow: '0 0 12px 3px #ff3ea5, 0 0 60px 14px rgba(255,62,165,0.55)' }}
      />

      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(2,3,10,0.7) 100%)' }}
      />
    </div>
  );
}
