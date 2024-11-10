import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollUp = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Ensure scroll to top when navigating to a new page
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Adds smooth scrolling for a better user experience
        });
    }, [pathname]); // Triggers on pathname change

    return null;
};

export default ScrollUp;