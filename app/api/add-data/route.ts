// app/api/add-movie/route.ts
import { NextResponse } from 'next/server';
import { clientDb } from '../../lib/mongodb';

export async function POST(request: Request) {
    try {
        const newMovie = await request.json();

        const db = await clientDb;
        const collection = db.collection('movies');

        const result = await collection.insertOne(newMovie);

        return NextResponse.json({
            ...newMovie,
            _id: result.insertedId,
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding movie:', error);
        return NextResponse.json(
            { error: 'Cannot add the movie to the database' },
            { status: 500 }
        );
    }
}
