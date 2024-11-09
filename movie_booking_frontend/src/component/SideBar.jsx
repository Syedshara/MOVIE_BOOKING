import { useContext, createContext, useState } from "react";
import { TbLayoutSidebarLeftExpand, TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import logo from "../assets/logo/logo.png";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <aside className={`h-screen transition-all duration-300 ${expanded ? "w-64" : "w-16"}`}>
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                {/* Logo and Toggle Section */}
                <div className="p-4 pb-2 flex items-center justify-between">
                    <img
                        src={logo}
                        className={`transition-all duration-300 ${expanded ? "w-32" : "w-0"}`}
                        alt="Logo"
                    />
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {expanded ? (
                            <TbLayoutSidebarLeftCollapse size={24} />
                        ) : (
                            <TbLayoutSidebarLeftExpand size={24} />
                        )}
                    </button>
                </div>

                {/* Sidebar Items */}
                <SidebarContext.Provider value={{ expanded }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>

                {/* User Profile Section */}
            </nav>
        </aside>
    );
}

import { Link } from "react-router-dom"; // Import Link from react-router-dom

export function SidebarItem({ icon, text, to, alert, onClick }) {
    const { expanded } = useContext(SidebarContext);
    const location = useLocation(); // Hook to get the current route

    const isActive = location.pathname === to; // Check if current route matches the 'to' prop

    return (
        <li
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${isActive
                ? "bg-gradient-to-tr from-red-200 to-red-100 text-orange-800"
                : "hover:bg-red-50 text-gray-600"
                }`}
            onClick={onClick}
        >
            {/* Wrap in Link to handle navigation */}
            <Link to={to} className="flex w-full items-center">
                <div className="w-6 h-6 flex justify-center items-center">
                    {icon}
                </div>
                <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                    {text}
                </span>
            </Link>

            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-red-400 ${expanded ? "" : "top-2"
                        }`}
                />
            )}

            {!expanded && (
                <div
                    className={`absolute z-50 left-full rounded-md px-2 py-1 ml-6 bg-orange-100 text-orange-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                >
                    {text}
                </div>
            )}
        </li>
    );
}