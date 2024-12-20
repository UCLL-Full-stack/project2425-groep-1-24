import Header from '@components/header';
import Head from 'next/head';
import styles from '@styles/home.module.css';
import OverviewComponent from '../../components/Overview';

const Overview: React.FC = () => {
    return (
        <>
            <Head>
                <title>BudgetWise</title>
                <meta name="description" content="BudgetWise" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/budgetwise-logo.png" />
            </Head>
            <Header />
            <main>
                <OverviewComponent />
            </main>
        </>
    );
};

export default Overview;
