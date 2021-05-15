import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { AccountStatus, AccountType } from "./account.meta";

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({nullable: true})
  email: string;

  @Column({nullable: false})
  name: string;

  @Column({nullable: false})
  id: string;

  @Column({nullable: false})
  password: string;

  @Column({nullable: false})
  accountType: AccountType;

  @Column({nullable: false, default: AccountStatus.deactivated})
  accountStatus: AccountStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  lastLoginAt: Date;
}