// lib/mongodb.ts
import { MongoClient } from 'mongodb';

// Строка подключения к вашей MongoDB
const MONGODB_URI = 'mongodb://localhost:27017'; // Локальный сервер MongoDB
const MONGODB_DB = 'neoplex'; // Имя базы данных

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // В режиме разработки используем глобальную переменную для избежания повторных подключений
    if (!(global as any)._mongoClientPromise) {
        (global as any)._mongoClientPromise = MongoClient.connect(MONGODB_URI);
    }
    clientPromise = (global as any)._mongoClientPromise;
} else {
    // В продакшн-режиме создаем новое подключение
    clientPromise = MongoClient.connect(MONGODB_URI);
}

export const clientDb = clientPromise.then(client => client.db(MONGODB_DB));
