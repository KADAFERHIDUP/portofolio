// Stand-in for the lucide-react icons used by src/app.jsx (offline preview build only).
import { createElement as h } from 'react';

const make = (name, shapes) => {
  const Icon = ({ size = 24, color = 'currentColor', strokeWidth = 2, fill = 'none', className = '', ...rest }) =>
    h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', fill, stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', className: `lucide lucide-${name} ${className}`.trim(), 'aria-hidden': 'true', ...rest },
      ...shapes.map(([tag, attrs], i) => h(tag, { key: i, ...attrs })));
  Icon.displayName = name;
  return Icon;
};
const p = d => ['path', { d }];

export const ArrowUpRight = make('arrow-up-right', [p('M7 7h10v10'), p('M7 17 17 7')]);
export const ArrowDown = make('arrow-down', [p('M12 5v14'), p('m19 12-7 7-7-7')]);
export const ArrowRight = make('arrow-right', [p('M5 12h14'), p('m12 5 7 7-7 7')]);
export const Play = make('play', [['polygon', { points: '6 3 20 12 6 21 6 3' }]]);
export const X = make('x', [p('M18 6 6 18'), p('m6 6 12 12')]);
export const Menu = make('menu', [p('M4 6h16'), p('M4 12h16'), p('M4 18h16')]);
export const Mail = make('mail', [['rect', { width: 20, height: 16, x: 2, y: 4, rx: 2 }], p('m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7')]);
export const Phone = make('phone', [p('M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z')]);
export const MapPin = make('map-pin', [p('M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'), ['circle', { cx: 12, cy: 10, r: 3 }]]);
export const Linkedin = make('linkedin', [p('M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'), ['rect', { width: 4, height: 12, x: 2, y: 9 }], ['circle', { cx: 4, cy: 4, r: 2 }]]);
export const Download = make('download', [p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), ['polyline', { points: '7 10 12 15 17 10' }], ['line', { x1: 12, x2: 12, y1: 15, y2: 3 }]]);
export const Pause = make('pause', [['rect', { x: 6, y: 4, width: 4, height: 16 }], ['rect', { x: 14, y: 4, width: 4, height: 16 }]]);
export const Search = make('search', [['circle', { cx: 11, cy: 11, r: 8 }], p('m21 21-4.3-4.3')]);
export const Plus = make('plus', [p('M5 12h14'), p('M12 5v14')]);
export const Minus = make('minus', [p('M5 12h14')]);
export const ChevronLeft = make('chevron-left', [p('m15 18-6-6 6-6')]);
export const ChevronRight = make('chevron-right', [p('m9 18 6-6-6-6')]);
export const ExternalLink = make('external-link', [p('M15 3h6v6'), p('M10 14 21 3'), p('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6')]);
