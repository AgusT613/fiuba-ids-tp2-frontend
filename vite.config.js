import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-node';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	process.env = { ...process.env, ...env };

	return {
		plugins: [
			sveltekit({
				adapter: adapter()
			}),
			tailwindcss()
		]
	};
});
