import {IResolvers} from 'graphql-tools';
import {Database} from "./database";
import {User} from './entity/User';
import "reflect-metadata";
import {Game} from "./entity/Game";
import {Score} from "./entity/Score";


const database = Database.getInstance();
const uuid = require('uuid/v4');

const resolverMap: IResolvers = {
  Query: {
    helloWorld(_: void, args: void): string {
      return `👋 Hello world! 👋`;
    },
    users: () => {
      return new Promise(resolve => {
        database.connect().then(async (connection: any) => {
          let userRepo = connection.getRepository(User);
          let users = await userRepo.find({relations: ['wins']});
          resolve(users);
        });
      });
    },
    games: () => {
      return new Promise(resolve => {
        database.connect().then(async (connection: any) => {
          let gamesRepo = connection.getRepository(Game);
          let games = await gamesRepo.find();
          console.log('games', games);
          resolve(games);
        });
      });
    }
  },
  Mutation: {
    createUser: (_, {name}) => {
      let user = new User();
      user.name = name;
      // @ts-ignore
      return new Promise((resolve, reject) => {
        database.connect().then(async (connection: any) => {
          let userRepo = connection.getRepository(User);

          let _user = await userRepo.findOne({name: name});
          if (!_user) {
            await userRepo.save(user);
            console.log('user saved');
            resolve(user);
          } else {
            reject(new Error('name in use, choose another!'));
          }
        });
      });
    },
    createGame: (_, {userIds}) => {
      return new Promise((resolve) => {
        database.connect().then(async (connection: any) => {
          let gamesRepo = connection.getRepository(Game);
          let userRepo = connection.getRepository(User);
          let users: User[] = await userRepo.findByIds(userIds);
          if (users) {
            users.sort((a: User, b: User) => {
              return a.name.localeCompare(b.name);
            });
            const gamersId: any = Buffer.from(users.map((x: User) => x.name).join(', ')).toString('base64');
            let game = await gamesRepo.findOne({gamersId: gamersId, archived: false});
            if (!game) {
              let game = new Game();
              game.gamersId = gamersId;
              game.players = users;
              let scores: Score[] = [];
              users.forEach(user => {
                scores.push(new Score(user))
              });
              game.scores = scores;
              await gamesRepo.save(game);
              console.log('New game saved');
              resolve(game);
            }
            resolve(game);
          }

        });
      });
    },
    upScore: (_, {userId, gameId}) => {
      return new Promise((resolve, reject) => {
        database.connect().then(async (connection: any) => {
          let gamesRepo = connection.getRepository(Game);
          let game = await gamesRepo.findOne({id: gameId});
          if (!game) {
            reject('Game with id ' + gameId + ' not found')
          }
          game.scores.forEach(async (score: Score) => {
            if (score.user.id === userId) {
              if (score.points <= 10 && !game.archived) {
                score.points++;
                if (score.points == 10) {
                  game.completeGame(score.user);
                }
                await gamesRepo.save(game);
                resolve(game);
              } else {
                resolve(game);
              }
            }
          });
        });
      });
    },
    downScore: (_, {userId, gameId}) => {
      return new Promise((resolve, reject) => {
        database.connect().then(async (connection: any) => {
          let gamesRepo = connection.getRepository(Game);
          let game = await gamesRepo.findOne({id: gameId});
          if (!game) {
            reject('Game with id ' + gameId + ' not found')
          }
          game.scores.forEach(async (score: Score) => {
            if (score.user.id === userId) {
              score.points--;
            }
          });
          await gamesRepo.save(game);
          resolve(game);
        });
      });
    },
    deleteGame: (_, {gameId}) => {
      return new Promise((resolve, reject) => {
        database.connect().then(async (connection: any) => {
          let gamesRepo = connection.getRepository(Game);
          await gamesRepo.delete([gameId]);
          resolve(true);
        });
      });
    },
  }
};
export default resolverMap;
