import React, { useEffect, useState } from 'react';
import { SiAmazonpay } from "react-icons/si";
import { motion } from 'framer-motion'; // Import framer-motion
import { useParams, Link } from "react-router-dom";
import logo from '../assets/logo/logo.png';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const SeatSelectionPage = () => {
    const [theaterDetails, setTheaterDetails] = useState({});
    const [goldSeats, setGoldSeats] = useState([]);
    const [silverSeats, setSilverSeats] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const [selectedSeats, setSelectedSeats] = useState([]); // Track selected seats
    const navigate = useNavigate();
    const { screenId } = useParams();  // Replace with the actual show ID from your application

    useEffect(() => {
        // Fetch data from the API
        console.log(screenId);
        fetch(`http://localhost:8080/movie_booking_backend/getSeatAvailability?showId=${screenId}`)
            .then((response) => response.json())
            .then((data) => {
                const { theater_name, address, movie_name, seats, gold_rows, gold_columns, silver_rows, silver_columns } = data;

                // Set theater details
                setTheaterDetails({
                    theater_name: theater_name,
                    movie_name: movie_name,
                    address: address,
                });


                // Organize gold and silver seats
                const generatedGoldSeats = [];
                const generatedSilverSeats = [];

                // Separate the seats into Gold and Silver based on their tier
                for (let i = 0; i < gold_rows; i++) {
                    const row = [];
                    for (let j = 1; j <= gold_columns; j++) {
                        const seat = seats.find(s => s.row_number === i + 1 && s.column_number === j && s.tier === 'gold');
                        if (seat) {
                            row.push({
                                seat_number: j,
                                seat_id: seat.seat_id,
                                seat_label: seat.seat_label,
                                is_available: seat.is_available,
                                selected: false, // Initialize selected state
                            });
                        }
                    }
                    generatedGoldSeats.push(row);
                }
                setGoldSeats(generatedGoldSeats);

                for (let i = 0; i < silver_rows; i++) {
                    const row = [];
                    for (let j = 1; j <= silver_columns; j++) {
                        const seat = seats.find(s => s.row_number === i + 1 && s.column_number === j && s.tier === 'silver');
                        if (seat) {
                            row.push({
                                seat_number: j,
                                seat_label: seat.seat_label,
                                seat_id: seat.seat_id,
                                is_available: seat.is_available,
                                selected: false, // Initialize selected state
                            });
                        }
                    }
                    generatedSilverSeats.push(row);
                }
                setSilverSeats(generatedSilverSeats);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching seat data:", error);
                setLoading(false);
            });
    }, [screenId]);

    // Handle seat selection
    const handleSeatClick = (seat, rowIndex, rowType) => {
        if (seat.is_available) {
            const updatedSeats = rowType === 'gold' ? [...goldSeats] : [...silverSeats];
            updatedSeats[rowIndex] = updatedSeats[rowIndex].map((s) =>
                s.seat_number === seat.seat_number
                    ? { ...s, selected: !s.selected }
                    : s
            );

            if (rowType === 'gold') {
                setGoldSeats(updatedSeats);
            } else {
                setSilverSeats(updatedSeats);
            }

            const seatLabel = seat.seat_label;
            const isAlreadySelected = selectedSeats.some(
                (selected) => selected.label === seatLabel
            );

            if (isAlreadySelected) {
                setSelectedSeats(selectedSeats.filter((selected) => selected.label !== seatLabel));
            } else {
                setSelectedSeats([
                    ...selectedSeats,
                    {
                        tier: rowType,
                        seat_label: seatLabel,
                        seatId: seat.seat_id,
                    },
                ]);
            }
        }
    };

    const calculateTotalAmount = () => {
        const goldCount = selectedSeats.filter(seat => goldSeats.flat().some(gSeat => gSeat.seat_label === seat.label)).length;
        const silverCount = selectedSeats.length - goldCount;
        return goldCount * 190 + silverCount * 120; // Assuming Rs. 310 for gold and Rs. 290 for silver
    };

    const handlePayNow = () => {

        const userId = Cookies.get('userId');
        if (!userId) {
            alert('Please log in to proceed with the payment.');
            navigate('/login');
            return;
        }

        const payload = {
            showId: screenId,
            totalAmount: calculateTotalAmount(),
            selectedSeats: selectedSeats,
            email: userId
        };

        navigate('/payment', { state: payload });
    };



    // Check if any seat is selected
    const isAnySeatSelected = selectedSeats.length > 0;

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
        <div className="seat-selection-container p-5 bg-slate-100 font-sans relative">
            {/* Theater Header */}
            <div className="theater-header mb-5">
                <h2 className="text-2xl font-bold">
                    {theaterDetails.theater_name}{' : '}
                    <span className='text-gray-600 font-medium'>   {theaterDetails.movie_name}</span>

                </h2>
                <p className=" font-extralight ">{theaterDetails.address}</p>
            </div>

            {/* Number of Selected Seats */}
            <div className="absolute top-5 right-5 bg-transparent border text-gray-400 border-gray-300 p-2 rounded-lg shadow-sm hover:shadow-md">
                {selectedSeats.length} Selected
            </div>

            {/* Gold Seats Section */}
            <div className="seat-section mb-5 flex flex-col justify-center items-center mt-14">
                <h3 className="text-md text-gray-400 mb-3">Rs. 310 GOLD</h3>
                {goldSeats.map((row, rowIndex) => (
                    <div key={`gold-row-${rowIndex}`} className="seat-row flex justify-center mb-3">
                        <span className="row-label mr-3 text-slate-500">
                            {String.fromCharCode(65 + rowIndex)}
                        </span>
                        {row.map((seat) => (
                            <button
                                key={seat.seat_number}
                                className={`seat w-8 h-8 ml-1 border-2 bg-gray-100 rounded-lg cursor-pointer ${seat.is_available
                                    ? seat.selected
                                        ? 'bg-green-400'
                                        : 'border-green-300'
                                    : 'border-red-300 cursor-not-allowed'
                                    }`}
                                onClick={() => handleSeatClick(seat, rowIndex, 'gold')}
                                disabled={!seat.is_available}
                                aria-label={`Seat ${seat.seat_number}`}
                            >
                                <span className="text-xs text-slate-300">{seat.seat_number}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            {/* Silver Seats Section */}
            <div className="seat-section flex flex-col justify-center items-center">
                <h3 className="text-md mb-3 text-gray-400">Rs. 120 SILVER</h3>
                {silverSeats.map((row, rowIndex) => (
                    <div key={`silver-row-${rowIndex}`} className="seat-row flex justify-center mb-3">
                        <span className="row-label mr-3 text-slate-500">
                            {String.fromCharCode(65 + goldSeats.length + rowIndex)}
                        </span>
                        {row.map((seat) => (
                            <button
                                key={seat.seat_id}
                                className={`seat w-8 h-8 border-2 ml-1 bg-gray-100 rounded-lg cursor-pointer ${seat.is_available
                                    ? seat.selected
                                        ? 'bg-green-400'
                                        : 'border-green-300'
                                    : 'border-red-300 cursor-not-allowed'
                                    }`}
                                onClick={() => handleSeatClick(seat, rowIndex, "silver")}
                                disabled={!seat.is_available}
                                aria-label={`Seat ${seat.seat_label}`}
                            >
                                <span className="text-xs text-slate-300">{seat.seat_number}</span>
                            </button>
                        ))}
                    </div>
                ))}
                <div className="flex flex-col justify-center items-center mb-20">
                    <span className="text-gray-400">screen</span>
                    <span className="text-gray-500">All eyes this way please!</span>
                </div>
            </div>

            {/* Pay Button with Motion Animation */}
            {isAnySeatSelected && (
                <motion.div
                    className="fixed bottom-0 left-0 right-0 p-4 shadow-lg text-center"
                    initial={{ y: '100%' }} // Start from the bottom
                    animate={{ y: 0 }} // Animate to the top
                    transition={{ type: 'spring', stiffness: 80 }}
                >
                    <button className="pay-button bg-red-500 w-96 h-12 text-white text-lg py-2 px-6 rounded-lg shadow-md opacity-90" onClick={handlePayNow} >
                        <div className="flex w-full justify-center items-center gap-2 
">

                            <span  > Pay Now</span>
                            <span><SiAmazonpay className='text-white' size={24} /></span>
                        </div>
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default SeatSelectionPage;
