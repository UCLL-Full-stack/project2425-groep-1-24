import UserService from '@services/UserService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@styles/home.module.css';
import { cp } from 'fs';
import RemoveAlert from './RemoveAlert';
import ChangePasswordPopup from './ChangePasswordPopup';

const Profile: React.FC = () => {
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | undefined>(undefined); // State variable for role
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [fullUser, setFullUser] = useState<any>(null); // State variable for full user data
    const [showRemovePopup, setShowRemovePopup] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await UserService.getLoggedInUser(); // makes backend call with cookie

                if (user?.username) {
                    setLoggedInUser(user.username);
                    setUserRole(user.role);

                    const fullUser = await UserService.getUserByUsername(user.username);
                    if (fullUser?.id) {
                        setUserId(fullUser.id);
                    }
                    setFullUser(fullUser); // Set the full user data
                } else {
                    // No user returned – possibly not authenticated
                    setLoggedInUser(null);
                    router.push('/login');
                }
            } catch (error) {
                console.error('Failed to fetch logged-in user:', error);
                setLoggedInUser(null);
                router.push('/login');
            }
        };

        fetchData();
    }, [router]);

    const handleRemoveClick = () => {
        setShowRemovePopup(true);
    };

    const handleCancelClick = () => {
        setShowRemovePopup(false);
    };

    const handleRemoveProfile = async () => {
        if (loggedInUser) {
            try {
                await UserService.deleteUser(loggedInUser); // Call the remove user API
                setLoggedInUser(null); // Clear the logged-in user state
                router.push('/login'); // Redirect to login page
            } catch (error) {
                console.error('Failed to remove user:', error);
            }
        } else {
            console.error('User is not defined');
        }
    };

    const handleChangePassword = async (current: string, newPass: string) => {
        if (loggedInUser) {
            try {
                const res = await UserService.changePassword(loggedInUser, current, newPass); // Call the change password API

                if (res.message !== 'Password updated successfully') {
                    throw new Error(res.message || 'Failed to change password');
                }

                alert('Password changed successfully!');
            } catch (error) {
                alert(`Error: ${(error as Error).message}`);
                console.error('Failed to change password:', error);
            }
        } else {
            console.error('User is not defined');
        }
    };

    return (
        <>
            <div className={styles.profile}>
                <h1>Profile</h1>
                <div>
                    <h2>Username: {loggedInUser}</h2>
                    <h2>Name: {fullUser?.firstName + ' ' + fullUser?.lastName}</h2>
                    <h2>Email: {fullUser?.email}</h2>
                </div>
                <button onClick={() => setIsModalOpen(true)}>Change Password</button>
                <button onClick={handleRemoveClick}>Remove Profile</button>
            </div>
            {showRemovePopup && (
                <RemoveAlert onCancel={handleCancelClick} onConfirm={handleRemoveProfile} />
            )}
            <ChangePasswordPopup
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleChangePassword}
            />
        </>
    );
};

export default Profile;
