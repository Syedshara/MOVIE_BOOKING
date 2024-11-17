import React, { useEffect, useRef, useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa'; // Import the Close (X) icon
import { motion } from 'framer-motion';  // Import Framer Motion

const RatingOverlay = ({ showOverlay, setShowOverlay, userRating, setUserRating, userReview, setUserReview, handleRate }) => {
    const overlayRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");  // State for error message

    // Close the overlay when clicking outside the modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                setShowOverlay(false);
            }
        };

        if (showOverlay) {
            // Add event listener to the document when overlay is visible
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            // Remove event listener when overlay is hidden
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);  // Clean up the event listener
        };
    }, [showOverlay, setShowOverlay]);

    const handleSubmit = () => {
        // Check if the review is empty
        if (userReview.trim() === "") {
            setErrorMessage("Please enter your review.");
        }
        // Check if no rating is selected
        else if (userRating === 0) {
            setErrorMessage("Please select a rating.");
        }
        else {
            setErrorMessage("");  // Clear error message if both are valid
            handleRate();  // Proceed with the rate submission if valid
        }
    };

    if (!showOverlay) return null; // If not showing, return nothing

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}  // Initial opacity hidden
            animate={{ opacity: 1 }}  // Animate to full opacity
            exit={{ opacity: 0 }}  // Fade out on exit
            transition={{ duration: 0.4, ease: "easeInOut" }}  // Smooth transition
        >
            <motion.div
                ref={overlayRef}  // Attach the ref to the modal container
                className="bg-white p-8 rounded-lg w-1/4 relative" // Reduced width (25%)
                initial={{ y: -30, opacity: 0 }}  // Initial position above and hidden
                animate={{ y: 0, opacity: 1 }}  // Slide in and fade in
                exit={{ y: 30, opacity: 0 }}  // Slide out and fade out
                transition={{ duration: 0.5, ease: "easeOut" }}  // Smooth slide and fade transition
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold">How would you rate the movie?</h3>
                    <FaTimes
                        className="cursor-pointer text-gray-500 hover:text-gray-800"
                        onClick={() => setShowOverlay(false)}  // Close the overlay when the X is clicked
                        size={24}
                        style={{ strokeWidth: 1 }}  // Add a thinner stroke for the X
                    />
                </div>


                <div className="flex gap-2 mb-6">
                    {[...Array(5)].map((_, index) => (  // Change to 5 stars instead of 10
                        <motion.div
                            key={index}
                            initial={{ scale: 0 }}  // Start from small
                            animate={{ scale: 1 }}  // Animate to full scale
                            transition={{ delay: index * 0.05, duration: 0.3 }}  // Delay for each star for a staggered effect
                            whileHover={{ scale: 1.2, rotate: 5 }}  // Slight rotation and scaling on hover
                        >
                            <FaStar
                                className={`cursor-pointer ${userRating > index ? "text-red-500" : "text-gray-300"}`}  // Change to red color
                                onClick={() => setUserRating(index + 1)}
                            />
                        </motion.div>
                    ))}
                </div>

                <textarea
                    className={`w-full h-36 p-3 border border-gray-300 focus:border-none active:border-gray-600  rounded-lg mb-6 resize-none 
                ${errorMessage ? "border-red-500" : ""} 
                focus:border-black`}  // Add focus:border-black for the active typing state
                    placeholder="Write your review"
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                ></textarea>



                {errorMessage && (
                    <p className="text-red-500 text-sm mb-4">{errorMessage}</p>  // Show error message
                )}

                <motion.button
                    className="px-6 py-3 bg-red-500 text-white rounded-lg w-full"
                    onClick={handleSubmit}  // Submit button calls handleSubmit
                    whileHover={{ backgroundColor: "red" }}  // Smooth hover effect
                    transition={{ duration: 0.2 }}
                >
                    Submit Rating
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default RatingOverlay;
