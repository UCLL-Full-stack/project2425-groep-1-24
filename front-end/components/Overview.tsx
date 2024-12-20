import styles from '@styles/home.module.css';
import { Chart, registerables } from 'chart.js';
import { use, useEffect, useRef, useState } from 'react';
import categoryService from '@services/CategoryService';
import PaymentService from '@services/PaymentService';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/router';
import UserService from '@services/UserService';

Chart.register(...registerables);

interface CustomJwtPayload extends JwtPayload {
    role?: 'user' | 'admin';
    username?: string;
}

const Overview: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState('all periods');
    const chartInstanceRef = useRef<Chart | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [paymentsUser, setPaymentsUser] = useState<any[]>([]);
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | undefined>(undefined); // State variable for role
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [totalAmount, setTotalAmount] = useState(0);

    interface TooltipInfo {
        label: string;
        value: number;
        percentage: string;
    }

    const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);

    useEffect(() => {
        PaymentService.getAll().then((data) => setPayments(data));
    }, []);

    useEffect(() => {
        categoryService.getAll().then((data) => setCategories(data));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            // Function to read a specific cookie by name
            const getCookie = (name: string) => {
                const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                return match ? decodeURIComponent(match[2]) : null;
            };

            const token = getCookie('token');
            if (!token) {
                console.log('No token found, redirecting to login');
                router.push('/login'); // Redirect if no token is found
            } else {
                try {
                    const decodedToken = jwtDecode<CustomJwtPayload>(token);
                    const username = decodedToken.username;
                    const role = decodedToken.role;
                    if (username) {
                        const user = await UserService.getUserByUsername(username);
                        if (user) {
                            setUserId(user.id);
                        }
                    }

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
        };

        fetchData();
    }, [router]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        // Destroy previous chart instance if it exists
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Unable to get canvas context');
            return;
        }

        if (!userId || payments.length === 0 || categories.length === 0) {
            console.log('Waiting for userId, payments, or categories to load');
            return; // Ensure all necessary data is available
        }

        // Helper function to calculate the date range for the selected period
        const filterPaymentsByPeriod = (payments: any[]) => {
            const now = new Date();

            const startDate = (() => {
                switch (selectedPeriod) {
                    case 'today':
                        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    case 'last week':
                        const lastWeekStart = new Date();
                        lastWeekStart.setDate(now.getDate() - 7);
                        return lastWeekStart;
                    case 'last month':
                        const lastMonthStart = new Date(
                            now.getFullYear(),
                            now.getMonth() - 1,
                            now.getDate()
                        );
                        return lastMonthStart;
                    case 'last year':
                        const lastYearStart = new Date(
                            now.getFullYear() - 1,
                            now.getMonth(),
                            now.getDate()
                        );
                        return lastYearStart;
                    default:
                        return null; // No filtering for 'all periods'
                }
            })();

            // Filter payments by date range
            return startDate
                ? payments.filter((payment) => new Date(payment.date) >= startDate)
                : payments; // Return all payments if no startDate is defined
        };

        // Filter payments for the logged-in user
        const paymentsData = payments.filter((payment) => payment.user.id === userId);

        // Apply the selected period filter
        const filteredPayments = filterPaymentsByPeriod(paymentsData);
        setPaymentsUser(filteredPayments);

        // Prepare data for the chart
        const data = {
            labels: categories.map((category) => category.name),
            datasets: [
                {
                    data: categories.map((category) => {
                        const categoryPayments = filteredPayments.filter(
                            (payment) => payment.category.id === category.id
                        );
                        return categoryPayments.reduce((acc, payment) => acc + payment.amount, 0);
                    }),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Example colors
                    hoverOffset: 4,
                },
            ],
        };

        const totalValue = data.datasets[0].data.reduce((acc, value) => acc + value, 0);

        // Create the chart instance
        const chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    tooltip: {
                        enabled: false,
                        external: (context) => {
                            const tooltipModel = context.tooltip;
                            if (tooltipModel.opacity === 0) {
                                setTooltipInfo(null);
                                return;
                            }
                            const dataPoint = tooltipModel.dataPoints[0];
                            const percentage = (
                                ((dataPoint.raw as number) / totalValue) *
                                100
                            ).toFixed(2);
                            setTooltipInfo({
                                label: dataPoint.label,
                                value: dataPoint.raw as number,
                                percentage: percentage,
                            });
                        },
                    },

                    legend: {
                        position: 'top',
                    },
                },
            },
        });

        // Save the chart instance to the ref
        chartInstanceRef.current = chartInstance;

        // Clean up the chart instance on unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [userId, payments, categories, selectedPeriod]); // Re-run when userId, payments, or categories change

    return (
        <>
            <div className={styles.chart}>
                <h1>Overview</h1>
                <div className={styles.form}>
                    <main>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className={styles.customDropdown}
                        >
                            <option value="today">Today</option>
                            <option value="last week">Last Week</option>
                            <option value="last month">Last Month</option>
                            <option value="last year">Last Year</option>
                            <option value="all periods">All Periods</option>
                        </select>
                        <div className={styles.canvasContainer}>
                            <canvas ref={canvasRef} className={styles.canvas} />
                            {tooltipInfo && (
                                <div className={styles.tooltip}>
                                    <p>{tooltipInfo.label}</p>
                                    <p>{tooltipInfo.value}€</p>
                                    <p>{tooltipInfo.percentage}%</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};
export default Overview;
