import { Repository } from "@/repositories/repository";
import type { UserAggregate } from "@tests/entities/user-aggregate";

export abstract class UsersRepository extends Repository<UserAggregate> {}
