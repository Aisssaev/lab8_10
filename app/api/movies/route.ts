import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';
import {clientDb} from "@/app/lib/mongodb";

export async function GET() {
    try {
        const db = await clientDb;
        const collection = db.collection('movies');
        const data = await collection.find({}).toArray();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error connection to db:', error);
        return NextResponse.json(
            { error: 'Cannot c' },
            { status: 500 }
        );
    }
}

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

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        console.log(`ID: ${id}`)

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        const db = await clientDb;
        const collection = db.collection('movies');

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Movie not found or already deleted' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting movie:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}