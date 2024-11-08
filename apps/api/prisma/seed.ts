import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Tabela {
	tablename: string;
}

async function main() {
	const tabelas: Tabela[] = await prisma.$queryRaw`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `;

	for (const tabela of tabelas) {
		await prisma.$queryRawUnsafe(`
      TRUNCATE TABLE "${tabela.tablename}" RESTART IDENTITY CASCADE;
    `);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);

		await prisma.$disconnect();

		process.exit(1);
	});
