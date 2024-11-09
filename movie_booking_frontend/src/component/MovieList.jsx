import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Arrow icons

const MovieList = () => {
    // Dummy movie data
    const movies = [
        { id: 1, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFUjVQL19dmYX1hx83xiiQMVsLe_ixxvdcw&s", name: "Movie 1 jfvhjdsfjhsdjh  hsd fhsd", rating: "8.1/10", genre: "Action , Emotion", releaseDate: "2023-01-01" },
        { id: 2, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFUjVQL19dmYX1hx83xiiQMVsLe_ixxvdcw&s", name: "Movie 2", rating: "7.5/10", genre: "Comedy", releaseDate: "2022-05-15" },
        { id: 3, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFUjVQL19dmYX1hx83xiiQMVsLe_ixxvdcw&s", name: "Movie 3", rating: "9.0/10", genre: "Sci-Fi", releaseDate: "2021-07-20" },
        { id: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFUjVQL19dmYX1hx83xiiQMVsLe_ixxvdcw&s", name: "Movie 4", rating: "6.8/10", genre: "Horror", releaseDate: "2020-11-10" },
        { id: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFUjVQL19dmYX1hx83xiiQMVsLe_ixxvdcw&s", name: "Movie 5", rating: "7.2/10", genre: "Romance", releaseDate: "2022-09-25" },
        { id: 6, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFUjVQL19dmYX1hx83xiiQMVsLe_ixxvdcw&s", name: "Movie 6", rating: "8.5/10", genre: "Action", releaseDate: "2021-12-12" },
        { id: 7, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFUjVQL19dmYX1hx83xiiQMVsLe_ixxvdcw&s", name: "Movie 7", rating: "7.9/10", genre: "Animation", releaseDate: "2023-06-03" },
        { id: 8, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFUjVQL19dmYX1hx83xiiQMVsLe_ixxvdcw&s", name: "Movie 8", rating: "8.3/10", genre: "Fantasy", releaseDate: "2023-08-21" },
        { id: 9, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFUjVQL19dmYX1hx83xiiQMVsLe_ixxvdcw&s", name: "Movie 9", rating: "6.9/10", genre: "Action", releaseDate: "2022-04-30" },
        { id: 10, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFUjVQL19dmYX1hx83xiiQMVsLe_ixxvdcw&s", name: "Movie 10", rating: "7.8/10", genre: "Drama", releaseDate: "2021-09-15" }
    ];
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
                style={{ scrollPaddingLeft: '10px', scrollPaddingRight: '10px' }} // Adds padding for the slider
            >
                {movies.map((movie, index) => (
                    <MovieCard key={index} movie={movie} />
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