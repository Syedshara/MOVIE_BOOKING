import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo/logo.png'; // Import the logo image


const MovieDetailsPage = () => {
    const { id } = useParams();
    const [movieDetails, setMovieDetails] = useState({});
    const [theaterList, setTheaterList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedRegion, setSelectedRegion] = useState('All'); // Filter for region
    const [loading, setLoading] = useState(true); // Added loading state
    const navigate = useNavigate();

    const regions = ['All', 'Mumbai', 'Chembur', 'Goregaon']; // Example regions

    const handleShowtimeClick = (id, theaterName, screenId) => {
        navigate(`/seats/${id}`);
    };

    const fetchData = async () => {
        try {
            // Fetch movie details
            const movieResponse = await axios.get(`http://10.16.48.202:8080/movie_booking_backend/getMovie/${id}`);
            const movieData = movieResponse.data;
            setMovieDetails({
                movie_name: movieData.movie_name,
                genres: movieData.genre,
                release_date: movieData.release_date.split(" ")[0], // Extract date part
            });

            // Fetch theater details
            const theaterResponse = await axios.get(`http://10.16.48.202:8080/movie_booking_backend/getTheaterDetails?movieId=${id}`);
            const theaterData = theaterResponse.data.map(theater => ({

                theater_name: theater.theater_name,
                address: theater.address,
                region: 'All', // Default region since it's not provided
                screens: theater.screens.map(screen => ({
                    screen_id: screen.screen_id,
                    screen_name: screen.screen_name,
                    showtimes: screen.shows.map(show => ({
                        time: convertTimeTo12Hour(show.show_time),
                        id: show.show_id,
                        available: true, // Default as true since availability is not provided
                    }))
                }))
            }));
            setTheaterList(theaterData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleRegionChange = (e) => {
        setSelectedRegion(e.target.value);
    };

    const convertTimeTo12Hour = (time) => {
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour, 10);
        const period = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${minute} ${period}`;
    };

    // Filter theaters based on selected region
    const filteredTheaters = selectedRegion === 'All' ? theaterList : theaterList.filter(theater => theater.region === selectedRegion);

    // Loader Component
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <motion.div
                    className="flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative">
                        <img
                            src={logo}// Update with your logo path
                            alt="Logo"
                            className="h-20 mb-4 transform transition-transform duration-500 ease-in-out"
                            style={{ animation: 'growShrink 2s infinite' }}
                        />
                        {/* Gradient white overlay */}
                        <div className="absolute inset-0 bg-transparent opacity-50 rounded-lg"></div>
                    </div>
                    <p className="text-lg text-gray-500">Loading...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            {/* Movie Details */}
            <motion.h2
                className="text-4xl font-semibold custom-header text-gray-800 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {movieDetails.movie_name}
            </motion.h2>
            <motion.p
                className="text-md text-red-600 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <span className="border border-red-500 px-2 py-1 rounded">
                    {movieDetails.genres}
                </span>
            </motion.p>
            <motion.p
                className="text-sm text-gray-500 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Release Date: {movieDetails.release_date}
            </motion.p>

            {/* Date Picker and Region Filter */}
            <motion.div
                className="flex items-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="p-2 border rounded-md shadow-sm text-gray-700"
                />
                <select
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    className="p-2 border rounded-md shadow-sm text-gray-700"
                >
                    {regions.map((region, index) => (
                        <option key={index} value={region}>{region}</option>
                    ))}
                </select>
            </motion.div>

            {/* Theater List with Showtimes */}
            <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className='flex w-full justify-between px-2'>
                    <motion.h3
                        className="text-2xl text-gray-600 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Available Theaters
                    </motion.h3>
                    <div className='flex gap-5'>
                        <motion.h3
                            className="text-sm text-slate-500 mb-4 flex items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                            Available
                        </motion.h3>
                        <motion.h3
                            className="text-sm text-slate-500 mb-4 flex items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="h-2 w-2 rounded-full bg-red-400 mr-1"></span>
                            Full
                        </motion.h3>
                    </div>
                </div>

                {filteredTheaters.map((theater, index) => {
                    return (
                        <motion.div
                            key={index}
                            className="mb-2 p-4 bg-white shadow rounded-lg border border-gray-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h4 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                {theater.theater_name} ,<span className='text-sm -gray-400'>{theater.address}</span>
                            </h4>
                            {theater.screens.map((screen, screenIndex) => (
                                <div key={screenIndex} className="mt-3">
                                    <h5 className="font-medium text-gray-600">{screen.screen_name}</h5>
                                    <div className="mt-2 flex gap-3 flex-wrap">
                                        {screen.showtimes.map((showtime, timeIndex) => (
                                            <button
                                                key={timeIndex}
                                                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium border ${showtime.available
                                                    ? 'border-green-500 text-green-700'
                                                    : 'border-red-500 text-red-700'
                                                    }`}
                                                onClick={() => handleShowtimeClick(showtime.id, theater.theater_name, screen.screen_id)}
                                            >
                                                {showtime.time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default MovieDetailsPage;
