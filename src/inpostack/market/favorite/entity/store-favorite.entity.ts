import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Create when user click 'favorite' button.
// If user removes from the 'favorite' list,
// then delete the entity.
@Entity()
export class StoreFavorite {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  user_id: string;

  @Column()
  store_id: string;

  @CreateDateColumn()
  created_at: Date;
}
