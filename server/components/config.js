const env = process.env;

export default {
    host: env.DB_HOST || 'localhost:27017',
    username: env.DB_USER || '',
    password: env.DB_PASSWORD || '',
    dbName: env.DB_NAME || 'campaigns',
    replicaSet: env.DB_REPLICA_SET || '',
    collection: `ecom-campaigns-${env.NODE_ENV}`,
};
