import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";

import logo from "../assets/logo/logo.png";

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);

    const fetchTickets = async () => {
        const email = Cookies.get("email");
        try {
            const response = await axios.get(
                `http://10.16.48.202:8080/movie_booking_backend/getUserTickets?email=${email}`
            );
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    // Sort tickets by booking time in descending order
    const sortedTickets = tickets.sort((a, b) => new Date(b.booking_time) - new Date(a.booking_time));

    return (
        <div className="container mx-auto p-4 min-h-[100vh] bg-slate-50 relative">
            {/* Title */}
            <motion.h1
                className="text-3xl font-bold mb-10 flex items-center justify-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <span className="text-black">My Tickets </span>
                <img src={logo} alt="Logo" className="inline-block h-8 mx-2" />
                <span className="text-black">..</span>
            </motion.h1>

            {/* Ticket Grid Layout */}
            {sortedTickets.length === 0 ? (
                <p className="text-gray-500 text-center">No tickets found!</p>
            ) : (
                <div
                    className="grid gap-4"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    }}
                >
                    {sortedTickets.map((ticket) => (
                        <motion.div
                            key={ticket.ticket_id}
                            className="ticket-card bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center relative"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            style={{
                                width: "100%", // Make the card flexible to fill available space
                                maxWidth: "350px", // Set a maximum width for each card
                                height: "440px", // Adjust height to make it look like a ticket
                                position: "relative", // To position the overlay
                            }}
                        >
                            {/* Ticket Header with Portrait Image */}
                            <div className="flex p-4" style={{ position: "relative" }}>
                                <div className="ticket-header flex-shrink-0 relative">
                                    <img
                                        src={ticket.poster_url}
                                        alt={ticket.movie_name}
                                        className="w-32 h-48 object-cover rounded-lg mx-auto"
                                    />
                                </div>
                                <div className="ml-4 flex flex-col mt-5">
                                    <h2 className="text-xl font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis max-w-xs pb-2">
                                        {ticket.movie_name.split(" ").length > 2
                                            ? ticket.movie_name.split(" ").slice(0, 2).join(" ") + "..."
                                            : ticket.movie_name}
                                    </h2>

                                    <p className="text-gray-600 whitespace-nowrap">
                                        <span className="font-medium">Date:</span> {ticket.show_date}
                                    </p>
                                    <p className="text-gray-600 whitespace-nowrap">
                                        <span className="font-medium">Time:</span> {ticket.show_time}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Theater:</span>{" "}
                                        {ticket.theater_name},{" "}
                                        {ticket.address
                                            .split(" ")
                                            .map((word, index) => {
                                                return word.length > 8
                                                    ? `${word.slice(0, 5)}...`
                                                    : word;
                                            })
                                            .join(" ")}
                                    </p>
                                </div>
                            </div>

                            {/* Ticket Body */}
                            <div className="ticket-body text-center px-4 py-2">
                                <motion.div
                                    className="mt-2 pt-4 text-gray-600 text-left w-full px-4 space-y-2 border-t border-gray-300"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <p>
                                        <span className="font-medium">Seats:</span>{" "}
                                        {ticket.seats.map((seat) => seat.seat_label).join(", ")}
                                    </p>
                                    <p>
                                        <span className="font-medium">Tier:</span> {ticket.seats[0].tier}
                                    </p>

                                    <p>
                                        <span className="font-medium">Status:</span> {ticket.status}
                                    </p>
                                    <p>
                                        <span className="font-medium">Booking Time:</span>{" "}
                                        {new Date(ticket.booking_time).toLocaleString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </motion.div>
                            </div>
                            <div className="flex w-full p-4 justify-between items-center bg-gray-100">
                                <span>
                                    <span className="font-medium">Total amount</span>
                                </span>
                                <span>₹{ticket.total_amount}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets;