import React, { useEffect, useState } from 'react';
import { SiAmazonpay } from "react-icons/si";
import { motion } from 'framer-motion'; // Import framer-motion

const SeatSelectionPage = () => {
    const [theaterDetails, setTheaterDetails] = useState({});
    const [goldSeats, setGoldSeats] = useState([]);
    const [silverSeats, setSilverSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]); // Track selected seats

    useEffect(() => {
        // Dummy data simulating database structure
        const screenData = {
            theater_name: 'MovieMax: Huma, Kanjurmarg',
            address: 'Huma Mall, Kanjurmarg, Mumbai',
            gold_rows: 10,
            gold_columns: 20,
            silver_rows: 10,
            silver_columns: 20,
        };

        // Set theater details using dummy data
        setTheaterDetails({
            theater_name: screenData.theater_name,
            address: screenData.address,
        });

        // Generate Gold seats with numbers
        const generatedGoldSeats = [];
        for (let i = 0; i < screenData.gold_rows; i++) {
            const row = [];
            for (let j = 1; j <= screenData.gold_columns; j++) {
                row.push({
                    seat_number: j,
                    is_available: Math.random() > 0.2,
                    selected: false // Initialize selected state
                });
            }
            generatedGoldSeats.push(row);
        }
        setGoldSeats(generatedGoldSeats);

        // Generate Silver seats with numbers
        const generatedSilverSeats = [];
        for (let i = 0; i < screenData.silver_rows; i++) {
            const row = [];
            for (let j = 1; j <= screenData.silver_columns; j++) {
                row.push({
                    seat_number: j,
                    is_available: Math.random() > 0.2,
                    selected: false // Initialize selected state
                });
            }
            generatedSilverSeats.push(row);
        }
        setSilverSeats(generatedSilverSeats);
    }, []);

    // Handle seat selection
    const handleSeatClick = (seat, rowIndex, rowType) => {
        if (seat.is_available) {
            // Update the specific seat selection in the appropriate row (Gold/Silver)
            const updatedSeats = rowType === 'gold' ? [...goldSeats] : [...silverSeats];
            updatedSeats[rowIndex] = updatedSeats[rowIndex].map(s =>
                s.seat_number === seat.seat_number
                    ? { ...s, selected: !s.selected } // Toggle selection for this seat only
                    : s
            );

            // Update the state for the appropriate row
            if (rowType === 'gold') {
                setGoldSeats(updatedSeats);
            } else {
                setSilverSeats(updatedSeats);
            }

            // Update selected seats array
            const selectedSeat = {
                seat_number: seat.seat_number,
                row: rowType,
            };

            const isAlreadySelected = selectedSeats.some(
                (selected) =>
                    selected.seat_number === seat.seat_number &&
                    selected.row === rowType
            );

            if (isAlreadySelected) {
                setSelectedSeats(selectedSeats.filter(
                    (selected) =>
                        selected.seat_number !== seat.seat_number ||
                        selected.row !== rowType
                ));
            } else {
                setSelectedSeats([...selectedSeats, selectedSeat]);
            }
        }
    };

    // Check if any seat is selected
    const isAnySeatSelected = selectedSeats.length > 0;

    return (
        <div className="seat-selection-container p-5 bg-slate-100 font-sans relative">
            {/* Theater Header */}
            <div className="theater-header mb-5">
                <h2 className="text-2xl font-bold">
                    {theaterDetails.theater_name}{' '}
                    {isAnySeatSelected && (
                        <span className="text-xl text-green-500">
                            ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected)
                        </span>
                    )}
                </h2>
                <p className="text-gray-500">{theaterDetails.address}</p>
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
                <h3 className="text-md mb-3 text-gray-400">Rs. 290 SILVER</h3>
                {silverSeats.map((row, rowIndex) => (
                    <div key={`silver-row-${rowIndex}`} className="seat-row flex justify-center mb-3">
                        <span className="row-label mr-3 text-slate-500">
                            {String.fromCharCode(65 + goldSeats.length + rowIndex)}
                        </span>
                        {row.map((seat) => (
                            <button
                                key={seat.seat_number}
                                className={`seat w-8 h-8 border-2 ml-1 bg-gray-100 rounded-lg cursor-pointer ${seat.is_available
                                    ? seat.selected
                                        ? 'bg-green-400'
                                        : 'border-green-300'
                                    : 'border-red-300 cursor-not-allowed'
                                    }`}
                                onClick={() => handleSeatClick(seat, rowIndex, 'silver')}
                                disabled={!seat.is_available}
                                aria-label={`Seat ${seat.seat_number}`}
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
                    <button className="pay-button bg-red-500 w-96 h-12 text-white text-lg py-2 px-6 rounded-lg shadow-md opacity-90">
                        <div className="flex w-full justify-center items-center gap-2">
                            <span> Pay Now</span>
                            <span><SiAmazonpay className='text-white' size={24} /></span>
                        </div>
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default SeatSelectionPage;
