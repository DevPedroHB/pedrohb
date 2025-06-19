import { Repository } from "@pedrohb/core-ddd";
import { Account } from "../../enterprise/entities/account";

export abstract class AccountsRepository extends Repository<Account> {}
