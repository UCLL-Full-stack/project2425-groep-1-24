import { Payment } from '@types';

const getAll = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/payments`);

        // Check if the response is not ok (i.e., 400-500 status codes)
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || 'Failed to fetch payments';
            throw new Error(errorMessage);
        }

        // Return the response JSON if available
        return await response.json(); // Return the JSON body of the response
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch payments');
    }
};

const addPayment = async (payment: Payment) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/payments/createPayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payment),
        });

        // Check if the response is not ok (i.e., 400-500 status codes)
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || 'Failed to register payment';
            throw new Error(errorMessage);
        }

        // Return the response JSON if available
        return await response.json(); // Return the JSON body of the response
    } catch (error: any) {
        throw new Error(error.message || 'Failed to register payment');
    }
};

const PaymentService = {
    addPayment,
    getAll,
};

export default PaymentService;
