import { defineConfig } from "tsdown";

export const config = defineConfig({
	dts: true,
	format: ["esm", "cjs"],
	sourcemap: true,
});
