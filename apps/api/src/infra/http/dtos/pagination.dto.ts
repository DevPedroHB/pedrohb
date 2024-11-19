import { paginationQuerySchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
