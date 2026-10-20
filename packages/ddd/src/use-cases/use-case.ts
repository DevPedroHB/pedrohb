/** biome-ignore-all lint/suspicious/noExplicitAny: off */

import type { Result } from "@pedrohb/errors";

export abstract class UseCase<Request extends object, Response extends Result> {
	public abstract execute(request: Request): Promise<Response>;
}
