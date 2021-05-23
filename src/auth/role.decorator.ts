import { SetMetadata } from "@nestjs/common";
import { AccountType } from "../inpostack/account/account.meta";

export const AccountTypes = (...types: AccountType[]) => SetMetadata("account_types", types);
