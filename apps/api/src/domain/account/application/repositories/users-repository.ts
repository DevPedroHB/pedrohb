import { Repository } from "@pedrohb/core-ddd";
import { User } from "../../enterprise/entities/user";

export abstract class UsersRepository extends Repository<User> {}
