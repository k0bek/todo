import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  text!: string;

  @Column({ default: false })
  is_checked!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @Column()
  order_position!: number;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user!: User;
}
