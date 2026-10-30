import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '../custom_components/device_care/frontend',
    emptyOutDir: true,
    lib: {
      entry: 'src/device-care.ts',
      formats: ['es'],
      fileName: () => 'device-care.js',
    },
    target: 'es2022',
    sourcemap: false,
  },
});
