import { AccountStatus, AccountType } from './account.meta';
import { ApiProperty } from '@nestjs/swagger';

export class AccountCreateDto {
  @ApiProperty({ type: String, description: 'keycloak id' })
  readonly keycloak_id?: string;
  @ApiProperty({ type: String, description: 'user email' })
  readonly email: string;
  @ApiProperty({ type: String, description: 'user name' })
  readonly name: string;
  @ApiProperty({
    enum: AccountType,
    description: 'user account type(USER/STORE-OWNER/ADMIN)',
  })
  readonly account_type: AccountType;
  @ApiProperty({
    enum: AccountStatus,
    description: 'user account status(DEACTIVATED/ACTIVATED/BANNED)',
  })
  readonly account_status?: AccountStatus;
}

export class AccountUpdateDto {
  @ApiProperty({ type: String, description: 'user email' })
  readonly email: string;
  @ApiProperty({ type: String, description: 'user name' })
  readonly name: string;
  @ApiProperty({
    enum: AccountType,
    description: 'user account type(USER/STORE-OWNER/ADMIN)',
  })
  readonly account_type: AccountType;
  @ApiProperty({
    enum: AccountStatus,
    description: 'user account status(DEACTIVATED/ACTIVATED/BANNED)',
  })
  readonly account_status: AccountStatus;
}

export class AccountRegisterDto {
  @ApiProperty({ type: String, description: 'keycloak id' })
  readonly keycloak_id: string;
  @ApiProperty({ type: String, description: 'user email' })
  readonly email: string;
  @ApiProperty({ type: String, description: 'user name' })
  readonly name: string;
}
