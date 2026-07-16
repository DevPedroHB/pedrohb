import { mergeConfig } from "vitest/config";
import { unitConfig } from "./vitest.config";

export const e2eConfig = mergeConfig(unitConfig, {
	test: {
		include: ["**/*.{e2e-test,e2e-spec}.?(c|m)[jt]s?(x)"],
	},
});
