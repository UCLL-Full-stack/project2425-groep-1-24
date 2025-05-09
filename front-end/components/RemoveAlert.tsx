import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import styles from '@styles/home.module.css';

interface RemoveAlertProps {
    onCancel: () => void;
    onConfirm: () => void;
}

const RemoveAlert: React.FC<RemoveAlertProps> = ({ onCancel, onConfirm }) => {
    return (
        <>
            <div className={styles.overlay}>
                <div className={styles.logoutAlert}>
                    <ExclamationTriangleIcon className="h-20" />
                    <h3>Delete Profile</h3>
                    <p>Are you sure you want to delete your profile?</p>
                    <div className={styles.buttons}>
                        <button className={styles.cancel} onClick={onCancel} type="button">
                            Cancel
                        </button>
                        <button className={styles.confirm} onClick={onConfirm} type="button">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RemoveAlert;
