import { config } from "@pedrohb/tsdown-config";
import { mergeConfig } from "tsdown";

export default mergeConfig(config, {
	entry: {
		index: "./src/index.ts",
	},
});
