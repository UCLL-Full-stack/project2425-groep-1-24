import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import PaymentForm from '@components/PaymentForm';

const AddPayment: React.FC = () => {
    return (
        <>
            <Head>
                <title>BudgetWise</title>
                <meta name="description" content="BudgetWise" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/budgetwise-logo.png" />
            </Head>
            <Header />
            <main className={styles.main}>
                <PaymentForm />
            </main>
        </>
    );
};

export default AddPayment;
