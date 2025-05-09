import React, { useState } from 'react';
import styles from '@styles/home.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (current: string, newPass: string) => void;
}

const ChangePasswordPopup: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (newPassword !== repeatPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (!passwordPolicy.test(newPassword)) {
            setError(
                'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one digit.'
            );
            return;
        }

        setError('');
        onSubmit(currentPassword, newPassword);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.addPaymentPopup}>
                <h3>Change Password</h3>
                {error && <p>{error}</p>}
                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    className={styles.input}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    className={styles.input}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Repeat New Password"
                    value={repeatPassword}
                    className={styles.input}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <div className={styles.buttons}>
                    <button className={styles.cancel} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.confirm} onClick={handleSubmit}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPopup;
