import { EncrypterRepository } from "@/domain/account/application/cryptography/encrypter-repository";
import { HasherRepository } from "@/domain/account/application/cryptography/hasher-repository";
import { Module } from "@nestjs/common";
import { BcryptHasherRepository } from "./bcrypt-hasher-repository";
import { JwtEncrypterRepository } from "./jwt-encrypter-repository";

@Module({
	providers: [
		{ provide: HasherRepository, useClass: BcryptHasherRepository },
		{ provide: EncrypterRepository, useClass: JwtEncrypterRepository },
	],
	exports: [HasherRepository, EncrypterRepository],
})
export class CryptographyModule {}
