'use client'
import React, {useEffect, useRef, useState} from "react";
import MovieListEmpty from "@/app/component/MovieListEmpty";
import {MovieCardProps} from "@/app/component/MovieCard";
import Header from "@/app/component/Header";
import axios from "axios";

const Home = () => {
    const [movies, setMovies] = useState<MovieCardProps[]>([])
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/api/movies');
            const result = await response.data;
            setMovies(result);
        };
        fetchData();
    }, []);

    const handleAddMovie = async (newMovie: MovieCardProps) => {
        try {
            console.log(newMovie)
            const response = await axios.post('/api/movies', newMovie);

            const addedMovie = await response.data;
            setMovies((prevMovies) => [...prevMovies, addedMovie]);
        } catch (error) {
            console.error('Помилка при добавленні фільму');
            if (axios.isAxiosError(error)) {
                console.error('Деталі:', error.response?.data);
            }
        }
    };

    const handleDeleteMovie = async (index: number) => {
        try {
            const movieToDelete = movies[index];

            await axios.delete('/api/movies', {
                params: {
                    id: movieToDelete?._id,
                }
            });

            setMovies((prev) => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Помилка при видаленні фільму:', error);
            alert('Не вдалось видалити фільм. Попробуйте знову.');
        }
    };

    return (
        <div>
            <Header
                currentLocation="Львів, Victoria Gardens"
                onLocationChange={() => console.log('Location change clicked')}
                onLogout={() => console.log('Logout clicked')}
            />
            <MovieListEmpty cards={movies} onAddMovie={handleAddMovie} onDeleteMovie={handleDeleteMovie}/>
        </div>
    );
};

export default Home;
