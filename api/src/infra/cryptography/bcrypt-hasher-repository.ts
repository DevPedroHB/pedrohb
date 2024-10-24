import { HasherRepository } from "@/domain/account/application/cryptography/hasher-repository";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";

@Injectable()
export class BcryptHasherRepository implements HasherRepository {
  private HASH_SALT_LENGTH = 10;

  async hash(plain: string) {
    return await hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hash: string) {
    return await compare(plain, hash);
  }
}
