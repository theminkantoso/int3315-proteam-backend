import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'skill' })
export class Skill extends BaseEntity {

  @PrimaryGeneratedColumn()
  skill_id: number;

  @Column()
  skill_name: string;
}