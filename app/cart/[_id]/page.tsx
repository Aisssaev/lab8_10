'use client'
import React, {use, useEffect, useState} from "react";
import axios from "axios";
import { MovieCardProps } from "@/app/component/MovieCard";
import HeaderSeatplan from "@/app/component/HeaderSeatplan";
import SeatMap, { Seat } from "@/app/component/SeatMap";

export default function MoviePage() {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [sessionTime, setSessionTime] = useState<string>("");
    const [sessionDay, setSessionDay] = useState<string>("");
    const [hallInfo, setHallInfo] = useState<{name?: string, location?: string}>({});
    const [_id, setId] = useState<string>();

    // @ts-ignore
    const [movie, setMovie] = useState<MovieCardProps>();
    const totalPrice: number = selectedSeats.reduce((sum: number, s) => sum + s.price, 0);

    useEffect(() => {
        if (!sessionTime || !_id) return;

        const fetchHallInfo = async () => {
            try {
                const response = await axios.get(`/api/movies/${_id}/hall`, {
                    params: {
                        time: sessionTime
                    }
                });
                setHallInfo(response.data);
            } catch (error) {
                console.error("Error fetching hall info:", error);
            }
        };

        fetchHallInfo();
    }, [sessionTime, _id]);

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
                const seatData = response.data.seats.map((seat: any) => ({
                    ...seat,
                    price: Number(seat.price)
                }));
                setSeats(seatData);
                if (response.data.session?.day) {
                    setSessionDay(response.data.session.day);
                }
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

    function getDayOfWeek(dateString: string): string {
        const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
        const date = new Date(dateString);
        return days[date.getDay()];
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex-1 flex-row overflow-y-scroll p-6">
                <HeaderSeatplan />
                <div className={`flex flex-row h-[30vh] gap-3 mb-10`}>
                    <div className={`max-w-40 h-60 overflow-x-hidden`}>
                        <img className={`w-full h-full object-cover`} src={movie?.posterUrl}/>
                    </div>
                    <div className={`flex flex-col`}>
                        <h1 className="text-3xl text-black/75 font-bold mb-4">{movie?.title}</h1>
                        <div className={`flex flex-row gap-4`}>
                            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-gray-200 px-4 py-6 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                        <circle cx="12" cy="9" r="2.5" />
                                    </svg>
                                </div>
                                <div className="px-4 py-3">

                                    <div className="text-sm text-gray-600">Зал: {hallInfo.name}</div>
                                    <div className="font-bold text-lg">Львів, ТРЦ "Victoria Gardens"</div>
                                </div>
                            </div>
                            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-gray-200 px-4 py-6 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M8 7V3M16 7V3M4 11h16M5 20h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2z" />
                                    </svg>
                                </div>
                                <div className="px-4 py-3">
                                    <div className="text-sm text-gray-600">{sessionDay}</div>
                                    <div className="font-bold text-lg">{getDayOfWeek(sessionDay)}</div>
                                </div>
                            </div>
                            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-gray-200 px-4 py-6 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M12 6v6l4 2M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20z" />
                                    </svg>
                                </div>
                                <div className="px-4 py-3">
                                    <div className="text-sm text-gray-600">Час</div>
                                    <div className="font-bold text-lg">{sessionTime}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SeatMap seats={seats}
                         selectedSeats={selectedSeats}
                         onSeatSelection={setSelectedSeats}/>
            </div>
            <div className="w-100 bg-white border-l shadow-lg p-6 sticky top-0 h-screen flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Квитки</h2>

                    {selectedSeats.length === 0 ? (
                        <p className="text-gray-500">Немає обраних місць</p>
                    ) : (
                        <div className="space-y-3">
                            {selectedSeats.map((s, i) => (
                                <div key={i} className="border-gray-50 px-3 py-8 rounded-xl shadow-sm bg-gray-100 relative">
                                    <button
                                        onClick={() => setSelectedSeats(prev => prev.filter(seat => !(seat.row === s.row && seat.column === s.column)))}
                                        className="absolute top-1 right-1 text-gray-500 bg-gray-300 rounded-full p-1 cursor-pointer hover:text-red-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div className="flex justify-between px-6 items-start">
                                        <div className={`flex flex-row gap-5`}>
                                            <p className="font-medium">{s.row} ряд</p>
                                            <p className="font-medium">{s.column} місце</p>
                                        </div>
                                        <p className="font-bold">{s.price} грн</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Всього:</span>
                        <span className="font-bold">{totalPrice} грн</span>
                    </div>
                    <button className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 font-medium">
                        Продовжити
                    </button>
                </div>
            </div>
        </div>
    );
}
