import { defineConfig } from "vitest/config";

export const unitConfig = defineConfig({
	test: {
		clearMocks: true,
		coverage: { enabled: true },
		exclude: [
			"**/.git/**",
			"**/.turbo/**",
			"**/coverage/**",
			"**/dist/**",
			"**/node_modules/**",
		],
		globals: true,
		include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
		mockReset: true,
		restoreMocks: true,
	},
	server: {
		host: "0.0.0.0",
	},
});
