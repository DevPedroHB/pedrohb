import { defineConfig } from "vitest/config";

export const config = defineConfig({
	test: {
		coverage: {
			enabled: true,
		},
		exclude: [
			"**/.git/**",
			"**/.turbo/**",
			"**/coverage/**",
			"**/dist/**",
			"**/node_modules/**",
		],
		globals: true,
		mockReset: true,
		restoreMocks: true,
	},
	server: {
		host: "0.0.0.0",
	},
});
