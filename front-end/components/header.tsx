import Link from 'next/link';
import Image from 'next/image';
import styles from '@styles/home.module.css';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
    const router = useRouter();
    return (
        <header className="bg-primary-yellow d-flex p-3">
            <Link href="/">
                <Image
                    src="/images/budgetwise-logo.png"
                    alt="BugetWise Logo"
                    className="ml-20 pb-2"
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
                    <Link
                        href="/account"
                        className={router.pathname === '/account' ? styles.active : ''}
                    >
                        ACCOUNT
                    </Link>
                    <Link
                        href="/contact"
                        className={router.pathname === '/contact' ? styles.active : ''}
                    >
                        CONTACT
                    </Link>
                </nav>
            </nav>
        </header>
    );
};

export default Header;
