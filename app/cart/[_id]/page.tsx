'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MovieCardProps } from "@/app/component/MovieCard";
import HeaderSeatplan from "@/app/component/HeaderSeatplan";
import SeatMap, { Seat } from "@/app/component/SeatMap";

interface PageProps {
    params: {
        _id: string;
        time: string;
    };
}

export default function MoviePage() {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [sessionTime, setSessionTime] = useState<string>(""); // Время сеанса
    const [_id, setId] = useState<string>();

    // @ts-ignore
    const [movie, setMovie] = useState<MovieCardProps>();

    useEffect(() => {
        setSessionTime(localStorage.getItem("time") || "");
        setId(localStorage.getItem("id") || "");
        const fetchMovie = async () => {
            const response = await axios.get(`/api/movies/${_id}`);
            const movieData = response.data;
            setMovie(movieData);
        };

        if (_id) fetchMovie();
    }, [_id]);

    useEffect(() => {
        if (!sessionTime) return;

        const fetchSeats = async () => {
            try {
                const response = await axios.get(`/api/movies/${_id}/seats/${sessionTime}`, {
                    params: {
                        id: _id,
                        time: sessionTime
                    }
                });
                const seatData = response.data.seats;
                setSeats(seatData);
            } catch (error) {
                console.error("Error fetching seats:", error);
            }
        };

        fetchSeats();
    }, [sessionTime, _id]);

    useEffect(() => {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        };
    }, []);

    console.log(seats)

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Левая часть */}
            <div className="flex-1 overflow-y-scroll p-6">
                <HeaderSeatplan />
                <h1 className="text-3xl font-bold mb-4">{movie?.title}</h1>
                <SeatMap seats={seats} />
            </div>

            {/* Правая часть */}
            <div className="w-80 bg-white border-l shadow-lg p-6 sticky top-0 h-screen flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Квитки</h2>
                    <p>0 квитків, 0 грн</p>
                    <h2 className="text-xl font-semibold mt-6 mb-2">Товари бару</h2>
                    <p>0 шт., 0 грн</p>
                </div>

                <div>
                    <p className="text-lg font-semibold mb-2">Всього до сплати: 0 грн</p>
                    <button className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700">
                        Продовжити
                    </button>
                </div>
            </div>
        </div>
    );
}
