import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const paginationQuerySchema = z.object({
	page: z.coerce.number().default(1).nullish(),
	perPage: z.coerce.number().default(10).nullish(),
});

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
