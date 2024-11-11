// src/redux/actions/authActions.js
import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
    try {
        const response = await axios.post('/api/users/login', { email, password });
        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token: response.data.token, user: response.data.user },
        });
    } catch (error) {
        console.error('Error en inicio de sesión', error);
    }
};

export const logout = () => ({
    type: 'LOGOUT',
});
