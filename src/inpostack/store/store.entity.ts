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
  description: string; // description

  @Column()
  location: string;

  @Column()
  open_time: number;

  @Column()
  close_time: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}