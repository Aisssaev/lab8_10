'use client'
import React, {useEffect, useRef, useState} from "react";
import MultiplexHeader from "@/app/component/Header";
import MovieList from "@/app/component/MovieList";
import Header from "@/app/component/Header";

const Home = () => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/get-data');
      const result = await response.json();
      setData(result);
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
        <MovieList movies={data}></MovieList>
      </>
  );
};


export default Home;
