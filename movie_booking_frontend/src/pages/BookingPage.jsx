import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaTicketAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import logo from '../assets/logo/logo.png'; // Import the logo image

const BookingPage = () => {
    const { id } = useParams();  // Fetch movie ID from URL
    const [movieData, setMovieData] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratedIds, setRatedIds] = useState([]);

    // Fetch movie data and dummy ratings
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const movieResponse = await fetch(`http://localhost:8080/movie_booking_backend/getMovie/${id}`);
                const movie = await movieResponse.json();
                setMovieData(movie);  // Set movie data

                // Use dummy ratings data for now
                const dummyRatings = [
                    { rating_id: 1, rating_value: 8, review: "Great movie!", created_at: "2024-11-15T12:34:56Z" },
                    { rating_id: 2, rating_value: 7, review: "Good, but could be better.", created_at: "2024-11-14T10:20:30Z" },
                    { rating_id: 3, rating_value: 9, review: "Amazing plot and visuals.", created_at: "2024-11-13T08:15:45Z" }
                ];

                setRatings(dummyRatings);  // Set dummy ratings data

                setLoading(false);  // Set loading to false once data is fetched
            } catch (error) {
                console.error("Error fetching movie data:", error);
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    const handleRate = (ratingId) => {
        setRatedIds((prev) => [...prev, ratingId]);
    };

    // Return loading spinner or data when available
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!movieData) {
        return <div>Error loading movie data.</div>;
    }

    return (
        <div className="relative">
            <div className="text-3xl p-3 m-3 font-bold flex items-center gap-2">
                <span className="text-black">Book your tickets</span>
                <img src={logo} alt="Logo" className="h-10" />
            </div>
            <div className="min-h-screen bg-gray-100 relative overflow-x-hidden">
                <motion.div
                    className="absolute inset-0 bg-cover bg-center h-[400px]"
                    style={{ backgroundImage: `url(${movieData.background_url})` }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                ></motion.div>

                <div className="relative z-10 container mx-auto p-6 flex flex-col lg:flex-row">
                    <motion.div
                        className="w-full lg:w-[250px] h-[350px] rounded-tl-xl rounded-bl-xl overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src={movieData.poster_url}
                            alt={movieData.movie_name}
                            className="w-full h-full rounded-tl-xl rounded-b-xl shadow-lg object-cover"
                        />
                    </motion.div>

                    <motion.div
                        className="w-full lg:w-[calc(100%-250px)] md:h-[350px] bg-black opacity-80 text-slate-200 p-6 rounded-tr-xl rounded-br-xl"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 0.8, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-red-600">{movieData.movie_name}</h2>
                            <div className="flex gap-3">
                                <div className="flex items-center">
                                    <FaStar className="text-yellow-500 mr-1" />
                                    <span className="text-lg font-bold">{movieData.rating}/10</span>
                                    <span className="text-gray-500 text-xs md:text-sm ml-2">({movieData.votes} Votes)</span>
                                </div>
                                <button
                                    className="ml-auto px-4 py-2 rounded 
                                        bg-slate-600 text-white hover:bg-slate-700 font-semibold
                                        "
                                >
                                    Rate Now
                                </button>
                            </div>
                        </div>
                        <p className="text-slate-200 text-xs md:text-sm">{movieData.about_movie}</p>
                        <p className="md:mt-4">
                            <strong>Duration:</strong> {movieData.duration} min
                        </p>
                        <p>
                            <strong>Languages:</strong> {movieData.languages}
                        </p>
                        <p>
                            <strong>Genres:</strong> {movieData.genres}
                        </p>
                        <p>
                            <strong>Release Date:</strong> {movieData.release_date}
                        </p>

                        {/* Using Link for Navigation */}
                        <Link
                            to={`/movie-details/${movieData.movie_id}`}
                            className="md:px-8 py-4 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition lg:mt-10 w-64 flex items-center justify-center gap-2"
                        >
                            <FaTicketAlt className="text-white" size={24} />
                            Book Tickets
                        </Link>
                    </motion.div>
                </div>

                {/* YouTube Video Section */}
                <motion.div
                    className="container mx-auto p-6 mt-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h2
                        className="text-xl font-semibold mb-4 text-gray-400"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Watch the Trailer
                    </motion.h2>
                    <motion.h2
                        className="text-3xl font-bold  mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {movieData.movie_name}
                    </motion.h2>
                    <div className="flex justify-center">
                        <ReactPlayer
                            url={movieData.trailer_url}  // Assuming trailer_url contains a valid YouTube URL
                            width="560px"
                            height="315px"
                            className="rounded-lg shadow-lg"
                            controls
                        />
                    </div>
                </motion.div>

                <motion.div
                    className="container mx-auto p-6 mt-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h2
                        className="text-xl font-bold mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        User Ratings & Reviews
                    </motion.h2>
                    <div className="space-y-4">
                        {ratings.map((rating) => (
                            <motion.div
                                key={rating.rating_id}
                                className="p-4 bg-white shadow-md rounded-lg flex items-start gap-4"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <FaStar />
                                    <span className="font-bold">{rating.rating_value}</span>
                                </div>
                                <div>
                                    <p className="text-gray-700">{rating.review}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(rating.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BookingPage;
