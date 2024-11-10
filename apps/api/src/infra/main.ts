import { NestInterceptor, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import { AppModule } from "./app.module";
import { EnvService } from "./env/env.service";
import { CustomExceptionFilter } from "./http/filters/custom-exception.filter";
import { CustomResponseInterceptor } from "./http/interceptors/custom-response.interceptor";

patchNestJsSwagger();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalFilters(new CustomExceptionFilter());

	app.useGlobalInterceptors(new CustomResponseInterceptor<NestInterceptor>());

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: ["v1"],
		prefix: "api/",
	});

	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle("PedroHB API")
		.setDescription("API para o meu portfolio PedroHB.")
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
	const theme = new SwaggerTheme();

	SwaggerModule.setup("docs", app, document, {
		explorer: true,
		customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
	});

	const envService = app.get(EnvService);

	const port = envService.get("PORT");

	await app.listen(port);
}

bootstrap();
