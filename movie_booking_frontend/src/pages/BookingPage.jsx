import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaTicketAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import logo from '../assets/logo/logo.png'; // Import the logo image
import RatingOverlay from "../component/RatingOverlay";
import { FaRegCircleUser } from "react-icons/fa6";

const BookingPage = () => {
    const { id } = useParams();  // Fetch movie ID from URL
    const [movieData, setMovieData] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showOverlay, setShowOverlay] = useState(false);  // State to show/hide overlay
    const [userRating, setUserRating] = useState(0);  // User rating input
    const [userReview, setUserReview] = useState("");  // User review input

    // Fetch movie data and ratings
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const movieResponse = await fetch(`http://10.16.48.202:8080/movie_booking_backend/getMovie/${id}`);
                const movie = await movieResponse.json();
                setMovieData(movie);  // Set movie data

                const ratingsResponse = await fetch(`http://10.16.48.202:8080/movie_booking_backend/getTopRatings?movieId=${id}`);
                const ratingsData = await ratingsResponse.json();
                setRatings(ratingsData.ratings);  // Set ratings data
                setAverageRating(ratingsData.average);  // Set average rating

                setLoading(false);  // Set loading to false once data is fetched
            } catch (error) {
                console.error("Error fetching movie data:", error);
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    const handleRate = () => {
        // Here you can handle the rating submission to the backend
        console.log("User Rating:", userRating);
        console.log("User Review:", userReview);
        setShowOverlay(false);  // Hide overlay after submitting the rating
    };

    // Return loading spinner or data when available
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
                            src={logo}
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

    if (!movieData) {
        return <div>Error loading movie data.</div>;
    }

    return (
        <div className="relative">
            <div className="text-3xl p-3 m-3 font-bold flex items-center gap-2">
                <span className="text-black">Book your tickets</span>
                <img src={logo} alt="Logo" className="h-10" />
            </div>
            <div className="min-h-screen bg-gray-100 relative ">
                <motion.div
                    className="absolute inset-0 bg-cover bg-center h-[400px] blur-xs"
                    style={{ backgroundImage: `url(${movieData.background_url})` }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-65"></div>
                </motion.div>

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
                        whileInView={{ opacity: 0.75, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-red-600">{movieData.movie_name}</h2>
                            <div className="flex gap-3">
                                <div className="flex items-center">
                                    <FaStar className="text-yellow-500 mr-1" />
                                    <span className="text-lg font-bold">{averageRating.toFixed(2)}/10</span>
                                    <span className="text-gray-500 text-xs md:text-sm ml-2">({ratings.length} Ratings)</span>
                                </div>
                                <button
                                    className="ml-auto px-4 py-2 rounded 
                                        bg-slate-600 text-white hover:bg-slate-700 font-semibold"
                                    onClick={() => setShowOverlay(true)}// Show overlay when clicked
                                >
                                    Rate Now
                                </button>
                            </div>
                        </div>
                        <p className="text-slate-200 text-xs md:text-sm">{movieData.about_movie}</p>
                        <p className="md:mt-4 mr-1">
                            <strong className="mr-2">Duration:</strong>
                            {Math.floor(movieData.duration / 60)} hr {movieData.duration % 60} min
                        </p>

                        <p>
                            <strong>Languages:</strong> {movieData.language}
                        </p>
                        <p>
                            <strong>Genres:</strong> {movieData.genre}
                        </p>
                        <p>
                            <strong>Release Date:</strong> {movieData.release_date.split(' ')[0]}
                        </p>
                        <p>
                            <strong>Plot:</strong> {movieData.plot}
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
                        className="text-xl  mb-4 text-gray-400"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Watch Trailer...
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
                            width="650px"
                            height="410px"
                            controls
                        />
                    </div>
                </motion.div>

                {/* Ratings Section */}
                <motion.div
                    className="container mx-auto p-6 mt-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold mb-4">User Ratings</h2>
                    <div className="space-y-4">
                        {ratings.map((rating) => (
                            <motion.div
                                key={rating.rating_id}
                                className="bg-white p-4 rounded shadow"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <div className="flex items-center justify-between mb-2 mx-2">
                                    <div className="flex gap-2">
                                        <span>
                                            <FaRegCircleUser size={24}></FaRegCircleUser>
                                        </span>

                                        <p className="text-gray-600 text-md font-semibold">{rating.username}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            <FaStar className="text-yellow-500 mr-1" />
                                            <span className="text-lg font-bold">{rating.rating_value}/5</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-2 mx-2">
                                    <p className="text-gray-700 font-light ml-6">-  {rating.review}</p>
                                    <span className="text-gray-500 text-xs ml-2">{new Date(rating.created_at).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <RatingOverlay
                showOverlay={showOverlay}
                setShowOverlay={setShowOverlay}
                userRating={userRating}
                setUserRating={setUserRating}
                userReview={userReview}
                setUserReview={setUserReview}
                handleRate={handleRate}
                movieId={id}
            />
        </div>
    );
};

export default BookingPage;