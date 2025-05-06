import UserService from '@services/UserService';
import styles from '@styles/home.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
const UserRegister = () => {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const router = useRouter();

    const validate = async () => {
        let result = true;
        const nameRegex = /^[a-zA-ZÀ-ÿ' -]{1,30}$/;
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

        // Validation errors
        if (username.length === 0) {
            setUsernameError('Username is required!');
            result = false;
        } else if (!usernameRegex.test(username)) {
            setUsernameError(
                'Username must be 3–20 characters, using only letters, numbers, - or _'
            );
            result = false;
        } else {
            try {
                await UserService.getUserByUsername(username);
                setUsernameError('Username already exists!');
                result = false;
            } catch (error: any) {
                if (error.message !== 'User not found') {
                    console.error('Unexpected error during username validation:', error);
                    setUsernameError('An unexpected error occurred. Please try again.');
                    result = false;
                } else {
                    setUsernameError(''); // Clear the error if username is available
                }
            }
        }

        const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (password.length === 0) {
            setPasswordError('Password is required!');
            result = false;
        } else if (!passwordPolicy.test(password)) {
            setPasswordError('weak');
            result = false;
        } else {
            setPasswordError(''); // Clear the error if the field is valid
        }

        if (email.length === 0) {
            setEmailError('Email is required!');
            result = false;
        } else {
            try {
                await UserService.getUserByEmail(email);
                setEmailError('Email already exists!');
                result = false;
            } catch (error: any) {
                if (error.message !== 'User not found') {
                    console.error('Unexpected error during email validation:', error);
                    setEmailError('An unexpected error occurred. Please try again.');
                    result = false;
                } else {
                    setEmailError(''); // Clear the error if email is available
                }
            }
        }

        if (firstName.length === 0) {
            setFirstNameError('First name is required!');
            result = false;
        } else if (!nameRegex.test(firstName)) {
            setFirstNameError('Invalid first name. Use only letters and basic punctuation.');
            result = false;
        } else {
            setFirstNameError('');
        }

        if (lastName.length === 0) {
            setLastNameError('Last name is required!');
            result = false;
        } else if (!nameRegex.test(lastName)) {
            setLastNameError('Invalid last name. Use only letters and basic punctuation.');
            result = false;
        } else {
            setLastNameError('');
        }

        return result;
    };

    const clearErrors = () => {
        setUsernameError('');
        setPasswordError('');
        setLoginError('');
        setEmailError('');
        setFirstNameError('');
        setLastNameError('');
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        clearErrors();
        const validateBool = validate();
        if (!validateBool) {
            return;
        }
        try {
            await UserService.addUser({
                username: username.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password,
                role: 'user',
            });
            router.push('/login');
        } catch (error: any) {
            console.error('Register error:', error.message);
        }
    };

    return (
        <form onSubmit={handleRegister} className={styles.login}>
            <h1>Sign up</h1>
            <h6>
                Create an account or &nbsp;
                <a href="/login">Login</a>
            </h6>
            <label htmlFor="email">
                Email
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            {emailError && <>{emailError}</>}
            <label htmlFor="firstName">
                First name
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </label>
            {firstNameError && <>{firstNameError}</>}
            <label htmlFor="lastName">
                Last name
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </label>
            {lastNameError && <>{lastNameError}</>}
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
            {passwordError && passwordError != 'weak' && <>{passwordError}</>}
            {passwordError === 'weak' && (
                <p className="text-xs">
                    Password must be at least 8 characters long
                    <br />
                    and include at least one uppercase letter,
                    <br />
                    one lowercase letter,
                    <br />
                    and one number.
                </p>
            )}

            {loginError && <p className="">{loginError}</p>}
            <button type="submit" className="">
                Sign up
            </button>
        </form>
    );
};

export default UserRegister;
