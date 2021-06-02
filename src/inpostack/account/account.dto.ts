import { AccountStatus, AccountType } from "./account.meta";
import {ApiProperty} from "@nestjs/swagger";

export class AccountCreateDto {
  @ApiProperty({type: String, description: 'user email'})
  readonly email: string;
  @ApiProperty({type: String, description: 'user name'})
  readonly name: string;
  @ApiProperty({type: String, description: 'user id'})
  readonly id: string;
  @ApiProperty({type: String, description: 'user password'})
  readonly password: string;
  @ApiProperty({type: String, description: 'user account type(USER/STORE-OWNER/ADMIN)'})
  readonly account_type: AccountType;
  @ApiProperty({type: String, description: 'user account status(DEACTIVATED/ACTIVATED/BANNED)'})
  readonly account_status?: AccountStatus;
}

export class AccountUpdateDto {
  @ApiProperty({type: String, description: 'user email'})
  readonly email: string;
  @ApiProperty({type: String, description: 'user name'})
  readonly name: string;
  @ApiProperty({type: String, description: 'user id'})
  readonly id: string;
  @ApiProperty({type: String, description: 'user password'})
  readonly password: string;
  @ApiProperty({type: String, description: 'user account type(USER/STORE-OWNER/ADMIN)'})
  readonly account_type: AccountType;
  @ApiProperty({type: String, description: 'user account status(DEACTIVATED/ACTIVATED/BANNED)'})
  readonly account_status: AccountStatus;
}
