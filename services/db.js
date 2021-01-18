const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const faker = require('faker');
const lodashId = require('lodash-id');

class Database {
    constructor() {
        const adapter = new FileSync('./db.json');
        this.db  = low(adapter);
        this.db._.mixin(lodashId);

        this.db.defaults(this.defaultData()).write();
    }

    defaultData() {
        const posts = [];
        for(let i=1; i < 20; i++) {
            posts.push({
                id: i, 
                userId: faker.random.number({min: 1, max: 2}), 
                title: faker.lorem.words(5), 
                body: faker.lorem.lines(5), 
                createdAt: new Date()
            });
        }
        return {
            posts,
            users: [
                { id: 1, username: 'megas', password: 'q1w2e3', token: "7e81605" },
                { id: 2, username: 'anton ', password: 'qwerty', token: "824f9ff" },
            ]
        }
    }

    getDb() {
        return this.db;
    }


}

const db = new Database();

module.exports = db;