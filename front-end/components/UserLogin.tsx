import UserService from '@services/UserService';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from '@styles/home.module.css';
import ForgotPasswordPopup from './ForgotPasswordPopup';

const UserLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const router = useRouter();

    const validate = () => {
        let result = true;
        if (username.length === 0) {
            setUsernameError('Username is required!');
            result = false;
        }
        if (password.length === 0) {
            setPasswordError('Password is required!');
            result = false;
        }
        return result;
    };

    const clearErrors = () => {
        setUsernameError('');
        setPasswordError('');
        setLoginError('');
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();

        const validateBool = validate();
        if (!validateBool) {
            return;
        }

        try {
            const res = await UserService.userLogin({ username, password });

            // Wait for the server to set the HttpOnly cookie
            if (res && res.role) {
                setTimeout(() => {
                    router.push('/'); // Give time for cookie to apply
                }, 100);
            } else {
                setLoginError('Username or password is wrong');
            }
        } catch (error: any) {
            console.error('Login error:', error.message);

            if (error.message === 'Username is incorrect.') {
                setUsernameError('Username is incorrect');
            } else if (error.message === 'Password is incorrect.') {
                setPasswordError('Password is incorrect');
            } else if (error.message.includes('Too many login attempts')) {
                setLoginError('Too many login attempts. Please try again after 15 minutes.');
            } else {
                setLoginError('Username or password is wrong');
            }
        }
    };

    return (
        <form onSubmit={handleLogin} className={styles.login}>
            <h1>Welcome back!</h1>
            <h6>Please enter your details</h6>
            <label htmlFor="username">
                Username
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            {usernameError && <>{usernameError}</>}

            <label htmlFor="password">
                Password
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className=""
                />
            </label>
            {passwordError && <p className="">{passwordError}</p>}

            {loginError && <p className="">{loginError}</p>}
            <button type="submit" className="">
                Login
            </button>
            <h6
                className={styles.forgot}
                onClick={() => setShowForgotPassword(true)}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            >
                Forgot Password?
            </h6>
            <h6>
                Don't have an account? &nbsp;
                <a href="/register">Sign up</a>
            </h6>
            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <ForgotPasswordPopup
                    isOpen={showForgotPassword}
                    onClose={() => setShowForgotPassword(false)}
                />
            )}
        </form>
    );
};

export default UserLogin;
