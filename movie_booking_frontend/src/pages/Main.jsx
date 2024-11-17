import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CarouselSlide from '../component/CarouselSlide';
import MovieList from '../component/MovieList';
import logo from '../assets/logo/logo.png'; // Import the logo image
import axios from 'axios';

const Main = () => {
    const [movies, setMovies] = useState([]); // State to store fetched movie data

    // Fetch movie data from the API
    useEffect(() => {
        axios.get('http://localhost:8080/moviebooking/getMovies')
            .then((response) => {
                setMovies(response.data);  // Set the fetched movies into the state
            })
            .catch((error) => {
                console.error('Error fetching movie data:', error);
            });
    }, []);

    return (
        <div>
            <motion.h1
                className="text-3xl p-3 m-3 font-bold"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }}
            >
                <span className="text-black">Welcome to </span>
                <span className="text-red-500">
                    <img src={logo} alt="Logo" className="inline-block h-8" />
                </span>
                <span className="text-black">..</span>
            </motion.h1>

            {/* Carousel Slide with animation */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }}
            >
                <CarouselSlide movies={movies} />  {/* Passing movies data to CarouselSlide */}
            </motion.div>

            {/* Latest Movies Section */}
            <motion.div
                className="text-2xl font-bold mt-5 text-slate-700 px-5 p-3 m-3"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }}
            >
                Latest Movies
            </motion.div>

            {/* Movie List with animation */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }}
            >
                <MovieList movies={movies} />  {/* Passing movies data to MovieList */}
            </motion.div>

            {/* Duplicate Latest Movies Section */}
            <motion.div
                className="text-2xl font-bold mt-5 text-slate-700 px-5 p-3 m-3"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }}
            >
                Top Rated Movies
            </motion.div>

            {/* Another Movie List with animation */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }}
            >
                <MovieList movies={movies} />  {/* Passing movies data to MovieList */}
            </motion.div>
        </div>
    );
};

export default Main;
