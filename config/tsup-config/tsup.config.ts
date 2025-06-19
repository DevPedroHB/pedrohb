import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/**/*.ts", "./src/**/*.tsx", "!./src/**/*spec.ts"],
	splitting: false,
	sourcemap: true,
	clean: true,
	dts: true,
	format: ["cjs", "esm"],
	noExternal: [
		// packages
		"@pedrohb/core-ddd",
		// config
		"@pedrohb/typescript-config",
		"@pedrohb/vitest-config",
		"@pedrohb/tsup-config",
	],
	outDir: "dist",
	tsconfig: "./tsconfig.json",
});
