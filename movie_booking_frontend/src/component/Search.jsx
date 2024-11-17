import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

const SearchOverlay = ({ onClose }) => {
    const [query, setQuery] = useState("");
    const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchType, setSearchType] = useState("movies");

    const modalRef = useRef(null); // Ref to detect clicks inside modal

    const recentMovies = [
        "The Dark Knight",
        "Avengers: Endgame",
        "Spider-Man: No Way Home",
        "Inception",
        "Interstellar",
    ];

    const recentCinemas = [
        "Cineworld Cinemas",
        "AMC Theaters",
        "Regal Cinemas",
        "Cinemark Theaters",
        "PVR Cinemas",
    ];

    useEffect(() => {
        // Start background fade
        setIsBackgroundVisible(true);

        // Show modal shortly after background starts fading
        const timer = setTimeout(() => {
            setIsModalVisible(true);
        }, 50); // Show modal after 50ms for a smoother effect

        // Close the overlay if clicked outside the modal
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose(); // Close the modal if clicked outside
            }
        };

        // Attach click listener to the document
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener when component is unmounted
        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearchChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearchSubmit = () => {
        console.log(`Searching for ${searchType}:`, query);
    };

    const handleClose = () => {
        // Close modal first
        setIsModalVisible(false);

        // Immediately start fading out the background
        setIsBackgroundVisible(false);

        // Finally call onClose to unmount component after a brief delay for transition
        setTimeout(onClose, 300); // Match this duration with CSS transition duration
    };

    return (
        <div
            className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 ease-in-out ${isBackgroundVisible ? "bg-opacity-40" : "bg-opacity-0"}`}
            style={{ pointerEvents: isBackgroundVisible ? 'auto' : 'none' }} // Prevent interactions when background is not visible
        >
            <div
                className={`fixed inset-0 flex justify-center items-center transition-transform transform duration-300 ease-in-out ${isModalVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
                <div
                    ref={modalRef} // Attach the ref to the modal content
                    className="p-8 m-3 w-[600px] rounded-lg shadow-xl"
                    style={{
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.7))",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        transition: "all 0.3s ease-in-out",
                    }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Search Movies or Cinemas
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
                        placeholder={`Enter ${searchType === "movies" ? "movie" : "cinema"} name`}
                        className="w-full p-2 bg-white bg-opacity-70 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                    />

                    <div className="flex mb-4 space-x-4">
                        <button
                            onClick={() => setSearchType("movies")}
                            className={`w-1/2 py-2 text-center rounded-lg border transition-colors ${searchType === "movies" ? "border-gray-600 text-gray-600" : "border-transparent text-gray-500"}`}
                        >
                            Movies
                        </button>
                        <button
                            onClick={() => setSearchType("cinemas")}
                            className={`w-1/2 py-2 text-center rounded-lg border transition-colors ${searchType === "cinemas" ? "border-gray-600 text-gray-600" : "border-transparent text-gray-500"}`}
                        >
                            Cinemas
                        </button>
                    </div>

                    <button
                        onClick={handleSearchSubmit}
                        className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-800 transition-all duration-300"
                    >
                        Search
                    </button>

                    <div className="mt-4 pl-10 max-full justify-center items-center flex space-x-8">
                        <div className="w-1/2">
                            <h3 className="font-semibold text-lg text-gray-700 mb-2">Recent Movies</h3>
                            <ul className="space-y-2">
                                {recentMovies.map((item, index) => (
                                    <li key={index} className="text-gray-600 flex items-center">
                                        <span className="text-red-500 mr-2">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="w-1/2">
                            <h3 className="font-semibold text-lg text-gray-700 mb-2">Recent Cinemas</h3>
                            <ul className="space-y-2">
                                {recentCinemas.map((item, index) => (
                                    <li key={index} className="text-gray-600 flex items-center">
                                        <span className="text-red-500 mr-2">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
