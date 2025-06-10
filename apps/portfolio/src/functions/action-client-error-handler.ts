import {} from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "sonner";

interface IActionClientErrorHandler {
	error: {
		data?: unknown;
		serverError?: string;
		validationErrors?: {
			formErrors: string[];
			fieldErrors: Record<string, string[]>;
		};
		thrownError?: Error;
	};
}

export function actionClientErrorHandler({ error }: IActionClientErrorHandler) {
	const errors: string[] = [];

	if (error.serverError) {
		errors.push(error.serverError);
	}

	if (error.validationErrors) {
		const { formErrors, fieldErrors } = error.validationErrors;

		errors.push(...formErrors, ...Object.values(fieldErrors).flat());
	}

	for (const error of errors) {
		toast.error(error);
	}

	return {
		errors,
	};
}
