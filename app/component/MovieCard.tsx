import React from "react";
import { useRouter } from "next/navigation";

export interface MovieCardProps {
    _id?: string;
    title: string;
    ageRating: string;
    posterUrl: string;
    sessions: {
        day: string;
        time: string;
    }[];
}

function MovieCard({_id, title, ageRating, posterUrl, sessions}: MovieCardProps) {
    const router = useRouter();

    const handleTimeClick = (time: string) => {
        const movieSlug = encodeURIComponent(_id?.toLowerCase().replace(/\s+/g, "-") || "");
        localStorage.setItem("time", time);
        localStorage.setItem("id", _id || "");
        router.push(`/cart/${movieSlug}`);
    };

    return (
        <div className="relative h-[85vh] overflow-hidden rounded-2xl shadow-lg group cursor-pointer">
            <div className={`overflow-x-hidden max-w-80 h-full`}>
                <img
                    src={posterUrl}
                    alt={title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white z-10">
                <div className={`flex flex-col items-center`}>
                    <h3 className="text-3xl font-bold drop-shadow-md whitespace-nowrap">{title}</h3>
                    <span className="mt-2 inline-block bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {ageRating}
                    </span>
                </div>
            </div>

            <div className="absolute inset-0 backdrop-blur-lg bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end z-20">
                <div className={`flex flex-col items-center`}>
                    <span className={`mb-5 text-xl`}>Розклад сеансів</span>
                    <div className="mb-60 flex flex-wrap gap-3 justify-center">
                        {sessions?.map((session, idx) => (
                            <span
                                key={idx}
                                onClick={() => handleTimeClick(session.time)}
                                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition"
                            >
                                {session.time}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={`mb-3 flex flex-col items-center`}>
                    <h3 className="text-3xl font-bold drop-shadow-md">{title}</h3>
                    <span className="mt-2 inline-block bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {ageRating}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;
