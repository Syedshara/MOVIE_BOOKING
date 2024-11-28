import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate hook

const SearchOverlay = ({ onClose }) => {
    const [query, setQuery] = useState("");
    const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);
    const modalRef = useRef(null);
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        setIsBackgroundVisible(true);
        const timer = setTimeout(() => {
            setIsModalVisible(true);
        }, 50);

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearchSubmit = () => {
        console.log(`Searching for movie:`, query);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setIsBackgroundVisible(false);
        setTimeout(onClose, 300);
    };

    const handleMovieClick = (movieId) => {
        navigate(`/booking/${movieId}`); // Navigate to the booking page
        handleClose(); // Close the overlay
    };

    useEffect(() => {
        if (query.length > 2) {
            const fetchMovieDetails = async () => {
                try {
                    const response = await fetch(
                        `http://10.16.48.202:8080/movie_booking_backend/getMovieDetails?movieName=${encodeURIComponent(query)}`
                    );
                    const data = await response.json();
                    setMovieDetails(data);
                } catch (error) {
                    console.error("Error fetching movie details:", error);
                    setMovieDetails(null);
                }
            };
            fetchMovieDetails();
        } else {
            setMovieDetails(null);
        }
    }, [query]);

    return (
        <div
            className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 ease-in-out ${isBackgroundVisible ? "bg-opacity-40" : "bg-opacity-0"}`}
            style={{ pointerEvents: isBackgroundVisible ? 'auto' : 'none' }}
        >
            <div
                className={`fixed inset-0 flex justify-center items-start transition-transform transform duration-300 ease-in-out ${isModalVisible ? "translate-y-10 opacity-100" : "translate-y-20 opacity-0"}`}
            >
                <div
                    ref={modalRef}
                    className="p-8 m-3 w-[700px] rounded-lg shadow-xl"
                    style={{
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.7))",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        transition: "all 0.3s ease-in-out",
                    }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Search Movies
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <IoClose size={24} />
                        </button>
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        placeholder="Enter movie name"
                        className="w-full p-2 bg-white bg-opacity-70 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                    />

                    <button
                        onClick={handleSearchSubmit}
                        className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-800 transition-all duration-300"
                    >
                        Search
                    </button>

                    {movieDetails && movieDetails.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-700">Results:</h3>
                            <div className="mt-4">
                                {movieDetails.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="mb-4 flex items-center hover:outline hover:outline-1 hover:outline-slate-500 px-4 py-2 rounded-lg cursor-pointer"
                                        onClick={() => handleMovieClick(movie.id)} // Call handleMovieClick with movie.id
                                    >
                                        <img
                                            src={movie.poster_url}
                                            alt={movie.movie_name}
                                            className="w-16 h-24 mr-4 rounded-lg"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">{movie.movie_name}</p>
                                            <p className="text-gray-600">{movie.genre}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;