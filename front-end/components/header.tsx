import Link from 'next/link';
import Image from 'next/image';
import styles from '@styles/home.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import LogoutAlert from './logout';
import { log } from 'console';

interface CustomJwtPayload extends JwtPayload {
    role?: 'user' | 'admin';
    username?: string;
}

const Header: React.FC = () => {
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | undefined>(undefined); // State variable for role
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    };

    const handleCancelClick = () => {
        setShowLogoutPopup(false);
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        document.cookie = 'token=; Max-Age=0; path=/;';
        setUserRole(undefined);
        setShowLogoutPopup(false);
        sessionStorage.clear();
        router.push('/');
    };

    useEffect(() => {
        // Function to read a specific cookie by name
        const getCookie = (name: string) => {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? decodeURIComponent(match[2]) : null;
        };

        const token = getCookie('token');
        if (!token) {
            console.log('No token found');
        } else {
            try {
                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                const username = decodedToken.username;
                const role = decodedToken.role;
                setUserRole(role); // Set the role in the state variable
                if (username && token) {
                    setLoggedInUser(username);
                } else {
                    setLoggedInUser(null);
                }
            } catch (error) {
                console.error('Invalid token:', error);
                router.push('/login'); // Redirect if token is invalid
            }
        }
    }, [router]);
    return (
        <header className="bg-primary-yellow d-flex p-3">
            <Link href="/">
                <Image
                    src="/images/budgetwise-logo.png"
                    alt="BugetWise Logo"
                    className="ml-10 pb-2"
                    width={70}
                    height={70}
                    style={{ filter: 'grayscale(100%)' }}
                />
            </Link>
            <Link
                href="/"
                className="fs-3 ml-3 text-black d-flex justify-content-left text-decoration-none align-items-center font-sans font-extrabold"
            >
                BUDGETWISE
            </Link>

            <nav className={`${styles.nav} ml-auto`}>
                <nav className={`${styles.nav} ml-auto`}>
                    <Link href="/" className={router.pathname === '/' ? styles.active : ''}>
                        HOME
                    </Link>
                    {loggedInUser && userRole === 'user' && (
                        <Link
                            href="/overview"
                            className={router.pathname === '/overview' ? styles.active : ''}
                        >
                            OVERVIEW
                        </Link>
                    )}
                    {loggedInUser && userRole === 'user' && (
                        <Link
                            href="/addPayment"
                            className={router.pathname === '/addPayment' ? styles.active : ''}
                        >
                            ADD PAYMENT
                        </Link>
                    )}
                    {!loggedInUser && (
                        <Link
                            href="/login"
                            className={router.pathname === '/login' ? styles.active : ''}
                        >
                            LOGIN
                        </Link>
                    )}
                    {loggedInUser && (
                        <div
                            className={`${styles.logout} ${
                                router.pathname === '/login' ? styles.active : ''
                            }`}
                            onClick={handleLogoutClick}
                        >
                            LOGOUT
                        </div>
                    )}
                    {showLogoutPopup && (
                        <LogoutAlert onCancel={handleCancelClick} onConfirm={handleLogout} />
                    )}
                </nav>
            </nav>
        </header>
    );
};

export default Header;
