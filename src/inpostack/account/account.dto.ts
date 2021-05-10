import { AccountStatus, AccountType } from "./account.meta";

export class AccountCreateDto {
  readonly name: string;
  readonly id: string;
  readonly password: string;
  readonly accountType: AccountType;
}

export class AccountUpdateDto {
  readonly name: string;
  readonly id: string;
  readonly password: string;
  readonly accountType: AccountType;
  readonly accountStatus: AccountStatus;
}
