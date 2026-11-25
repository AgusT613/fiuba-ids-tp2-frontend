import { sveltekit } from '@sveltejs/kit/vite';
import adapterNode from '@sveltejs/adapter-node';
import adapterAuto from '@sveltejs/adapter-auto';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	process.env = { ...process.env, ...env };

	const adapter = process.env.VERCEL ? adapterAuto() : adapterNode();

	return {
		plugins: [
			sveltekit({
				adapter: adapter
			}),
			tailwindcss()
		]
	};
});
