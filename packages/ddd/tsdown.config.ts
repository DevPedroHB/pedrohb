import { config } from "@pedrohb/tsdown-config";
import { mergeConfig } from "tsdown";

export default mergeConfig(config, {
	entry: {
		index: "./src/index.ts",
		"entities/index": "./src/entities/index.ts",
		"entity-ids/index": "./src/entity-ids/index.ts",
		"errors/index": "./src/errors/index.ts",
		"events/index": "./src/events/index.ts",
		"functions/index": "./src/functions/index.ts",
		"types/index": "./src/types/index.ts",
		"use-cases/index": "./src/use-cases/index.ts",
		"value-objects/index": "./src/value-objects/index.ts",
	},
});
