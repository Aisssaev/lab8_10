import React, { useState } from 'react';
import { MovieCardProps } from './MovieCard';

interface ModalProps {
    onAddMovie: (movie: MovieCardProps) => void;
    onClose: () => void;
}

const AddCardModal = ({ onAddMovie, onClose }: ModalProps) => {
    const [newMovie, setNewMovie] = useState<{
        title: string;
        description: string;
        posterUrl: string;
        sessions: { day: string, time: string }[];
        rows: number;
        columns: number;
        seatPrice: number;
        ageRating: string;
    }>({
        title: '',
        description: '',
        posterUrl: '',
        sessions: [],
        rows: 5,
        columns: 8,
        seatPrice: 120,
        ageRating: ''
    });

    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const defaultTime = new Date(now.getTime() + 2 * 60 * 60 * 1000) // +2 години
        .toTimeString()
        .slice(0, 5);

    const [sessionDay, setSessionDay] = useState(defaultDate);
    const [sessionTime, setSessionTime] = useState(defaultTime);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMovie((prevMovie) => ({
            ...prevMovie,
            [name]: value,
        }));
    };

    const handleAddSession = () => {
        if (sessionDay && sessionTime) {
            setNewMovie((prev) => ({
                ...prev,
                sessions: [...prev.sessions, { day: sessionDay, time: sessionTime }]
            }));
            setSessionDay('');
            setSessionTime('');
        }
    };

    const handleSubmit = () => {
        onAddMovie(newMovie);
        setNewMovie({
            title: '',
            description: '',
            posterUrl: '',
            sessions: [],
            rows: 5,
            columns: 8,
            seatPrice: 120,
            ageRating: ''
        });
    };

    const isFormValid =
        newMovie.title.trim() !== '' &&
        newMovie.description.trim() !== '' &&
        newMovie.posterUrl.trim() !== '' &&
        newMovie.sessions.length > 0;

    return (
        <div className="fixed z-60 inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
            <div className="flex flex-col bg-white/5 backdrop-blur-xl p-6 items-center rounded-lg w-[400px]">
                <h2 className="text-3xl text-center font-bold mb-4">Добавити новий фільм</h2>
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
                    name="description"
                    value={newMovie.description}
                    onChange={handleInputChange}
                    placeholder="Опис"
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
                            (e.target as HTMLImageElement).src = '';
                        }}
                    />
                )}
                <input
                    type="number"
                    name="rows"
                    value={newMovie.rows}
                    onChange={handleInputChange}
                    placeholder="Кількість рядів"
                    className="w-full mb-4 p-3 border-2 border-gray-300 focus:outline-none rounded"
                />
                <input
                    type="number"
                    name="columns"
                    value={newMovie.columns}
                    onChange={handleInputChange}
                    placeholder="Кількість місць у ряду"
                    className="w-full mb-4 p-3 border-2 border-gray-300 focus:outline-none rounded"
                />
                <input
                    type="number"
                    name="seatPrice"
                    value={newMovie.seatPrice}
                    onChange={handleInputChange}
                    placeholder="Ціна місця"
                    className="w-full mb-4 p-3 border-2 border-gray-300 focus:outline-none rounded"
                />
                <div className="w-full mb-4">
                    <h3 className="text-lg font-medium mb-2">Додати сеанс</h3>
                    <input
                        type="date"
                        value={sessionDay}
                        onChange={(e) => setSessionDay(e.target.value)}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <input
                        type="time"
                        value={sessionTime}
                        onChange={(e) => setSessionTime(e.target.value)}
                        className="w-full mb-2 p-2 border rounded"
                    />
                    <button
                        onClick={handleAddSession}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Додати сеанс
                    </button>
                </div>
                {newMovie.sessions.length > 0 && (
                    <div className="w-full mb-4">
                        <h4 className="font-semibold mb-2">Сеанси:</h4>
                        <ul className="list-disc list-inside">
                            {newMovie.sessions.map((session, index) => (
                                <li key={index}>{session.day} — {session.time}</li>
                            ))}
                        </ul>
                    </div>
                )}

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
