import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();

    return (
        <div className="relative min-w-52 h-80 overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl group">
            <img
                src={movie.image}
                alt={movie.name}
                className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110 opacity-90"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 z-10">
                <div className="flex justify-between items-end space-y-2 transform transition-transform duration-300 ease-in-out group-hover:translate-y-[-35px]">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-white font-bold text-sm truncate max-w-xs overflow-hidden">
                            {movie.name.length > 15 ? movie.name.slice(0, 15) + "..." : movie.name}
                        </h3>
                        <p className="text-gray-300 text-sm truncate max-w-xs overflow-hidden">
                            {movie.genre.length > 15 ? movie.genre.slice(0, 15) + "..." : movie.genre}
                        </p>
                    </div>
                    <div className="flex items-center text-yellow-400 gap-1">
                        <FaStar />
                        <p>{movie.rating}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/booking/${movie.id}`)}
                    className="absolute bottom-0 left-0 w-full px-6 py-3 bg-red-600 bg-opacity-40 text-white font-semibold rounded-b-lg shadow-lg opacity-0 transform scale-95 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-105 group-hover:bg-opacity-70 group-hover:shadow-2xl focus:outline-none"
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default MovieCard;