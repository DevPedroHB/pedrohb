import { Repository } from "@pedrohb/core-ddd";
import { Token } from "../../enterprise/entities/token";

export abstract class TokensRepository extends Repository<Token> {}
