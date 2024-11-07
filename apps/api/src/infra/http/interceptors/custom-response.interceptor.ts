import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

export interface Response<T> {
	data: T;
}

@Injectable()
export class CustomResponseInterceptor<T>
	implements NestInterceptor<T, Response<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		const request = context.switchToHttp().getRequest();

		return next.handle().pipe(
			map((data) => ({
				method: context.switchToHttp().getResponse().req.method,
				statusCode: context.switchToHttp().getResponse().statusCode,
				path: request.path,
				data,
				timestamp: new Date().toISOString(),
			})),
		);
	}
}
