import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function getHtmlInputs() {
  const inputs = {};
  const root = path.resolve(__dirname);

  for (const file of fs.readdirSync(root)) {
    if (file.endsWith('.html')) {
      inputs[file.replace('.html', '')] = path.resolve(root, file);
    }
  }

  const villesDir = path.resolve(root, 'villes');
  if (fs.existsSync(villesDir)) {
    for (const file of fs.readdirSync(villesDir)) {
      if (file.endsWith('.html')) {
        inputs['villes/' + file.replace('.html', '')] = path.resolve(villesDir, file);
      }
    }
  }

  return inputs;
}

export default defineConfig({
  build: {
    rollupOptions: { input: getHtmlInputs() },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    cssMinify: true,
  },
});
