import { useEffect, useRef, useSyncExternalStore } from 'react';
import { getScrollEl, subscribeScrollEl } from '../scrollStore';

// Urat emas mengalir seperti gelombang di tepi lukisan tinta
const VEINS = [
  { d: 'M-50 540 C100 580 230 450 380 490 C520 525 610 655 760 630 C900 605 990 720 1120 780 C1260 840 1420 800 1650 880', w: 3 },
  { d: 'M-50 575 C90 610 220 490 370 525 C510 558 600 690 750 662 C890 636 985 752 1115 810', w: 1.6 },
  { d: 'M380 490 C400 430 455 405 470 335 C482 280 540 250 560 190', w: 1.4 },
  { d: 'M1650 400 C1520 360 1460 265 1330 290 C1215 312 1170 170 1055 140 C975 118 925 40 890 -50', w: 3 },
  { d: 'M1650 430 C1510 395 1448 300 1322 326 C1205 350 1158 208 1045 176', w: 1.4 },
  { d: 'M1330 290 C1300 350 1340 400 1300 470', w: 1.2 },
];

// Percikan emas [x, y, radius]
const DROPS = [
  [430, 430, 7], [470, 395, 3], [520, 352, 4], [345, 420, 2.5], [600, 520, 3], [690, 560, 5],
  [820, 560, 2.5], [560, 300, 3], [590, 240, 2], [1040, 690, 4], [1180, 720, 6], [1260, 700, 2.5],
  [1390, 720, 3], [1410, 330, 6], [1390, 420, 3], [1260, 230, 4], [1180, 110, 3], [1100, 70, 2],
  [300, 580, 3.5], [160, 470, 3],
];

const WASH_BOTTOM = 'M-100 900 L-100 520 C100 560 220 430 380 470 C520 505 600 640 760 610 C900 585 980 700 1120 760 C1260 820 1400 780 1700 900 Z';
const WASH_TOP = 'M1700 -50 L1700 380 C1560 345 1450 245 1330 270 C1220 290 1180 150 1060 120 C980 100 930 20 900 -50 Z';
const MOUNTAINS = 'M-50 900 L-50 700 L120 610 L210 670 L360 540 L470 625 L640 500 L760 600 L900 520 L1040 640 L1200 560 L1340 650 L1480 580 L1650 690 L1650 900 Z';

export default function InkBackground() {
  const el = useSyncExternalStore(subscribeScrollEl, getScrollEl);
  const washRef = useRef(null);
  const goldRef = useRef(null);

  useEffect(() => {
    const update = () => {
      let p = 0;
      if (el) {
        const max = el.scrollHeight - el.clientHeight;
        p = max > 0 ? el.scrollTop / max : 0;
      }
      if (washRef.current) washRef.current.style.transform = `translate3d(0, ${-p * 70}px, 0)`;
      if (goldRef.current) {
        goldRef.current.style.transform = `translate3d(0, ${-p * 160}px, 0)`;
        // Emas "tergambar" makin panjang seiring scroll
        goldRef.current
          .querySelectorAll('[data-vein]')
          .forEach((v) => (v.style.strokeDashoffset = 1 - (0.35 + 0.65 * p)));
      }
    };
    update();
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [el]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-paper">
      {/* Lapisan tinta navy: gunung berkabut + wash cat air */}
      <div ref={washRef} className="absolute -inset-[8%] will-change-transform">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <defs>
            <filter id="wash" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency=".007 .011" numOctaves="4" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="120" xChannelSelector="R" yChannelSelector="G" result="d" />
              <feGaussianBlur in="d" stdDeviation="1.4" result="b" />
              <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="9" result="g" />
              <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.4 0 0 0 .2" result="ga" />
              <feComposite in="b" in2="ga" operator="in" />
            </filter>
            <filter id="mist" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="3" seed="2" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="60" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <path d={MOUNTAINS} fill="#6b7798" opacity=".14" filter="url(#mist)" />
          <g filter="url(#wash)">
            <path d={WASH_BOTTOM} fill="#8a96b5" opacity=".55" transform="translate(30 -40)" />
            <path d={WASH_BOTTOM} fill="#1b2340" opacity=".82" stroke="#0e1530" strokeOpacity=".35" strokeWidth="3" />
            <path d={WASH_TOP} fill="#8a96b5" opacity=".5" transform="translate(-30 30)" />
            <path d={WASH_TOP} fill="#222c52" opacity=".78" stroke="#0e1530" strokeOpacity=".35" strokeWidth="3" />
          </g>
        </svg>
      </div>

      {/* Lapisan gold foil: urat dan percikan */}
      <div ref={goldRef} className="absolute -inset-[8%] will-change-transform">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <defs>
            <linearGradient id="goldFoil" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8a5a14" />
              <stop offset=".35" stopColor="#e8c36a" />
              <stop offset=".65" stopColor="#b8862b" />
              <stop offset="1" stopColor="#f3dd9a" />
            </linearGradient>
            <filter id="hand" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="6" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <g filter="url(#hand)" fill="none" stroke="url(#goldFoil)" strokeLinecap="butt">
            {VEINS.map((v, i) => (
              <path key={i} d={v.d} data-vein pathLength="1" strokeDasharray="1" strokeDashoffset=".65" strokeWidth={v.w} />
            ))}
            {DROPS.map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill="url(#goldFoil)" stroke="none" />
            ))}
          </g>
        </svg>
      </div>

      {/* Tekstur kertas art paper */}
      <svg className="absolute inset-0 h-full w-full opacity-40 mix-blend-multiply">
        <filter id="paper">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" />
          <feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .28  0 0 0 .6 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper)" />
      </svg>

      {/* Vignette lembut seperti tepi kanvas */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(120,90,50,.18) 100%)' }}
      />
    </div>
  );
}
