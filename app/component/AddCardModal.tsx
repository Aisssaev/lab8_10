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
        setNewMovie({ title: '', ageRating: '', posterUrl: '', showtimes: [] });
    };

    return (
        <div className="fixed z-60 inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[400px]">
                <h2 className="text-xl mb-4">Добавити новий фільм</h2>
                <input
                    type="text"
                    name="title"
                    value={newMovie.title}
                    onChange={handleInputChange}
                    placeholder="Назва"
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="ageRating"
                    value={newMovie.ageRating}
                    onChange={handleInputChange}
                    placeholder="Вікове обмеження"
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="posterUrl"
                    value={newMovie.posterUrl}
                    onChange={handleInputChange}
                    placeholder="URL картинка"
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="showtimes"
                    value={newMovie.showtimes.join(', ')}
                    onChange={handleShowtimesChange}
                    placeholder="Час сеансів (через кому)"
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
                <div className="flex justify-between">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Добавити
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCardModal;
