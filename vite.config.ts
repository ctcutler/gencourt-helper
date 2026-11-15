import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-auto';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],

	test: {
		workspace: [
			{
				extends: './vite.config.ts',
				plugins: [
					svelteTesting(),
					sveltekit({
						// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
						// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
						// See https://svelte.dev/docs/kit/adapters for more information about adapters.
						adapter: adapter()
					})
				],

				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',

				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
