import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { StoreType } from "./store.meta";
import { Category } from "../category/category.entity";

@Entity()
export class Store {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column("text")
  description: string;

  @Column({ nullable: false, default: StoreType.etc })
  store_type: StoreType;

  @Column({ nullable: false })
  location: string;

  @Column({ nullable: false })
  open_time: number;

  @Column({ nullable: false })
  close_time: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * Database Relationship
   */

  @OneToMany(() => Category, category => category.store)
  category: Category[];
}