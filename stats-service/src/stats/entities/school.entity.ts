import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'school' })
export class School extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  school_name: string;

}