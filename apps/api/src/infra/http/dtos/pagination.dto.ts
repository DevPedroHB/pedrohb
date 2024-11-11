import { createZodDto } from "nestjs-zod";
import { paginationQuerySchema } from "../schemas/pagination-query-schema";

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
