import MovieCard, { MovieCardProps } from "@/app/component/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useRef } from "react";
import AddCardModal from "@/app/component/AddCardModal";


interface MovieListProps {
    cards: MovieCardProps[];
    onAddMovie: (movie: MovieCardProps) => void;
}

function MovieListEmpty({ cards, onAddMovie }: MovieListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleAddMovie = (movie: MovieCardProps) => {
        onAddMovie(movie);
        setIsModalOpen(false);
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
                {cards.map((movie, idx) => (
                    <div key={idx} className="min-w-[18rem] flex-shrink-0">
                        <MovieCard {...movie} />
                    </div>
                ))}

                <div
                    onClick={() => setIsModalOpen(true)}
                    className="min-w-[18rem] flex-shrink-0 flex items-center justify-center bg-white/10 rounded-2xl cursor-pointer object-cover transition-transform group"
                >
                    <span className="bg-white/10 p-7 px-10 opacity-40 rounded-full text-6xl group-hover:opacity-100 duration-300 group-hover:bg-white/30">+</span>
                </div>
            </div>

            {/* Модальное окно */}
            {isModalOpen && <AddCardModal onAddMovie={handleAddMovie} onClose={() => setIsModalOpen(false)} />}
        </main>
    );
}

export default MovieListEmpty;
