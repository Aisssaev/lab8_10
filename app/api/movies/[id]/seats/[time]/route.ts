import { NextResponse } from 'next/server';
import { clientDb } from "@/app/lib/mongodb";
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { id: string; time: string } }) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const { id, time } = awaitedParams;

        console.log(`Fetching session for movie ID: ${id} and time: ${time}`);

        const db = await clientDb;
        const sessionsCollection = db.collection('sessions');
        const seatsCollection = db.collection('seats');

        const session = await sessionsCollection.findOne({
            "movie": new ObjectId(id),
            "time": time
        });

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        const seats = await seatsCollection.find({
            "session": session._id
        }).toArray();

        if (seats.length === 0) {
            console.log('No seats found for session:', session._id);
        }

        return NextResponse.json({
            session: {
                id: session._id,
                day: session.day,
                time: session.time
            },
            seats
        });

    } catch (error) {
        console.error('Error fetching seats:', error);
        return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 });
    }
}