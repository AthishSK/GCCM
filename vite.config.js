import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
<<<<<<< HEAD

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
=======
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
  ],
  server: {
    host: true, // Allows external access
    strictPort: true, // Ensures the same port is used
    allowedHosts: ['.ngrok-free.app'], // Allows all Ngrok subdomains
  }
>>>>>>> 8fd439e (Updated UI with cherry picking of commits to mergerequest)
});
