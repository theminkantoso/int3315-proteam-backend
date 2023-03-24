import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true })
    createdBy: number;

    @Column('int', { nullable: true })
    updatedBy: number;

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;
}
