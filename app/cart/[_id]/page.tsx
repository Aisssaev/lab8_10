'use client'
import React, {useEffect, useState} from "react";
import axios from "axios";
import {MovieCardProps} from "@/app/component/MovieCard";
import HeaderSeatplan from "@/app/component/HeaderSeatplan";
import SeatMap, {Seat} from "@/app/component/SeatMap";

interface PageProps {
    params: {
        _id: string;
    };
}

const seatData: Seat[] = [
    { row: 0, column: 0, status: "free", price: 170 },
    { row: 0, column: 1, status: "taken", price: 170 },
    { row: 0, column: 2, status: "free", price: 280 },
    { row: 1, column: 0, status: "free", price: 170 },
];


export default function MoviePage({ params }: PageProps) {
    useEffect(() => {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        };
    }, []);

    // @ts-ignore
    const _id = React.use(params)._id;
    const [movie, setMovie] = useState<MovieCardProps>();


    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/movies/${_id}`);
            const result = response.data;
            setMovie(result);
        }

        if (_id) fetchData();
    }, [_id]);

    return (
        // <div className={`grid grid-cols-3`}>
        //     <div className={`col-span-2 border-r-gray-300 border-b-gray-300 border-b-1 border-r-1 pb-4`}>
        //         <HeaderSeatplan></HeaderSeatplan>
        //     </div>
        //     <div className={``}>
        //         <div className={`w-[32rem]`}>
        //             <h1>
        //                 saddas
        //             </h1>
        //         </div>
        //     </div>
        //     {/*<h1 className="text-4xl font-bold">Фільм: {movie?.title}</h1>*/}
        // </div>
        <div className="flex h-screen overflow-hidden">
            {/* Левая часть */}
            <div className="flex-1 overflow-y-scroll p-6">
                <HeaderSeatplan />
                <h1 className="text-3xl font-bold mb-4">{movie?.title}</h1>
                <div className="mb-4">
                </div>
                <SeatMap seats={seatData}></SeatMap>
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