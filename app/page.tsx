'use client'
import React, {useRef} from "react";
import MovieCard from "@/app/component/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/app/component/Header";
import MultiplexHeader from "@/app/component/Header1";

const movies = [
  {
    title: "A Minecraft Movie",
    ageRating: "12+",
    posterUrl: "/img.png",
    showtimes: ["10:10", "12:25", "14:40", "17:00", "19:20"],
  },
  {
    title: "A Working Man",
    ageRating: "16+",
    posterUrl: "/img.png",
    showtimes: ["12:20", "14:50", "17:20", "19:45"],
  },
  {
    title: "A Working Man",
    ageRating: "16+",
    posterUrl: "/img.png",
    showtimes: ["12:20", "14:50", "17:20", "19:45"],
  },
  {
    title: "A Working Man",
    ageRating: "16+",
    posterUrl: "/img.png",
    showtimes: ["12:20", "14:50", "17:20", "19:45"],
  },
  {
    title: "A Working Man",
    ageRating: "16+",
    posterUrl: "/img.png",
    showtimes: ["12:20", "14:50", "17:20", "19:45"],
  },
  {
    title: "A Working Man",
    ageRating: "16+",
    posterUrl: "/img.png",
    showtimes: ["12:20", "14:50", "17:20", "19:45"],
  },
];

const Home = () => {
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

  return (
      <>
      <MultiplexHeader
                  currentLocation="Львів, Victoria Gardens"
                  onLocationChange={() => console.log('Location change clicked')}
                  onLogout={() => console.log('Logout clicked')}
                />
        {/*<Header></Header>*/}
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
            {movies.map((movie, idx) => (
                <div key={idx} className="min-w-[18rem] flex-shrink-0">
                  <MovieCard {...movie} />
                </div>
            ))}
          </div>
        </main>
      </>
  );
};


export default Home;
