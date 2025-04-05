import { NextResponse } from 'next/server';
import { clientDb } from '../../lib/mongodb';

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