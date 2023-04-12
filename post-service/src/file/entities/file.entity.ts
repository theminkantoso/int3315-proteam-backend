import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'files' })
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  file_name: string;

  @Column({ length: 255, nullable: false })
  original_name: string;

  @Column({ length: 255, nullable: false })
  path: string;

  @Column({ length: 255, nullable: false })
  extension: string;

  @Column({ length: 255, nullable: false })
  mimetype: string;

  @Column({ nullable: false })
  size: number;
}
