import React, { useEffect, useRef, useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa'; // Import the Close (X) icon
import { motion } from 'framer-motion'; // Import Framer Motion
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const RatingOverlay = ({ showOverlay, setShowOverlay, userRating, setUserRating, userReview, setUserReview, handleRate, movieId }) => {
    const overlayRef = useRef(null);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for submit button
    const userId = Cookies.get("email");

    useEffect(() => {

        const handleClickOutside = (event) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                setShowOverlay(false);
            }
        };

        if (showOverlay) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOverlay, setShowOverlay]);

    const handleSubmit = async () => {
        if (!userId) {
            alert("Sign in to rate..");
            navigate("/login");
        }
        if (userReview.trim() === "") {
            setErrorMessage("Please enter your review.");
        } else if (userRating === 0) {
            setErrorMessage("Please select a rating.");
        } else {
            setErrorMessage(""); // Clear error message
            setLoading(true); // Set loading state to true

            const ratingData = {
                email: userId,
                rating: userRating,
                review: userReview,
                movieId,
            };

            try {
                const response = await fetch('http://10.16.48.202:8080/movie_booking_backend/storeRating', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ratingData),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const responseData = await response.json();
                setUserRating(0);
                setUserReview("");


                // Check if the response contains the message "Review already submitted"
                if (responseData.error) {
                    setErrorMessage("You have already submitted a review for this movie.");
                    return;
                } else {
                    alert('Rating submitted successfully:');
                    // Close the overlay
                }
                setShowOverlay(false);


            } catch (error) {
                setUserRating(0);
                setUserReview("");
                setErrorMessage(error.message); // Display error message if the API call fails
                console.error('Error submitting rating:', error.message);
            } finally {
                setLoading(false); // Reset loading state
            }
        }
    };


    if (!showOverlay) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <motion.div
                ref={overlayRef}
                className="bg-white p-8 rounded-lg w-1/4 relative"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold">How would you rate the movie?</h3>
                    <FaTimes
                        className="cursor-pointer text-gray-500 hover:text-gray-800"
                        onClick={() => setShowOverlay(false)}
                        size={24}
                        style={{ strokeWidth: 1 }}
                    />
                </div>

                <div className="flex gap-2 mb-6">
                    {[...Array(5)].map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                            <FaStar
                                className={`cursor-pointer ${userRating > index ? "text-red-500" : "text-gray-300"}`}
                                onClick={() => setUserRating(index + 1)}
                            />
                        </motion.div>
                    ))}
                </div>

                <textarea
                    className={`w-full h-36 p-3 border border-gray-300 focus:border-none active:border-gray-600 rounded-lg mb-6 resize-none 
                ${errorMessage ? "border-red-500" : ""} 
                focus:border-black`}
                    placeholder="Write your review"
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                ></textarea>

                {errorMessage && (
                    <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                )}

                <motion.button
                    className={`px-6 py-3 rounded-lg w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 text-white"
                        }`}
                    onClick={handleSubmit}
                    disabled={loading} // Disable button when loading
                    whileHover={!loading ? { backgroundColor: "red" } : {}}
                    transition={{ duration: 0.2 }}
                >
                    {loading ? "Submitting..." : "Submit Rating"}
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default RatingOverlay;
