import React from "react";

type MovieCardProps = {
    title: string;
    ageRating: string;
    posterUrl: string;
    showtimes: string[];
};

const MovieCard: React.FC<MovieCardProps> = ({
                                                 title,
                                                 ageRating,
                                                 posterUrl,
                                                 showtimes,
                                             }) => {
    return (
        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg group cursor-pointer">
            <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Заголовок и рейтинг (всегда видимы) */}
            <div className="absolute bottom-4 left-4 text-white z-10">
                <h3 className="text-3xl font-bold drop-shadow-md">{title}</h3>
                <span className="mt-2 inline-block bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                {ageRating}
                </span>
            </div>

            {/* Сеансы — скрыты по умолчанию, видны при наведении */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                <div className="flex flex-wrap gap-3 justify-center">
                    {showtimes.map((time, idx) => (
                        <span
                            key={idx}
                            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm transition"
                        >
                        {time}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
