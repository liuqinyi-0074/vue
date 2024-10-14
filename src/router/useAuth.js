import { ref } from 'vue';
import router from './index';

const isAuthenticated = ref(false);
const currentRole = ref('');

export function useAuth() {
    const login = (role) => {
        isAuthenticated.value = true;
        currentRole.value = role;
        alert('Login Success');
        router.push({ name: 'About' });
    };

    const logout = () => {
        isAuthenticated.value = false; // Set to false when logging out
        currentRole.value = ''; // Clear the role on logout
        alert('Logout Success');
        router.push({ name: 'Home' }); // Redirect to home or login page
    };

    return {
        isAuthenticated,
        currentRole,
        login,
        logout
    };
}