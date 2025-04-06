import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { clientDb } from "@/app/lib/mongodb";

interface Params {
    params: {
        id: string;
    };
}

export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid or missing ID" },
                { status: 400 }
            );
        }

        const db = await clientDb;
        const collection = db.collection("movies");

        const movie = await collection.findOne({ _id: new ObjectId(id) });

        if (!movie) {
            return NextResponse.json(
                { error: "Movie not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(movie);
    } catch (error) {
        console.error("Error fetching movie by ID:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
