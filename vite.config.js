import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		'process.env.PUBLIC_GITLAB_API_URL': JSON.stringify(process.env.PUBLIC_GITLAB_API_URL),
		'process.env.PUBLIC_GITLAB_ACCESS_TOKEN': JSON.stringify(process.env.PUBLIC_GITLAB_ACCESS_TOKEN)
	}
});
