import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({nullable: false})
  name: string;

  @Column({nullable: false})
  phone: string;

  @Column('text')
  desc: string; // description

  @Column()
  location: string;

  @Column()
  openTime: number;

  @Column()
  closeTime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}