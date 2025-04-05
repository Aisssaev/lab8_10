import MovieCard, {MovieCardProps} from "@/app/component/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";

interface MovieListProps {
    movies: MovieCardProps[];
}

function MovieList({ movies }: MovieListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollAmount = 470;

    const today = new Date().toISOString().split("T")[0];
    console.log(movies)
    const moviesToday = movies?.filter((movie) => movie.days?.includes(today));

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
                            title={movie.title}
                            ageRating={movie.ageRating}
                            posterUrl={movie.posterUrl}
                            days={movie.days}
                            showtimes={movie.showtimes}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}

export default MovieList;
