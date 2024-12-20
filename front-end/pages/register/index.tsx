import Header from '@components/header';
import Head from 'next/head';
import styles from '@styles/home.module.css';
import RegisterComponent from '@components/UserRegister';
const RegisterPage = () => {
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
                <RegisterComponent />
            </div>
        </>
    );
};

export default RegisterPage;
