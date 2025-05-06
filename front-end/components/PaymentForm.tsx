import React, { useEffect, useState } from 'react';
import styles from '@styles/home.module.css';
import categoryService from '@services/CategoryService';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/router';
import UserService from '@services/UserService';
import PaymentService from '@services/PaymentService';
import AddPayment from 'pages/addPayment';
import AddPaymentPopup from '@components/addCategoryPopup';

interface CustomJwtPayload extends JwtPayload {
    role?: 'user' | 'admin';
    username?: string;
}

const PaymentForm: React.FC = () => {
    const [amount, setAmount] = useState<number>();
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<string>('Food');
    const [categories, setCategories] = useState<any[]>([]);
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | undefined>(undefined); // State variable for role
    const [date, setDate] = useState<string | undefined>(undefined);
    const [showAddPaymentPopup, setShowAddPaymentPopup] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        categoryService.getAll().then((data) => setCategories(data));
        setCategory(category);
    }, []);

    const handleAddCategoryClick = () => {
        setShowAddPaymentPopup(true);
    };

    const handleCancelClick = () => {
        setShowAddPaymentPopup(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await UserService.getLoggedInUser(); // makes backend call with cookie

                if (user?.username) {
                    setLoggedInUser(user.username);
                    setUserRole(user.role);
                } else {
                    // No user returned – possibly not authenticated
                    setLoggedInUser(null);
                    router.push('/login');
                }
            } catch (error) {
                console.error('Failed to fetch logged-in user:', error);
                setLoggedInUser(null);
                router.push('/login');
            }
        };

        fetchData();
    }, [router]);

    useEffect(() => {
        categoryService.getAll().then((data) => setCategories(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ amount, description, category });
        if (!loggedInUser) {
            throw new Error('User not logged in');
        }
        const user = await UserService.getUserByUsername(loggedInUser);
        const categoryObj = categories.find((c) => c.name === category);
        if (!categoryObj) {
            throw new Error('Invalid category');
        }
        if (amount === undefined) {
            throw new Error('Amount is required');
        }
        if (!date) {
            throw new Error('Date is required');
        }
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error('Invalid amount');
        }
        if (!Date.parse(date)) {
            throw new Error('Invalid date format');
        }
        const payment = { amount, date: new Date(date), description, category: categoryObj, user };
        PaymentService.addPayment(payment);
        // Show notification
        setNotification('Payment added successfully!');

        // Clear form fields
        setAmount(0);
        setDate('');
        setDescription('');
        setCategory('');
    };
    const handleAddCategory = async (categoryName: string) => {
        const categoryObj = { name: categoryName };
        await categoryService.createCategory(categoryObj);
        const updatedCategories = await categoryService.getAll();
        setCategories(updatedCategories);
        setShowAddPaymentPopup(false);
    };

    const validateDescription = (input: string) => {
        // Allow basic punctuation and alphanumeric characters
        const regex = /^[a-zA-Z0-9 .,!?'-]{0,200}$/;
        return regex.test(input);
    };
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {notification && <div className="text-primary-yellow">{notification}</div>}
            <label>
                Amount:
                <input
                    type="number"
                    value={amount}
                    min={0.01}
                    step={0.01}
                    required
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
            </label>
            <label>
                Date:
                <input
                    type="date"
                    value={date}
                    required
                    onChange={(e) => setDate(e.target.value)}
                />
            </label>
            <label>
                Description:
                <textarea
                    value={description}
                    required
                    onChange={(e) => {
                        const input = e.target.value;
                        if (validateDescription(input)) {
                            setDescription(input);
                        }
                    }}
                    rows={4} // Number of visible lines
                    cols={40} // Number of visible columns
                    maxLength={200} // Maximum length of the input
                    className={styles.customtextbox} // Optional styling
                />
            </label>
            <label>
                Category:
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </label>
            <button onClick={handleAddCategoryClick} className={styles.addCategoryButton}>
                Add Category
            </button>
            {showAddPaymentPopup && (
                <AddPaymentPopup onCancel={handleCancelClick} onConfirm={handleAddCategory} />
            )}

            <button type="submit">Add Payment</button>
        </form>
    );
};

export default PaymentForm;
