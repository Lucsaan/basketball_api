import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Connection, ManyToOne
} from "typeorm";
import {User} from "./User";
import {Score} from "./Score";

@Entity()
export class Game {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  gamersId!: string;

  @ManyToMany(type => User, user => user.games, {eager: true, cascade: true})
  @JoinTable()
  players!: User[];

  @OneToMany(type => Score, score => score.game, {eager: true, cascade: true})
  scores!: Score[];

  @Column()
  archived!: boolean;

  @CreateDateColumn()
  startTime!: Date;

  @Column('datetime', {nullable: true})
  endTime: Date | undefined;

  @ManyToOne(type => User, {eager: true, cascade: true, nullable: true})
  @JoinTable()
  winner: User | undefined;

  constructor() {
    this.startTime = new Date(Date.now());
    this.archived = false;
    this.gamersId = '';
  }

  public completeGame(user: User) {
    this.archived = true;
    this.endTime = new Date(Date.now());
    this.winner = user;
  }
}
