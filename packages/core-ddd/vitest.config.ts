import vitestConfig from "@pedrohb/vitest-config";
import { mergeConfig } from "vitest/config";

export default mergeConfig(vitestConfig, {
	test: {
		root: ".",
	},
});
