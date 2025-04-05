// pages/Home.tsx или App.tsx
'use client'
import React, {useRef} from "react";
import MovieCard from "@/app/component/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const movies = [
  {
    title: "A Minecraft Movie",
    ageRating: "12+",
    posterUrl: "/img.png", // заменить на реальную ссылку
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
  const scrollAmount = 300; // пикселей

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
      <div className="relative px-6 h-9/10 py-5 overflow-y-hidden">
        {/* Стрелки */}
        <button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            onClick={scrollLeft}
        >
          <ChevronLeft size={40} />
        </button>

        <button
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            onClick={scrollRight}
        >
          <ChevronRight size={40} />
        </button>

        {/* Слайдер */}
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
      </div>
  );
};


export default Home;
