import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";
import {json} from "express";

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    gamers!: string;

    @Column()
    score!: string;

    @Column()
    archived!: boolean;

    @CreateDateColumn()
    startTime!: Date;

    @Column('datetime', {nullable: true})
    endTime: Date | undefined;

    @Column({nullable: true, type: 'varchar'})
    winner: string | undefined;

    createNewGame(names: Array<string>) {
        console.log('names', names);
        this.gamers = '';
        this.gamers = Buffer.from(names.sort().join('')).toString('base64');
        let score: any = {};
        names.forEach(name => {
            score[name] = 0;
        });
        this.score = JSON.stringify(score);
        this.archived = false;
        console.log('das ist die id', this.id);
        console.log('das sind die gamers jetzt', this.gamers);
    }

    upScore(name: string): boolean {
        let score = JSON.parse(this.score);
        score[name]++;
        if (score[name] === 10) {
           this.completeGame(name);
            this.score = JSON.stringify(score);
           return true;
        }
        this. score = JSON.stringify(score);
        return false;
    }

    // downScore(name: string) {
    //     this.score[name]--;
    // }

    private completeGame(name: string) {
         this.archived = true;
         this.endTime = new Date(Date.now());
         this.winner = name;
    }
}
