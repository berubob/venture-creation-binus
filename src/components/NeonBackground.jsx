import { useMemo } from 'react';

// PRNG sederhana supaya skyline sama setiap render
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const NEON = ['#2ee6d6', '#ff3ea5', '#9b6bff'];

function buildCity() {
  const r = rng(7);
  const W = 1600;
  const buildings = [];
  let x = -20;
  while (x < W) {
    const w = 46 + r() * 70;
    const h = 90 + r() * 230;
    const edge = NEON[Math.floor(r() * 3)];
    const windows = [];
    for (let wy = 14; wy < h - 10; wy += 16) {
      for (let wx = 8; wx < w - 12; wx += 14) {
        if (r() > 0.72) windows.push({ x: wx, y: wy, c: NEON[Math.floor(r() * 3)], o: 0.35 + r() * 0.55 });
      }
    }
    buildings.push({ x, w, h, edge, windows, sign: r() > 0.86 });
    x += w + 4 + r() * 10;
  }
  return buildings;
}

export default function NeonBackground() {
  const city = useMemo(buildCity, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Langit malam ke horizon magenta */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #03050f 0%, #080c28 45%, #1a0c42 72%, #4a1070 90%, #8a1a8c 100%)',
        }}
      />

      {/* Cahaya di belakang botol: rim light untuk botol hitam doff */}
      <div
        className="absolute left-1/2 top-[46%] h-[85vh] w-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
        style={{
          background:
            'radial-gradient(circle, rgba(255,62,165,0.38) 0%, rgba(155,107,255,0.22) 38%, rgba(46,230,214,0.08) 60%, transparent 72%)',
        }}
      />

      {/* Skyline */}
      <svg
        className="absolute inset-x-0 bottom-[11%] h-[58%] w-full"
        viewBox="0 0 1600 340"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141a52" />
            <stop offset="1" stopColor="#070a22" />
          </linearGradient>
        </defs>

        {/* Menara utama */}
        <g filter="url(#glow)" opacity="0.9">
          <polygon points="800,10 810,90 822,150 830,340 770,340 778,150 790,90" fill="#0b2a3f" stroke="#2ee6d6" strokeWidth="1.5" />
        </g>

        {city.map((b, i) => (
          <g key={i} transform={`translate(${b.x},${340 - b.h})`} opacity={0.92}>
            <rect width={b.w} height={b.h} fill="url(#bldg)" />
            <path d={`M0 ${b.h} V0 H${b.w} V${b.h}`} fill="none" stroke={b.edge} strokeOpacity="0.55" strokeWidth="1.2" filter="url(#glow)" />
            {b.windows.map((w, j) => (
              <rect key={j} x={w.x} y={w.y} width="5" height="7" fill={w.c} opacity={w.o} />
            ))}
            {b.sign && (
              <rect x={b.w * 0.2} y={b.h * 0.2} width={b.w * 0.6} height="22" fill={b.edge} opacity="0.85" filter="url(#glow)" />
            )}
          </g>
        ))}
      </svg>

      {/* Garis horizon neon */}
      <div
        className="horizon-pulse absolute inset-x-0 bottom-[11%] h-[3px] bg-neon-pink"
        style={{ boxShadow: '0 0 12px 3px #ff3ea5, 0 0 60px 14px rgba(255,62,165,0.55)' }}
      />

      {/* Lantai grid perspektif */}
      <div className="absolute inset-x-0 bottom-0 h-[11%] overflow-hidden bg-[#0a0420]">
        <div
          className="absolute -inset-x-[50%] top-0 h-[300%] origin-top"
          style={{
            transform: 'perspective(260px) rotateX(62deg)',
            backgroundImage:
              'linear-gradient(rgba(255,62,165,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(46,230,214,0.4) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      {/* Vinyet agar teks di tepi tetap terbaca */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(3,5,15,0.65) 100%)' }}
      />
    </div>
  );
}
