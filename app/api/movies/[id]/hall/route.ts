import { NextResponse } from 'next/server';
import { clientDb } from "@/app/lib/mongodb";
import { ObjectId } from 'mongodb';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const { id } = awaitedParams;
        const { searchParams } = new URL(request.url);
        const time = searchParams.get('time');

        if (!time) {
            return NextResponse.json(
                { error: 'Time parameter is required' },
                { status: 400 }
            );
        }

        const db = await clientDb;
        const sessionsCollection = db.collection('sessions');
        const hallsCollection = db.collection('halls');

        const session = await sessionsCollection.findOne({
            movie: new ObjectId(id),
            time: time
        });

        if (!session) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }

        const hall = await hallsCollection.findOne({
            _id: session.hall
        });

        console.log(hall)

        if (!hall) {
            return NextResponse.json(
                { error: 'Hall not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(hall);
    } catch (error) {
        console.error('Error fetching hall info:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hall information' },
            { status: 500 }
        );
    }
}