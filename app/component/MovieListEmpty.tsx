import MovieCard, { MovieCardProps } from "@/app/component/MovieCard";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import React, { useState, useRef } from "react";
import AddCardModal from "@/app/component/AddCardModal";

interface MovieListProps {
    cards: MovieCardProps[];
    onAddMovie: (movie: MovieCardProps) => void;
    onDeleteMovie?: (index: number) => void;
}

function MovieListEmpty({ cards, onAddMovie, onDeleteMovie }: MovieListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollAmount = 470;

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    const handleAddMovie = (movie: MovieCardProps) => {
        onAddMovie(movie);
        setIsModalOpen(false);
    };

    const handleConfirmDelete = () => {
        if (confirmDeleteIndex !== null && onDeleteMovie) {
            onDeleteMovie(confirmDeleteIndex);
        }
        setConfirmDeleteIndex(null);
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
                    <div
                        key={idx}
                        className="relative min-w-[18rem] flex-shrink-0 group"
                    >
                        <MovieCard {...movie} />
                        <button
                            onClick={() => setConfirmDeleteIndex(idx)}
                            className="absolute z-30 top-2 right-2 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            title="Видалити"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                <div
                    onClick={() => setIsModalOpen(true)}
                    className="min-w-[18rem] flex-shrink-0 flex items-center justify-center bg-white/10 rounded-2xl cursor-pointer object-cover transition-transform group"
                >
                    <span className="bg-white/10 p-7 px-10 opacity-40 rounded-full text-6xl group-hover:opacity-100 duration-300 group-hover:bg-white/30">+</span>
                </div>
            </div>

            {isModalOpen && (
                <AddCardModal
                    onAddMovie={handleAddMovie}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {confirmDeleteIndex !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 w-[300px] shadow-xl text-center">
                        <h2 className="text-2xl font-semibold mb-4">Видалити фільм?</h2>
                        <p className="text-lg text-white/80 mb-6">Ви впевнені, що хочете видалити цей фільм?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                                onClick={handleConfirmDelete}
                            >
                                Видалити
                            </button>
                            <button
                                className="bg-gray-400 px-4 py-2 rounded-md hover:bg-gray-500 cursor-pointer"
                                onClick={() => setConfirmDeleteIndex(null)}
                            >
                                Скасувати
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default MovieListEmpty;
