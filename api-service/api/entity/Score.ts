import {User} from "./User";
import {Game} from "./Game";
import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity(
)
export class Score {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, user => user.scores, {eager: true, cascade: true})
  user!: User;

  @ManyToOne(type => Game, game => game.scores)
  game!: Game;

  @Column()
  points!: number;



  constructor(user: User) {
    this.user = user;
    this.points = 0;
  }

  public addPoint (): number {
    return ++this.points;
  }

  public subtractPoint (): number {
    return --this.points;
  }
}