import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const status = exception.getStatus();
		const context = host.switchToHttp();
		const request = context.getRequest<Request>();
		const response = context.getResponse<Response>();
		const message = JSON.stringify(exception.getResponse());

		response.status(status).json({
			method: host.getArgs()[0].method,
			statusCode: status,
			path: request.url,
			data: {
				message: JSON.parse(message).message,
				error: exception.getResponse(),
			},
			timestamp: new Date().toISOString(),
		});
	}
}
