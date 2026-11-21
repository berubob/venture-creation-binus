export const LITE =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

export const DPR = LITE ? [1, 1.5] : [1, 2];
export const PARTICLE_SCALE = LITE ? 0.5 : 1;
export const SHADOW_RES = LITE ? 256 : 512;