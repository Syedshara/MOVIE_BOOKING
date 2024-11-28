// PaymentPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode';

const PaymentPage = () => {
    const [upiID, setUpiID] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const location = useLocation();
    const { showId, totalAmount, selectedSeats, email } = location.state;

    const amount = totalAmount;
    const transactionID = new Date().getTime();
    const upiPaymentId = 'vishalt8114-1@oksbi';
    const upiUrl = `upi://pay?pa=${upiPaymentId}&pn=YourName&mc=0000&tid=${transactionID}&url=https://yourwebsite.com&am=${amount}`;

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, upiUrl, { width: 256 }, (error) => {
                if (error) console.error('Error generating QR Code:', error);
                else console.log('QR Code successfully generated!');
            });
        }
    }, [upiUrl]);

    const handlePayment = async () => {
        if (!upiID || !pin) {
            setError('Please enter both UPI ID and PIN');
            return;
        }

        setLoading(true);
        setError('');
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);

            const payload = {
                showId: showId,
                totalAmount: totalAmount,
                selectedSeats: selectedSeats,
                email: email
            };

            fetch('http://10.16.48.202:8080/movie_booking_backend/bookSeats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    navigate('/my-tickets'); // Replace with your actual route for the ticket page
                })
                .catch((error) => {
                    console.error("Error processing payment:", error);
                });
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg min-w-1/2">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Complete Your Payment</h2>

                {success && (
                    <div className="text-green-600 text-center mb-4">
                        Payment Successful! Redirecting to ticket page...
                    </div>
                )}

                <div className="space-y-6 mb-6">

                    <div>
                        <label htmlFor="upi-id" className="block text-sm font-medium text-gray-700">UPI ID</label>
                        <input
                            type="text"
                            id="upi-id"
                            value={upiID}
                            onChange={(e) => setUpiID(e.target.value)}
                            placeholder="Enter your UPI ID"
                            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="pin" className="block text-sm font-medium text-gray-700">Enter PIN</label>
                        <input
                            type="password"
                            id="pin"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Enter your PIN"
                            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {error && <div className="text-red-600 text-center text-sm">{error}</div>}
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className={`w-full py-3 text-white font-semibold rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} transition duration-300`}
                >
                    {loading ? 'Processing...' : 'Pay'}
                </button>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    If you face issues, make sure to check your UPI app and confirm the payment.
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;