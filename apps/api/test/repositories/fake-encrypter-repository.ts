import { AuthenticationTokenPayload } from "@/shared/types/auth-token-payload";
import { EncrypterRepository } from "@pedrohb/core-ddd";

export class FakeEncrypterRepository extends EncrypterRepository<AuthenticationTokenPayload> {}
