import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../assets/logo/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const loginData = {
            email,
            password,
        };

        axios.post('http://your-backend-url.com/login', loginData)
            .then((response) => {
                setSuccessMessage('Logged in successfully!');
                setErrorMessage('');
                // Handle redirect or token storage here
            })
            .catch((error) => {
                setErrorMessage('Invalid credentials. Please try again.');
                setSuccessMessage('');
            });
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-slate-50'>
            <div className="max-w-6xl h-[60vh] flex rounded-3xl shadow-lg overflow-hidden">
                {/* Left Side: Login Form */}
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
                        Log in to your account
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
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email"
                                className="mt-1 block w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 focus:bg-white"
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
                                Log In
                            </button>
                        </motion.div>
                    </motion.form>

                    {errorMessage && (
                        <motion.p className="text-red-500 text-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                            {errorMessage}
                        </motion.p>
                    )}
                    {successMessage && (
                        <motion.p className="text-green-500 text-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                            {successMessage}
                        </motion.p>
                    )}
                </motion.div>

                {/* Right Side: Welcome message */}
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
                        Welcome Back!
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg text-center mb-4"
                    >
                        Please log in to access your account and continue enjoying our services.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-center justify-self-end mt-14 text-gray-200"
                    >
                        Don't have an account?
                        <Link to="/signup" className="text-blue-400 hover:underline ml-2">
                            Sign up here.
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
