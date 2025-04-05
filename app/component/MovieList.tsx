import MovieCard, {MovieCardProps} from "@/app/component/MovieCard";
import {ChevronLeft, ChevronRight} from "lucide-react";
import React, {useRef} from "react";

interface MovieListProps {
    cards: MovieCardProps[]
}

function MovieList({cards}: MovieListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollAmount = 470;

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

    return(
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
                {cards.map((movie, idx) => (
                    <div key={idx} className="min-w-[18rem] flex-shrink-0">
                        <MovieCard {...movie} />
                    </div>
                ))}
            </div>
        </main>
    )
}

export default MovieList;