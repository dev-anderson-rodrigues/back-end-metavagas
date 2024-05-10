import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Vacancy, VacancyToTechnology } from './index';

@Entity('technology')
export class Technology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
  tecName: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
  creatorsName: string;

  @CreateDateColumn({ default: new Date() })
  createAt: Date;

  @UpdateDateColumn({ default: new Date() })
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  // @OneToMany(() => VacancyToTechnology, (type) => type.technology)
  // technology: VacancyToTechnology[];
  @ManyToMany((type) => Vacancy, (vacancy) => vacancy.technologies)
  vacancies: Vacancy[];
}
