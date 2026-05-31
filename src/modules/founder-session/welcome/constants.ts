export const PULSE_RINGS = [
  { id: 'ring-1', scale: 1.0, delay: 0 },
  { id: 'ring-2', scale: 1.5, delay: 0.8 },
  { id: 'ring-3', scale: 2.1, delay: 1.6 },
  { id: 'ring-4', scale: 2.8, delay: 2.4 },
] as const

export const CONSTELLATION_DOTS = [
  { id: 'dot-1',  x: '8%',  y: '12%', size: 1.5, delay: 0 },
  { id: 'dot-2',  x: '18%', y: '72%', size: 1,   delay: 0.4 },
  { id: 'dot-3',  x: '25%', y: '38%', size: 2,   delay: 0.9 },
  { id: 'dot-4',  x: '38%', y: '88%', size: 1.5, delay: 1.3 },
  { id: 'dot-5',  x: '52%', y: '6%',  size: 1,   delay: 0.6 },
  { id: 'dot-6',  x: '65%', y: '22%', size: 2,   delay: 1.1 },
  { id: 'dot-7',  x: '72%', y: '60%', size: 1.5, delay: 0.2 },
  { id: 'dot-8',  x: '80%', y: '82%', size: 1,   delay: 1.7 },
  { id: 'dot-9',  x: '88%', y: '42%', size: 2,   delay: 0.7 },
  { id: 'dot-10', x: '93%', y: '15%', size: 1,   delay: 2.1 },
  { id: 'dot-11', x: '12%', y: '50%', size: 1,   delay: 1.5 },
  { id: 'dot-12', x: '46%', y: '58%', size: 1.5, delay: 0.3 },
  { id: 'dot-13', x: '58%', y: '92%', size: 1,   delay: 1.9 },
  { id: 'dot-14', x: '33%', y: '18%', size: 1.5, delay: 0.8 },
  { id: 'dot-15', x: '76%', y: '8%',  size: 1,   delay: 2.4 },
] as const

export const CONSTELLATION_LINES = [
  { id: 'line-1', x1: '8%',  y1: '12%', x2: '25%', y2: '38%', delay: 1.2 },
  { id: 'line-2', x1: '25%', y1: '38%', x2: '18%', y2: '72%', delay: 1.5 },
  { id: 'line-3', x1: '65%', y1: '22%', x2: '88%', y2: '42%', delay: 1.8 },
  { id: 'line-4', x1: '72%', y1: '60%', x2: '80%', y2: '82%', delay: 2.0 },
  { id: 'line-5', x1: '52%', y1: '6%',  x2: '65%', y2: '22%', delay: 1.3 },
  { id: 'line-6', x1: '33%', y1: '18%', x2: '52%', y2: '6%',  delay: 1.6 },
] as const

export const HINT_DOT_DELAYS = [0, 180, 360] as const
