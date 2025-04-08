import { NextResponse } from 'next/server';
import { clientDb } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const awaitedParams = await Promise.resolve(params);
        const { id } = awaitedParams;
        console.log("SEAT: " + id)
        const body = await request.json();
        const { sessionTime, seats } = body;

        if (!sessionTime || !seats || !Array.isArray(seats)) {
            return NextResponse.json(
                { error: 'Недостатньо даних для оновлення місць' },
                { status: 400 }
            );
        }

        const db = await clientDb;
        const sessionsCollection = db.collection('sessions');
        const seatsCollection = db.collection('seats');

        const session = await sessionsCollection.findOne({
            movie: new ObjectId(id),
            time: sessionTime
        });

        if (!session) {
            return NextResponse.json({ error: 'Сесію не знайдено' }, { status: 404 });
        }

        const sessionId = session._id;

        for (const seat of seats) {
            await seatsCollection.updateOne(
                {
                    _id: new ObjectId(seat._id),
                    session: sessionId
                },
                { $set: { status: 'taken' } }
            );
        }

        return NextResponse.json({ message: 'Місця успішно оновлено' });
    } catch (error) {
        console.error('Помилка при оновленні місць:', error);
        return NextResponse.json(
            { error: 'Не вдалося оновити місця' },
            { status: 500 }
        );
    }
}
