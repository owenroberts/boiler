import { defineConfig } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import vitePluginString from 'vite-plugin-string';
import { resolve } from 'path';

export default defineConfig({
	css: { devSourcemap: true, },
	server: { port: 8888 }, // change port for unique localStorage
	appType: 'mpa',
	plugins: [
		vitePluginString(),
		viteStaticCopy({
			targets: [
				{
					src: 'doodoo/samples/',
					dest: 'doodoo/',
				},
			]
		}),
	],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html')			
			}
		},
	},
});