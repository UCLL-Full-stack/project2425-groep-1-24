import Link from 'next/link';
import Image from 'next/image';
import styles from '@styles/home.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { JwtPayload } from 'jwt-decode';
import LogoutAlert from './logout';
import UserService from '@services/UserService';
import { FaUserAlt } from 'react-icons/fa';

const FaUserAltIcon = FaUserAlt as React.FC<React.ComponentProps<'svg'>>;

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

    const handleLogout = async () => {
        try {
            const response = await UserService.logout();
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            setLoggedInUser(null);
            setUserRole(undefined);
            setShowLogoutPopup(false);
            sessionStorage.clear();
            router.push('/');
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await UserService.getLoggedInUser();
                if (user) {
                    setLoggedInUser(user.username);
                    setUserRole(user.role);
                } else {
                    // not logged in
                    setLoggedInUser(null);
                    setUserRole(undefined);
                }
            } catch (err: any) {
                console.error('Error fetching logged-in user:', err.message);
            }
        };

        fetchUser();
    }, [router]);

    return (
        <header className="d-flex p-3" style={{ backgroundColor: '#F5BD04' }}>
            <Link href="/">
                <Image
                    src="/images/budgetwise-logo.png"
                    alt="BugetWise Logo"
                    className="ml-[2.5rem] pb-2"
                    width={70}
                    height={70}
                    style={{ filter: 'grayscale(100%)' }}
                />
            </Link>
            <Link
                href="/"
                className="fs-3 ml-[0.75rem] text-black flex justify-content-left text-decoration-none align-items-center font-[Rubik Mono One] font-[800] "
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
                    {loggedInUser && (
                        <Link
                            href="/profile"
                            className={router.pathname === '/profile' ? styles.active : ''}
                        >
                            <FaUserAltIcon className="text-xl text-gray-900 cursor-pointer" />
                        </Link>
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
