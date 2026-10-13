import { config } from "@pedrohb/tsdown-config";
import { mergeConfig } from "tsdown";

export default mergeConfig(config, {
	entry: {
		index: "./src/index.ts",
		"errors/index": "./src/errors/index.ts",
		"entity-ids/index": "./src/entity-ids/index.ts",
		"entities/index": "./src/entities/index.ts",
	},
});
