import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaTicketAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import logo from '../assets/logo/logo.png'; // Import the logo image

const BookingPage = () => {
    const { id } = useParams();
    const [movieData, setMovieData] = useState(null);
    const [error, setError] = useState(null);
    const [ratedIds, setRatedIds] = useState([]);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`/api/movies/${id}`); // Assuming your API endpoint for movie details is like this
                setMovieData(response.data);
            } catch (error) {
                setError("Failed to fetch movie details.");
                console.error(error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleRate = (ratingId) => {
        setRatedIds((prev) => [...prev, ratingId]);
    };

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!movieData) {
        return <div>Loading...</div>;
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
                                    <span className="text-lg font-bold">{movieData.rating || "N/A"}/10</span>
                                    <span className="text-gray-500 text-xs md:text-sm ml-2">
                                        {movieData.votes ? `(${movieData.votes} Votes)` : "(0 Votes)"}
                                    </span>
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
                        <p className="text-slate-200 text-xs md:text-sm">{movieData.plot}</p>
                        <p className="md:mt-4">
                            <strong>Duration:</strong> {movieData.duration} min
                        </p>
                        <p>
                            <strong>Languages:</strong> {movieData.language}
                        </p>
                        <p>
                            <strong>Genres:</strong> {movieData.genre}
                        </p>
                        <p>
                            <strong>Release Date:</strong> {new Date(movieData.release_date).toLocaleDateString()}
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
                        <iframe
                            width="560"
                            height="315"
                            src={movieData.trailer_url} // Use the trailer URL from the movie data
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg shadow-lg"
                        ></iframe>
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
                        {dummyRatings.map((rating) => (
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
