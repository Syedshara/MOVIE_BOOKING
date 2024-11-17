import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Arrow icons

const MovieList = ({ movies }) => {
    const movieListRef = useRef();

    const scrollLeft = () => {
        if (movieListRef.current) {
            const cardWidth = movieListRef.current.querySelector('.movie-card')?.offsetWidth || 0;
            const scrollAmount = cardWidth * 3 + 400;
            movieListRef.current.scrollLeft -= scrollAmount;
        }
    };

    const scrollRight = () => {
        if (movieListRef.current) {
            const cardWidth = movieListRef.current.querySelector('.movie-card')?.offsetWidth || 0;
            const scrollAmount = cardWidth * 3 + 400;
            movieListRef.current.scrollLeft += scrollAmount;
        }
    };

    return (
        <div className="relative mt-8 px-10">
            <FaChevronLeft
                className="text-slate-400 text-3xl cursor-pointer absolute left-4 z-10 top-1/2 transform -translate-y-1/2"
                onClick={scrollLeft}
            />
            <div
                ref={movieListRef}
                className="overflow-x-scroll flex space-x-4 pb-4 scrollbar-hide px-10"
                style={{ scrollPaddingLeft: '10px', scrollPaddingRight: '10px' }}
            >
                {movies.map((movie) => (
                    <MovieCard key={movie.movie_id} movie={movie} />
                ))}
            </div>
            <FaChevronRight
                className="text-slate-400 text-3xl cursor-pointer absolute right-4 z-10 top-1/2 transform -translate-y-1/2"
                onClick={scrollRight}
            />
        </div>
    );
};

export default MovieList;
