import { defineConfig } from "tsdown";

export const config = defineConfig({
	clean: true,
	dts: true,
	format: ["cjs", "esm"],
	minify: false,
	outDir: "dist",
	sourcemap: true,
	treeshake: true,
	tsconfig: true,
});
