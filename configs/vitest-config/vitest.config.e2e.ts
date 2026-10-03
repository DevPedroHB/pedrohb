import { mergeConfig } from "vitest/config";
import { config } from "./vitest.config.js";

export const e2eConfig = mergeConfig(config, {
	test: {
		include: ["**/*.{e2e-test,e2e-spec}.?(c|m)[jt]s?(x)"],
	},
});
