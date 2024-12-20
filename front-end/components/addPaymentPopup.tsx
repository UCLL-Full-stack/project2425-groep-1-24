import React, { useState } from 'react';
import styles from '@styles/home.module.css';

interface AddPaymentPopupProps {
    onCancel: () => void;
    onConfirm: (categoryName: string) => void;
}

const AddPaymentPopup: React.FC<AddPaymentPopupProps> = ({ onCancel, onConfirm }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleConfirm = () => {
        onConfirm(categoryName);
    };

    return (
        <>
            <div className={styles.overlay}>
                <div className={styles.addPaymentPopup}>
                    <h3>Add Category</h3>

                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        className={styles.input}
                    />

                    <div className={styles.buttons}>
                        <button className={styles.cancel} onClick={onCancel} type="button">
                            Cancel
                        </button>
                        <button className={styles.confirm} onClick={handleConfirm} type="button">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddPaymentPopup;
