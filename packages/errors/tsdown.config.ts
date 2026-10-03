import { config } from "@pedrohb/tsdown-config";
import { mergeConfig } from "tsdown";

export default mergeConfig(config, {
	entry: {
		index: "./src/index.ts",
		"errors/index": "./src/errors/index.ts",
		"functions/index": "./src/functions/index.ts",
		"types/index": "./src/types/index.ts",
	},
});
