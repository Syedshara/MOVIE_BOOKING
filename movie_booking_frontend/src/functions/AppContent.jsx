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

const AppContent = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const openSearchOverlay = () => {
        setIsSearchOpen(true);
    };

    const closeSearchOverlay = () => {
        setIsSearchOpen(false);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar>
                <SidebarItem icon={<Home size={20} />} text="Home" to="/" />
                <SidebarItem icon={<IoTicketOutline size={20} />} text="MyTickets" to="/my-tickets" />
                <SidebarItem icon={<IoSearchSharp size={20} />} text="Search" onClick={openSearchOverlay} />
                <SidebarItem icon={<IoMdLogOut size={24} />} text="Logout" />
            </Sidebar>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-4">
                {isSearchOpen && <SearchOverlay onClose={closeSearchOverlay} />}
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/booking/:id" element={<BookingPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default AppContent;