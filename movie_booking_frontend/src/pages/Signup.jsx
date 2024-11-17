import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect'; // Import Typewriter for smoother animation
import logo from '../assets/logo/logo.png';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useNavigate } from 'react-router-dom';



const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('user'); // Default to 'user'
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();

        const userData = {
            username: username,
            email: email,
            password: password,
            phoneNumber: phoneNumber,  // phone number is optional
        };

        // API endpoint
        const apiEndpoint = 'http://localhost:8080/movie_booking_backend/signup';  // Make sure the endpoint is for registration

        // Send the POST request with the correct payload
        axios.post(apiEndpoint, userData)
            .then((response) => {
                setSuccessMessage('Account created successfully!');
                setErrorMessage('');
                navigate('/login');
            })
            .catch((error) => {
                setErrorMessage('Error creating account. Please try again.');
                setSuccessMessage('');
            });
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-slate-50'>
            <div className="max-w-6xl h-[60vh] flex rounded-3xl shadow-lg overflow-hidden">
                {/* Left Side: Sign-up Form */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-1/2 bg-white p-8 flex flex-col justify-center"
                >
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-center text-2xl font-semibold text-gray-800"
                    >
                        Create your account
                    </motion.h2>

                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-6 space-y-4"
                    >
                        {/* Form Inputs */}
                        <div className="mb-4">
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Username"
                                className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 focus:bg-white"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email"
                                className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 bg-gray-100 focus:bg-white"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 focus:bg-white"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Phone Number (optional)"
                                className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 focus:bg-white"
                            />
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="mb-4"
                        >
                            <button
                                type="submit"
                                className="w-full mt- py-4 px-4 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Sign Up
                            </button>
                        </motion.div>
                    </motion.form>

                    {errorMessage && (
                        <motion.p className="text-red-500 text-sm text-center mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                            {errorMessage}
                        </motion.p>
                    )}
                    {successMessage && (
                        <motion.p className="text-green-500 text-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                            {successMessage}
                        </motion.p>
                    )}
                </motion.div>

                {/* Right Side: Hello message with Typing Animation */}
                <div className="w-1/2 bg-slate-800 text-white p-8 flex flex-col justify-start">
                    <div className="text-center mt-4 mb-4">
                        <img src={logo} alt="Logo" className="h-16 mx-auto" />
                    </div>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl font-semibold mb-4 mt-24 text-center"
                    >
                        <Typewriter
                            options={{
                                strings: ['Hello!', 'Welcome to our platform.'],
                                autoStart: true,
                                loop: true,
                                delay: 120, // Smooth typing speed
                                deleteSpeed: 100, // Smooth delete speed
                                pauseFor: 2500, // Pause after typing each string
                                cursor: '|', // Custom cursor for smoother feel
                            }}
                        />
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg text-center mb-4"
                    >
                        Join us and create an account to experience our awesome services. We're excited to have you on board!
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-center justify-self-end mt-14 text-gray-200"
                    >
                        Already have an account?
                        <Link to="/login" className="text-blue-400 hover:underline ml-2">
                            Log in here.
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
