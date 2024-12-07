import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/header';
import styles from '@styles/home.module.css';

const Home: React.FC = () => {
    return (
        <>
            <Head>
                <title>BudgetWise</title>
                <meta name="description" content="BudgetWise" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.main}>
                <h1>Welcome to BUDGETWISE</h1>
                <Image
                    src="/images/budgetwise-logo.png"
                    alt="BudgetWise Logo"
                    width={70}
                    height={70}
                />

                <div className={styles.description}>
                    <p>
                        BudgetWise is a web application made to help you control your finances.
                        Users can track all their expenses by adding payments, categorize them into
                        sections like food, recreation, rent, ... . Users can add notifications for
                        when a specific category of expenses reaches a certain limit. With
                        BudgetWise users can also visualize their spending habits in customizable
                        graphs. With this application users will gain insights, set financial goals,
                        and make smarter budgeting decisions.
                    </p>
                </div>
            </main>
        </>
    );
};

export default Home;
