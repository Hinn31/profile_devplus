import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),              // Trang index
        portfolio: resolve(__dirname, 'src/Pages/Portfolio.html')  // Trang portfolio
      }
    }
  }
})
