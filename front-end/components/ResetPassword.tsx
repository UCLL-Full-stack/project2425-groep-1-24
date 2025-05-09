// pages/reset-password.tsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from '@styles/home.module.css'; // Reuse your CSS

const ResetPasswordPage: React.FC = () => {
    const router = useRouter();
    const { token } = router.query;

    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        if (newPassword !== repeatPassword) {
            setError('Passwords do not match.');
            return;
        }

        const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPolicy.test(newPassword)) {
            setError('Password must be at least 8 characters, with upper/lowercase and a number.');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Reset failed');
            setSuccess('Password successfully reset! You can now log in.');
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!token) return <p>Invalid or missing token.</p>;

    return (
        <div className={styles.login}>
            <h1>Reset Your Password</h1>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                className={styles.input}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Repeat Password"
                value={repeatPassword}
                className={styles.input}
                onChange={(e) => setRepeatPassword(e.target.value)}
            />

            <button onClick={handleSubmit} className={styles.confirm}>
                Reset Password
            </button>
        </div>
    );
};

export default ResetPasswordPage;
