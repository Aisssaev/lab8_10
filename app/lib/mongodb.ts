// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017';
const MONGODB_DB = 'neoplex';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    if (!(global as any)._mongoClientPromise) {
        (global as any)._mongoClientPromise = MongoClient.connect(MONGODB_URI);
    }
    clientPromise = (global as any)._mongoClientPromise;
} else {
    clientPromise = MongoClient.connect(MONGODB_URI);
}

export const clientDb = clientPromise.then(client => client.db(MONGODB_DB));
