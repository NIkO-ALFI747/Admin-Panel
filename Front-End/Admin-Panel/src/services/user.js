import axios from "axios"

export const fetchUsers = async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_USERS_URL);
        console.log(response);
    } catch (e) {
        console.error(e);
    }
}