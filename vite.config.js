import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      // 'ec2-3-6-152-103.ap-south-1.compute.amazonaws.com'
      'ecofyndsupport.platinum-infotech.com'
    ],
    port: 5173
  }
});


// https://vite.dev/config/
// export default defineConfig({
//    content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [react(), tailwindcss()],
// })
