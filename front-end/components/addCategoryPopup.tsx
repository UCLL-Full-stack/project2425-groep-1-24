import React, { useState } from 'react';
import styles from '@styles/home.module.css';

interface AddCategoryPopupProps {
    onCancel: () => void;
    onConfirm: (categoryName: string) => void;
}

const AddCategoryPopup: React.FC<AddCategoryPopupProps> = ({ onCancel, onConfirm }) => {
    const [categoryName, setCategoryName] = useState('');

    const isValidCategoryName = (name: string): boolean => {
        const regex = /^[a-zA-Z0-9\s\-]{1,30}$/; // allows letters, numbers, spaces, dashes; max 30 chars
        return regex.test(name);
    };

    const handleConfirm = () => {
        if (!isValidCategoryName(categoryName)) {
            alert(
                'Invalid category name. Only letters, numbers, spaces, and dashes are allowed (max 30 characters).'
            );
            return;
        }

        onConfirm(categoryName.trim());
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
                        maxLength={30}
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

export default AddCategoryPopup;
