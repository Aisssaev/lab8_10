// app/api/add-movie/route.ts
import { NextResponse } from 'next/server';
import { clientDb } from '../../lib/mongodb';

export async function POST(request: Request) {
    try {
        const newMovie = await request.json(); // Получаем тело запроса (новый фильм)

        const db = await clientDb;
        const collection = db.collection('movies');

        // Добавляем новый фильм в коллекцию
        const result = await collection.insertOne(newMovie);

        // Возвращаем добавленный фильм с id
        return NextResponse.json({
            ...newMovie, // Возвращаем переданные данные фильма
            _id: result.insertedId, // Добавляем новый _id, сгенерированный MongoDB
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding movie:', error);
        return NextResponse.json(
            { error: 'Cannot add the movie to the database' },
            { status: 500 }
        );
    }
}
