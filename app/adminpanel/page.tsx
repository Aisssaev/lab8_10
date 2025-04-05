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
            const response = await fetch('/api/get-data');
            const result = await response.json();
            setMovies(result);
        };
        fetchData();
    }, []);


    console.log(movies)

    const handleAddMovie = async (newMovie: MovieCardProps) => {
        const response = await fetch('/api/add-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMovie),
        });

        if (response.ok) {
            const addedMovie = await response.json();
            setMovies((prevMovies) => [...prevMovies, addedMovie]);
        } else {
            console.error('Помилка при добавленні фільму');
        }
    };

    const handleDeleteMovie = async (index: number) => {
        try {
            const movieToDelete = movies[index];

            await axios.post('/api/delete-data', {
                id: movieToDelete?._id,
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
