import MovieCard, {MovieCardProps} from "@/app/component/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, {useEffect, useRef, useState} from "react";

interface MovieListProps {
    movies: MovieCardProps[];
}

function MovieList({ movies }: MovieListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollAmount = 470;

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const moviesToday = movies
        .map((movie) => {
            const futureSessions = movie.sessions?.filter((session) => {
                if (session.day !== today) return false;

                const [hours, minutes] = session.time.split(":").map(Number);
                const sessionDateTime = new Date();

                sessionDateTime.setHours(hours);
                sessionDateTime.setMinutes(minutes);
                sessionDateTime.setSeconds(0);
                sessionDateTime.setMilliseconds(0);

                return sessionDateTime > now;
            });

            if (futureSessions.length > 0) {
                return { ...movie, sessions: futureSessions };
            }

            return null;
        })
        .filter((movie): movie is MovieCardProps => movie !== null);


    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <main className="relative px-6 h-[80vh] py-5">
            <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/5 rounded-full p-2 shadow-md transition-transform hover:scale-110 cursor-pointer hover:bg-white/10"
                onClick={scrollLeft}
            >
                <ChevronLeft size={40} />
            </button>

            <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/5 rounded-full p-2 shadow-md transition-transform hover:scale-110 cursor-pointer hover:bg-white/10"
                onClick={scrollRight}
            >
                <ChevronRight size={40} />
            </button>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
            >
                {moviesToday?.map((movie, idx) => (
                    <div key={movie?._id} className="min-w-[18rem] flex-shrink-0">
                        <MovieCard
                            _id={movie._id}
                            title={movie.title}
                            ageRating={movie.ageRating}
                            posterUrl={movie.posterUrl}
                            sessions={movie.sessions}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}

export default MovieList;
