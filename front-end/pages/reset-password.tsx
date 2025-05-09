import Head from 'next/head';
import styles from '@styles/home.module.css';
import ResetPasswordPage from '@components/ResetPassword';

const resetPassword = () => {
    return (
        <>
            <Head>
                <title>Reset Password</title>
                <meta name="description" content="Reset password" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.webp" />
            </Head>
            <div className={styles.main}>
                <ResetPasswordPage />
            </div>
        </>
    );
};

export default resetPassword;
