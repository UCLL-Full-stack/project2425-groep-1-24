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
                <link rel="icon" href="/images/budgetwise-logo.png" />
            </Head>
            <Header />
            <main className={styles.main}>
                <div className={styles.content}>
                    <Image
                        src="/images/main-page-img.png"
                        alt="Main Page Image"
                        width={1000}
                        height={1000}
                    />
                    <div className={styles.description}>
                        <h1>Welcome to BUDGETWISE</h1>
                        <p>
                            BudgetWise is a web application made to help you control your finances.
                            Users can track all their expenses by adding payments, categorize them
                            into sections like food, recreation, rent, ... . With BudgetWise users
                            can also visualize their spending habits in customizable graphs. With
                            this application users will gain insights, set financial goals, and make
                            smarter budgeting decisions.
                        </p>
                    </div>
                </div>
                <div className={styles.table}>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>bramcelis</td>
                                <td>bramcelis</td>
                                <td>admin</td>
                            </tr>
                            <tr>
                                <td>jefvermeiren</td>
                                <td>jefvermeiren</td>
                                <td>user</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
};

export default Home;
