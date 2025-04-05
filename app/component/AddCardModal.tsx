import React, { useState } from 'react';
import { MovieCardProps } from './MovieCard';

interface ModalProps {
    onAddMovie: (movie: MovieCardProps) => void;
    onClose: () => void;
}

const AddCardModal = ({ onAddMovie, onClose }: ModalProps) => {
    const [newMovie, setNewMovie] = useState<MovieCardProps>({
        title: '',
        ageRating: '',
        posterUrl: '',
        days: [],
        showtimes: [],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMovie((prevMovie) => ({
            ...prevMovie,
            [name]: value,
        }));
    };

    const handleShowtimesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMovie((prevMovie) => ({
            ...prevMovie,
            showtimes: e.target.value.split(',').map((item) => item.trim()),
        }));
    };

    const handleSubmit = () => {
        onAddMovie(newMovie);
        setNewMovie({ title: '', ageRating: '', posterUrl: '', days: [], showtimes: [] });
    };

    const isFormValid =
        newMovie.title.trim() !== '' &&
        newMovie.ageRating.trim() !== '' &&
        newMovie.posterUrl.trim() !== '' &&
        newMovie.showtimes.length > 0 &&
        newMovie.showtimes.every((s) => s.trim() !== '');


    return (
        <div className="fixed z-60 inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
            <div className="flex flex-col bg-white/5 backdrop-blur-xl p-6 items-center rounded-lg w-[400px]">
                <h2 className="text-3xl text-center font-bold mb-4" >Добавити новий фільм</h2>
                <input
                    type="text"
                    name="title"
                    value={newMovie.title}
                    onChange={handleInputChange}
                    placeholder="Назва"
                    className="w-full mb-4 p-3 border-2 border-gray-300 focus:outline-none rounded"
                />
                <input
                    type="text"
                    name="ageRating"
                    value={newMovie.ageRating}
                    onChange={handleInputChange}
                    placeholder="Вікове обмеження"
                    className="w-full mb-4 p-3 border-2 border-gray-300 focus:outline-none rounded"
                />
                <input
                    type="text"
                    name="posterUrl"
                    value={newMovie.posterUrl}
                    onChange={handleInputChange}
                    placeholder="URL картинка"
                    className="w-full mb-4 p-3 border-2 border-gray-300 focus:outline-none rounded"
                />
                {newMovie.posterUrl && (
                    <img
                        src={newMovie.posterUrl}
                        alt="Передперегляд постера"
                        className="w-full max-h-[300px] object-contain mb-4 border border-gray-300 rounded"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = ''; // скрыть если картинка не грузится
                        }}
                    />
                )}
                <input
                    type="text"
                    name="days"
                    value={newMovie.days.join(', ')}
                    onChange={(e) =>
                        setNewMovie({ ...newMovie, days: e.target.value.split(',').map((d) => d.trim()) })
                    }
                    placeholder="Дні показу (YYYY-MM-DD, через кому)"
                    className="w-full mb-4 p-3 border-2 border-gray-300 focus:outline-none rounded"
                />
                <input
                    type="text"
                    name="showtimes"
                    value={newMovie.showtimes.join(', ')}
                    onChange={handleShowtimesChange}
                    placeholder="Час сеансів (через кому)"
                    className="w-full mb-4 p-3 border-2 border-gray-300 focus:outline-none rounded"
                />
                <div className="flex flex-row gap-10">
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className={`px-4 py-2 text-white rounded focus:outline-none cursor-pointer transition-opacity ${
                            isFormValid ? 'bg-red-500 hover:bg-red-600' : 'bg-red-300 cursor-not-allowed opacity-60'
                        }`}
                    >
                        Добавити
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white focus:outline-none hover:bg-gray-600 cursor-pointer rounded"
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCardModal;
