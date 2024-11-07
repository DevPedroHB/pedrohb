import { EncrypterRepository } from "@/domain/account/application/cryptography/encrypter-repository";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtEncrypterRepository implements EncrypterRepository {
	constructor(private jwtService: JwtService) {}

	encrypt(payload: Record<string, unknown>) {
		return this.jwtService.signAsync(payload);
	}
}
