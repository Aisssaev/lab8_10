import { NextResponse } from "next/server";
import { clientDb } from "@/app/lib/mongodb";;
import {ObjectId} from "mongodb";

// export async function GET() {
//     try {
//         const db = await clientDb;
//         const collection = db.collection('movies');
//         const data = await collection.find({}).toArray();
//
//         return NextResponse.json(data);
//     } catch (error) {
//         console.error('Error connection to db:', error);
//         return NextResponse.json(
//             { error: 'Cannot c' },
//             { status: 500 }
//         );
//     }
// }
//
// export async function POST(request: Request) {
//     try {
//         const newMovie = await request.json();
//
//         const db = await clientDb;
//         const collection = db.collection('movies');
//
//         const result = await collection.insertOne(newMovie);
//
//         return NextResponse.json({
//             ...newMovie,
//             _id: result.insertedId,
//         }, { status: 201 });
//     } catch (error) {
//         console.error('Error adding movie:', error);
//         return NextResponse.json(
//             { error: 'Cannot add the movie to the database' },
//             { status: 500 }
//         );
//     }
// }
//
// export async function DELETE(request: Request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const id = searchParams.get('id');
//         console.log(`ID: ${id}`)
//
//         if (!id) {
//             return NextResponse.json(
//                 { error: 'ID is required' },
//                 { status: 400 }
//             );
//         }
//
//         const db = await clientDb;
//         const collection = db.collection('movies');
//
//         const result = await collection.deleteOne({ _id: new ObjectId(id) });
//
//         if (result.deletedCount === 0) {
//             return NextResponse.json(
//                 { error: 'Movie not found or already deleted' },
//                 { status: 404 }
//             );
//         }
//
//         return NextResponse.json({ success: true });
//     } catch (error) {
//         console.error('Error deleting movie:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }

export async function GET() {
    try {
        const db = await clientDb;
        const moviesCollection = db.collection('movies');
        const movies = await moviesCollection.aggregate([
            {
                $lookup: {
                    from: "sessions",
                    localField: "_id",
                    foreignField: "movie",
                    as: "sessions"
                }
            },
            {
                $lookup: {
                    from: "seats",
                    localField: "sessions._id",
                    foreignField: "session",
                    as: "seats"
                }
            }
        ]).toArray();
        return NextResponse.json(movies);
    } catch (error) {
        console.error('Error connecting to db:', error);
        return NextResponse.json(
            { error: 'Cannot fetch data' },
            { status: 500 }
        );
    }
}

interface Data {
    title: string,
    posterUrl: string,
    sessions: [],
    rows: number,
    columns: number,
    seatPrice: number,
    hall: string
}

export async function POST(request: Request) {
    try {
        const { title, posterUrl, sessions, rows, columns, seatPrice, hall } : Data  = await request.json();
        const db = await clientDb;

        const moviesCollection = db.collection('movies');
        const sessionsCollection = db.collection('sessions');
        const seatsCollection = db.collection('seats');

        const movieResult = await moviesCollection.insertOne({
            title,
            posterUrl,
            sessions: []
        });
        const movieId = movieResult.insertedId;

        for (const sessionData of sessions) {
            const { day, time, hall } = sessionData;
            const sessionResult = await sessionsCollection.insertOne({
                movie: movieId,
                day,
                time,
                hall: new ObjectId(hall),
                seats: []
            });
            const sessionId = sessionResult.insertedId;

            const seats = [];
            for (let row = 1; row <= rows; row++) {
                for (let column = 1; column <= columns; column++) {
                    const seatResult = await seatsCollection.insertOne({
                        row,
                        column,
                        status: "free",
                        price: seatPrice,
                        session: sessionId
                    });
                    seats.push(seatResult.insertedId);
                }
            }

            await sessionsCollection.updateOne(
                { _id: sessionId },
                { $set: { seats } }
            );

            await moviesCollection.updateOne(
                { _id: movieId },
                { $push: { sessions: sessionId } as any }
            );
        }

        return NextResponse.json({ _id: movieId, title, posterUrl, sessions}, { status: 201 });
    } catch (error) {
        console.error("Error adding movie with sessions:", error);
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

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        const db = await clientDb;
        const moviesCollection = db.collection('movies');
        const sessionsCollection = db.collection('sessions');
        const seatsCollection = db.collection('seats');

        const movie = await moviesCollection.findOne({ _id: new ObjectId(id) });
        if (!movie) {
            return NextResponse.json(
                { error: 'Movie not found' },
                { status: 404 }
            );
        }

        for (const sessionId of movie.sessions) {
            const session = await sessionsCollection.findOne({ _id: sessionId });
            for (const seatId of session?.seats) {
                await seatsCollection.deleteOne({ _id: seatId });
            }
            await sessionsCollection.deleteOne({ _id: sessionId });
        }

        await moviesCollection.deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting movie:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}