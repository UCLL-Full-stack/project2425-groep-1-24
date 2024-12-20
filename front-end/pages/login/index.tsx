import Head from 'next/head';
import Image from 'next/image';
import LoginComponent from '../../components/UserLogin';
import Header from '@components/header';
import styles from '@styles/home.module.css';

const LoginPage = () => {
    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Login page for users" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.webp" />
            </Head>
            <Header />
            <div className={styles.main}>
                <LoginComponent />
            </div>
        </>
    );
};

export default LoginPage;
