import React, { useState } from 'react';
import { Home } from "lucide-react";
import Sidebar, { SidebarItem } from "../component/SideBar";
import { IoSearchSharp } from "react-icons/io5";
import { IoTicketOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import SearchOverlay from "../component/Search";  // Import the SearchOverlay component
import { Routes, Route } from 'react-router-dom';

import Main from '../pages/Main';
import BookingPage from '../pages/BookingPage';
import ScrollUp from '../component/ScrollUp';
import MovieDetailsPage from '../pages/MovieDetailsPage';
import SeatSelectionPage from '../pages/SeatSelectionPage';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import PaymentPage from '../pages/PaymentPage';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const AppContent = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    const openSearchOverlay = () => {
        setIsSearchOpen(true);
    };

    const closeSearchOverlay = () => {
        setIsSearchOpen(false);
    };
    const handleLogout = () => {
        // Clear userId from localStorage or sessionStorage (depending on where it's stored)
        Cookies.remove('userId');
        // or sessionStorage.removeItem('userId');
        alert("logged out")
        // Navigate to the /main page
        navigate('/');
    };

    return (
        <div className="flex h-screen">
            <ScrollUp />

            {/* Sidebar */}
            <Sidebar>
                <SidebarItem icon={<Home size={20} />} text="Home" to="/" />
                <SidebarItem icon={<IoTicketOutline size={20} />} text="MyTickets" to="/my-tickets" />
                <SidebarItem icon={<IoSearchSharp size={20} />} text="Search" onClick={openSearchOverlay} />
                <SidebarItem icon={<IoMdLogOut size={24} />} onClick={handleLogout} text="Logout" />
            </Sidebar>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-4">
                {isSearchOpen && <SearchOverlay onClose={closeSearchOverlay} />}
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/booking/:id" element={<BookingPage />} />
                    <Route path="/movie-details/:id" element={<MovieDetailsPage />} />
                    <Route path="/seats/:screenId" element={<SeatSelectionPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/payment" element={<PaymentPage />} />

                </Routes>
            </div>
        </div>
    );
};

export default AppContent;