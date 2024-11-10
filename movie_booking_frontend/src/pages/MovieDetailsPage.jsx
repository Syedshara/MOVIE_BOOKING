import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const [movieDetails, setMovieDetails] = useState({});
    const [theaterList, setTheaterList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedRegion, setSelectedRegion] = useState('All'); // Filter for region

    const regions = ['All', 'Mumbai', 'Chembur', 'Goregaon']; // Example regions
    const navigate = useNavigate();

    const handleShowtimeClick = (time, theaterName, screenId) => {
        // Redirect to seat selection page with screenId
        navigate(`/seats/${screenId}`);
    };

    useEffect(() => {
        // Mocked movie details
        setMovieDetails({
            movie_name: 'Amaran',
            genres: 'Action, Drama, Thriller',
            release_date: '2024-10-24',
        });

        // Mocked theater data with screen_id included
        setTheaterList([
            {
                theater_name: 'MovieMax: Huma, Kanjurmarg',
                region: 'Mumbai',
                screens: [
                    {
                        screen_id: 'screen1-huma',
                        screen_name: 'Screen 1',
                        showtimes: [
                            { time: '02:30 PM', available: true },
                            { time: '08:45 PM', available: false }
                        ]
                    },
                    {
                        screen_id: 'screen2-huma',
                        screen_name: 'Screen 2',
                        showtimes: [
                            { time: '02:30 PM', available: true },
                            { time: '08:45 PM', available: false }
                        ]
                    }
                ],
            },
            {
                theater_name: 'MovieMax: Sion',
                region: 'Mumbai',
                screens: [
                    {
                        screen_id: 'screen1-sion',
                        screen_name: 'Screen 1',
                        showtimes: [
                            { time: '04:00 PM', available: true },
                            { time: '08:45 PM', available: true },
                            { time: '11:55 PM', available: false }
                        ]
                    }
                ],
            },
            {
                theater_name: 'Movietime Cubic Mall: Chembur',
                region: 'Chembur',
                screens: [
                    {
                        screen_id: 'screen1-chembur',
                        screen_name: 'Screen 1',
                        showtimes: [
                            { time: '11:30 AM', available: true },
                            { time: '03:00 PM', available: false },
                            { time: '06:45 PM', available: true },
                            { time: '07:00 PM', available: false },
                            { time: '10:30 PM', available: true }
                        ]
                    }
                ],
            },
            {
                theater_name: 'MOVIE TIME: HUB, Goregaon (E)',
                region: 'Goregaon',
                screens: [
                    {
                        screen_id: 'screen1-goregaon',
                        screen_name: 'Screen 1',
                        showtimes: [
                            { time: '01:10 PM', available: true },
                            { time: '11:25 PM', available: false }
                        ]
                    }
                ],
            }
        ]);
    }, [id]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleRegionChange = (e) => {
        setSelectedRegion(e.target.value);
    };

    // Filter theaters based on selected region
    const filteredTheaters = selectedRegion === 'All' ? theaterList : theaterList.filter(theater => theater.region === selectedRegion);

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
                                {theater.theater_name}
                            </h4>
                            {theater.screens.map((screen, screenIndex) => (
                                <div key={screenIndex} className="mt-3">
                                    <h5 className="font-medium text-gray-600">{screen.screen_name}</h5>
                                    <div className="mt-2 flex gap-3 flex-wrap">
                                        {screen.showtimes
                                            .sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`))
                                            .map((showtime, timeIndex) => (
                                                <button
                                                    key={timeIndex}
                                                    className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium border ${showtime.available
                                                        ? 'border-green-500 text-green-700'
                                                        : 'border-red-500 text-red-700'
                                                        }`}
                                                    onClick={() => handleShowtimeClick(showtime.time, theater.theater_name, screen.screen_id)}
                                                >
                                                    {showtime.time}
                                                </button>
                                            ))}
                                    </div>
                                    <div className="w-1/4 border-t border-gray-300 mt-3"></div>
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
