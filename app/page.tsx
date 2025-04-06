'use client'
import React, {useEffect, useRef, useState} from "react";
import MultiplexHeader from "@/app/component/Header";
import MovieList from "@/app/component/MovieList";
import Header from "@/app/component/Header";
import axios from "axios";

const Home = () => {
  const [movies, setMovies] = useState<any>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/api/movies');
            const result = await response.data;
            setMovies(result);
        };
        fetchData();
    }, []);

  return (
      <>
      <Header
                  currentLocation="Львів, Victoria Gardens"
                  onLocationChange={() => console.log('Location change clicked')}
                  onLogout={() => console.log('Logout clicked')}
                />
        {/*<Header></Header>*/}
        <MovieList movies={movies}></MovieList>
      </>
  );
};


export default Home;
