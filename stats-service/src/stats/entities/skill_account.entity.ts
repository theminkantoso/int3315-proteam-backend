import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'skill_account' })
export class SkillAccount extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  skill_id: number;

  @Column()
  account_id: number;
}