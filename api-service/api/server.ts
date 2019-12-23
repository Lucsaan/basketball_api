import express from 'express'; // @ts-ignore
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import compression from 'compression';
import cors from 'cors';
import schema from './schema';
import "reflect-metadata";


const app = express();
// @ts-ignore
const server = new ApolloServer({
    schema,
    validationRules: [depthLimit(7)],
});
app.use('*', cors());
app.use(compression());
server.applyMiddleware({ app, path: '/graphql' });
const httpServer = createServer(app);

// import {Game} from "./entity/Game";
// import Database from "./database";
//
// const names = ['yasin', 'julian', 'andi'];
//
// let game = new Game();
// game.createNewGame(names);
//
// Database.getInstance().connect().then( async (connection: any) => {
//     let gamesRepo = connection.getRepository(Game);
//     let _game = await gamesRepo.findOne({gamers: game.gamers, archived: false});
//     if (!_game) {
//         await gamesRepo.save(game);
//         console.log('game saved', game);
//     } else {
//         console.log('diese Spielerkonstellation gibts bereits');
//     }
//     _game.uppScore('andi');
//     await gamesRepo.save(_game);
//
// });
//

// game.uppScore('Andi');
// game.uppScore('Andi');
// game.uppScore('Andi');
// game.uppScore('Andi');







httpServer.listen(
    { port: 3000},
    (): void => console.log(`\n🚀      GraphQL is now running on http://localhost:3000/graphql`));
