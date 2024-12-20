import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import styles from '@styles/home.module.css';

interface LogoutAlertProps {
    onCancel: () => void;
    onConfirm: () => void;
}

const LogoutAlert: React.FC<LogoutAlertProps> = ({ onCancel, onConfirm }) => {
    return (
        <>
            <div className={styles.overlay}>
                <div className={styles.logoutAlert}>
                    <ExclamationTriangleIcon className="h-20" />
                    <h3>LOGOUT</h3>
                    <p>Are you sure you want to logout?</p>
                    <div className={styles.buttons}>
                        <button className={styles.cancel} onClick={onCancel} type="button">
                            Cancel
                        </button>
                        <button className={styles.confirm} onClick={onConfirm} type="button">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogoutAlert;
