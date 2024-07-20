import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const dev = process.env.NODE_ENV === 'development';
/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
            runtime: 'nodejs18.x',
            fallback: undefined,
        })
	},
    paths: {
        base: dev ? '' : '/Digimon-Pomodoro'
    }
};

export default config;
