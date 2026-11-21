// Offline preview build: bundles local React 19 and swaps framer-motion / lucide-react for shims.
import { build } from '/opt/npm-tools/node_modules/esbuild/lib/main.js';
import path from 'node:path';
const root = path.resolve('.');
const alias = {
  name: 'alias',
  setup(b) {
    b.onResolve({ filter: /^framer-motion$/ }, () => ({ path: path.join(root, 'preview/motion-shim.js') }));
    b.onResolve({ filter: /^lucide-react$/ }, () => ({ path: path.join(root, 'preview/icons.js') }));
    b.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, a => ({ path: require_resolve(a.path) }));
  }
};
import { createRequire } from 'node:module';
const req = createRequire('/opt/npm-tools/node_modules/');
const require_resolve = p => req.resolve(p);
await build({ entryPoints: ['src/app.jsx'], bundle: true, minify: true, outfile: 'Asset/dist/app.js', loader: { '.jsx': 'jsx' }, jsx: 'automatic', target: ['es2020'], define: { 'process.env.NODE_ENV': '"production"' }, plugins: [alias], logLevel: 'warning' });
console.log('preview built');
