// app/api/halls/route.ts
import { NextResponse } from 'next/server';
import {clientDb} from "@/app/lib/mongodb";


export async function GET() {
    try {
        const db = await clientDb;
        const hallsCollection = db.collection('halls');

        const halls = await hallsCollection.find().toArray();

        return NextResponse.json(halls);
    } catch (error) {
        console.error('Error fetching halls:', error);
        return NextResponse.json({ error: 'Не вдалося отримати зали' }, { status: 500 });
    }
}
