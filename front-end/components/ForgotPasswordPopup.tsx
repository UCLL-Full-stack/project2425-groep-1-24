import React, { useState } from 'react';
import styles from '@styles/home.module.css'; // Reuse the same CSS module
import UserService from '@services/UserService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordPopup: React.FC<Props> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendReset = async () => {
        setError('');
        setMessage('');

        if (!email) {
            setError('Email is required.');
            return;
        }

        try {
            const res = await UserService.forgotPassword(email);

            if (res.message !== 'Reset email sent') {
                throw new Error(res.message || 'Failed to send reset email');
            }

            setMessage('Reset email sent! Please check your inbox.');
        } catch (err: any) {
            setError(`Error: ${err.message}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.addPaymentPopup}>
                <h3>Forgot Password</h3>
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.success}>{message}</p>}
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    className={styles.input}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className={styles.buttons}>
                    <button className={styles.cancel} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.confirm} onClick={handleSendReset}>
                        Send Reset Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPopup;
