import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CarouselSlide from '../component/CarouselSlide';
import MovieList from '../component/MovieList';
import logo from '../assets/logo/logo.png'; // Import the logo image
import axios from 'axios';
import { FaRegCircleUser } from "react-icons/fa6"; // Import user icon
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; //

const Main = () => {
    const [movies, setMovies] = useState([]); // State to store fetched movie data
    const [states, setStates] = useState([]); // Store unique states
    const [cities, setCities] = useState([]); // Store unique cities
    const [selectedState, setSelectedState] = useState(''); // Selected state
    const [selectedCity, setSelectedCity] = useState(''); // Default city set to 'Coimbatore'
    const navigate = useNavigate();
    const [userId, setUserId] = useState('Guest');

    useEffect(() => {
        const userIdFromCookies = Cookies.get('userId'); // Get user ID from cookies
        if (userIdFromCookies) {
            setUserId(userIdFromCookies); // If found, update the userId state
        }
    }, []);


    // Fetch movie data from the API for the selected city and state
    useEffect(() => {
        // Fetching movie data for the default city initially (e.g., Coimbatore)


        // Fetching states data for the dropdown
        axios.get('http://localhost:8080/movie_booking_backend/getStates')
            .then((response) => {
                setStates(response.data);
                setSelectedState("Tamil Nadu")
                // Set the fetched states into the state
            })
            .catch((error) => {
                console.error('Error fetching states data:', error);
            });

        // Fetch cities data for the default state (Tamil Nadu)
        axios.post(`http://localhost:8080/movie_booking_backend/getCities?state=${selectedState}`)
            .then((response) => {
                setCities(response.data.cities);
                setSelectedCity(response.data.default_city);  // Set the default city
            })
            .catch((error) => {
                console.error('Error fetching cities data:', error);
            });
        axios.get(`http://localhost:8080/movie_booking_backend/getMovies?city=${selectedCity}`)
            .then((response) => {
                setMovies(response.data);  // Set the fetched movies into the state
            })
            .catch((error) => {
                console.error('Error fetching movie data:', error);
            });

    }, []);

    const handleLogin = () => {
        navigate("/login");

    }


    useEffect(() => {
        axios.get(`http://localhost:8080/movie_booking_backend/getMovies?city=${selectedCity}`)
            .then((response) => {
                setMovies(response.data);  // Set the fetched movies into the state
            })
            .catch((error) => {
                console.error('Error fetching movie data:', error);
            });

    }, [selectedCity]);



    const handleStateChange = (e) => {
        const newState = e.target.value;
        setSelectedState(newState);

        axios.post(`http://localhost:8080/movie_booking_backend/getCities?state=${newState}`)
            .then((response) => {
                setCities(response.data.cities);
                setSelectedCity(response.data.default_city);  // Reset city to default for the selected state
            })
            .catch((error) => {
                console.error('Error fetching cities data for selected state:', error);
            });
    };

    const handleCityChange = (e) => {
        const newCity = e.target.value;
        setSelectedCity(newCity);
    };

    return (
        <div>
            <div className="flex justify-between items-center p-3 mb-4">
                <motion.h1
                    className="text-3xl font-bold"
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

                <div className="flex gap-4 items-center">
                    <select
                        className="border p-2 rounded hover:outline-none border-gray-400 "
                        value={selectedState}
                        onChange={handleStateChange}
                    >
                        <option value="" className="active:outline-red-300 border-red-400" disabled>Select State</option>
                        {states.map((state, index) => (
                            <option key={index} value={state}>{state}</option>
                        ))}
                    </select>

                    <select
                        className="border p-2 rounded hover:outline-none border-gray-400 "
                        value={selectedCity}
                        onChange={handleCityChange}
                    >
                        <option value="">Select City</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>

                    {/* User Icon and Greeting */}
                    <div className="flex items-center gap-2 mr-5 ml-5" onClick={handleLogin}>
                        <FaRegCircleUser size={24} className="text-gray-600" />
                        <span className="text-gray-600">{`Hi, ${userId}`}</span>
                    </div>
                </div>
            </div>

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
