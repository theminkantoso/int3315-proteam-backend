import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'major' })
export class Major extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  major_name: string;

  @Column()
  school_id: number;
}