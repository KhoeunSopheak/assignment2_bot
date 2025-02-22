import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity('class')
export class Class {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: 'varchar', length: 100 })
  class_name: string;

  @Column({ type: 'varchar', length: 100 })
  subject: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.class)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher | null;
}
