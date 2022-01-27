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
export class MenuFavorite {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  user_id: string;

  @Column()
  menu_id: string;

  @CreateDateColumn()
  created_at: Date;
}
