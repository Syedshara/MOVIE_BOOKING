import React from 'react';
import { motion } from 'framer-motion'; // Import framer-motion
import CarouselSlide from '../component/CarouselSlide';
import MovieList from '../component/MovieList';
import logo from '../assets/logo/logo.png'; // Import the logo image

const Main = () => {
    return (
        <div>
            <motion.h1
                className="text-3xl p-3 m-3 font-bold"
                initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and y offset
                whileInView={{ opacity: 1, y: 0 }} // Animate to full opacity and y = 0 when in view
                transition={{ duration: 0.5 }} // Transition duration
                viewport={{ once: false }} // The animation will trigger every time it enters the viewport
            >
                <span className="text-black">Welcome to </span>
                {/* Use the <img> tag to display the logo */}
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
                viewport={{ once: false }} // Trigger on every scroll into view
            >
                <CarouselSlide />
            </motion.div>

            {/* Latest Movies Section */}
            <motion.div
                className="text-2xl font-bold mt-5 text-slate-700 px-5 p-3 m-3"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }} // Trigger on every scroll into view
            >
                Latest Movies
            </motion.div>

            {/* Movie List with animation */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }} // Trigger on every scroll into view
            >
                <MovieList />
            </motion.div>

            {/* Duplicate Latest Movies Section */}
            <motion.div
                className="text-2xl font-bold mt-5 text-slate-700 px-5 p-3 m-3"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }} // Trigger on every scroll into view
            >
                Top Rated Movies
            </motion.div>

            {/* Another Movie List with animation */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }} // Trigger on every scroll into view
            >
                <MovieList />
            </motion.div>
        </div>
    );
};

export default Main;