import { IResolvers } from 'graphql-tools';
import { Database} from "./database";
import { User } from './entity/User';
import "reflect-metadata";
import {Game} from "./entity/Game";


const database = Database.getInstance();
const uuid = require('uuid/v4');

const resolverMap: IResolvers = {
    Query: {
        helloWorld(_: void, args: void): string {
            return `👋 Hello world! 👋`;
        },
       users: () => {
            return new Promise( resolve => {
               database.connect().then(async (connection: any) => {
                  let userRepo = connection.getRepository(User);
                  let _users = await userRepo.find();
                  resolve(_users);
               });
            });
       }
    },
    Mutation: {
        createUser: (_, {name} ) => {
            let user = new User();
            user.name = name;
            user.id = uuid();
            // @ts-ignore
            return new Promise((resolve, reject) =>{
                database.connect().then(async (connection: any) => {
                    let userRepo = connection.getRepository(User);

                    let _user = await userRepo.findOne({name: name});
                    if(!_user) {
                        await userRepo.save(user);
                        console.log('user saved');
                        resolve(user);
                    } else {
                        reject(new Error('name in use, choose another!'));
                    }
                });
            });
        },
        createGame: (_, {names} ) => {
            return new Promise((resolve) =>{
                database.connect().then(async (connection: any) => {
                    let gamesRepo = connection.getRepository(Game);
                    const gamers: any = Buffer.from(names.sort().join('')).toString('base64');
                    let game = await gamesRepo.findOne({gamers: gamers, archived: false});
                    if(!game) {
                        let game = new Game();
                        game.createNewGame(names);
                        await gamesRepo.save(game);
                        console.log('user saved');
                        resolve(game);
                    }
                    resolve(game);
                });
            });
        },
        upScore: (_, {name, names} ) => {
            return new Promise((resolve) => {
                database.connect().then(async (connection: any) => {
                    let gamesRepo = connection.getRepository(Game);
                    const gamers: any = Buffer.from(names.sort().join('')).toString('base64');
                    let game = await gamesRepo.findOne({gamers: gamers, archived: false});
                    game.upScore(name);
                    await gamesRepo.save(game);
                    resolve(game.score[name]);
                });
            });
        }
    }
};
export default resolverMap;
