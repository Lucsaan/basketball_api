import {createConnection} from "typeorm";
import "reflect-metadata";


export class Database {

    private static instance: Database;
    private connection: any;

    private constructor() {
        this.connection = createConnection({
            type: "mysql",
            host: "db",
            port: 3306,
            username: "mydb",
            password: "3QgHYfFNcfbyhMyTnMKkxUwm",
            database: "mydb",
            entities: [
                __dirname + "/entity/*.ts"
            ],
            synchronize: true,
            logging: false
        });
        console.log('Database connection established');
    }

    static getInstance(): Database {
        if(!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    connect() {
        return this.connection;
    }
}

export default Database;
