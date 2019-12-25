import {Entity, Column, PrimaryColumn, ManyToMany, JoinTable, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {Game} from "./Game";
import {Score} from "./Score";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToMany(type => Game, game => game.players)
    games!: Game[];

    @OneToMany(type => Score, score => score.user)
    scores!: Score[];

    @OneToMany(type => Game, game => game.winner)
    wins!: Game[]
}
