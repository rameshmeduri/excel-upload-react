import { MongoClient } from 'mongodb';
import config from './config';

let COLLECTION = config.collection;

class MongoStore {
    constructor(options) {
        const instance = this;

        const username = options.username;
        const password = options.password;
        const credentials = username ? `${username}:${password}` : '';
        const replicaSet = options.replicaSet ? `replicaSet=${options.replicaSet}` : '';
        const connStrOptions = replicaSet ? `?${replicaSet}` : '';
        instance.url = `mongodb://${credentials}@${options.host}/${options.dbName}${connStrOptions}`;

        instance.dbReady = () => new Promise((resolve) => {
            if (instance.db) {
                resolve(instance.db);
                return;
            }
            MongoClient.connect(instance.url)
                .then((db) => {
                    console.info('Successfully connected to MongoDB');
                    instance.db = db;
                    resolve(instance.db);
                })
                .catch((err) => {
                    console.error('Cannot connect to MongoDB', err);
                    throw new Error('MongoDB connection error');
                });
        });
    }

    create(arr) {
        return this.dbReady().then(db => db.collection(COLLECTION)
            .insertMany(arr)
            .then(result => result));

    }
}

module.exports = (() => {
    let instance;
    return {
        getInstance(options) {
            if (!instance) {
                instance = new MongoStore(options);
            }
            return instance;
        },
    };
})();
