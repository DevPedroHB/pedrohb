import { NestInterceptor, VersioningType } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { AppModule } from "./app.module";
import { EnvService } from "./env/env.service";
import { CustomExceptionFilter } from "./http/filters/custom-exception.filter";
import { PrismaExceptionFilter } from "./http/filters/prisma-exception.filter";
import { CustomResponseInterceptor } from "./http/interceptors/custom-response.interceptor";

patchNestJsSwagger();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const { httpAdapter } = app.get(HttpAdapterHost);

	app.useGlobalFilters(
		new CustomExceptionFilter(),
		new PrismaExceptionFilter(httpAdapter),
	);

	app.useGlobalInterceptors(new CustomResponseInterceptor<NestInterceptor>());

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: ["v1"],
		prefix: "api/",
	});

	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle("PedroHB API")
		.setDescription("API para o portfolio de PedroHB.")
		.setVersion("1.0.0")
		.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
				name: "JWT",
				description: "Insira o JWT token",
				in: "header",
			},
			"token",
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("docs", app, document);

	const envService = app.get(EnvService);

	const port = envService.get("PORT");

	await app.listen(port);
}

bootstrap();
