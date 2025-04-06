'use client'
import { notFound } from 'next/navigation';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {MovieCardProps} from "@/app/component/MovieCard";
import Header from "@/app/component/Header";
import HeaderSeatplan from "@/app/component/HeaderSeatplan";

interface PageProps {
    params: {
        _id: string;
    };
}

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
        <div className={`grid grid-cols-3`}>
            <div className={`col-span-2`}>
                <HeaderSeatplan></HeaderSeatplan>
            </div>
            <div className={``}>
                <div className={`w-[32rem]`}>
                    <h1>
                        saddas
                    </h1>
                </div>
            </div>
            {/*<h1 className="text-4xl font-bold">Фільм: {movie?.title}</h1>*/}
        </div>
    );
}