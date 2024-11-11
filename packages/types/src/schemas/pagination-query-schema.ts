import { z } from "zod";

export const paginationQuerySchema = z.object({
	page: z.coerce.number().default(1).optional(),
	perPage: z.coerce.number().default(10).optional(),
});

export type PaginationQuerySchema = z.infer<typeof paginationQuerySchema>;
