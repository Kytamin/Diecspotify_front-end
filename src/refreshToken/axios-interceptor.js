import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem('token');
        let refreshToken = localStorage.getItem('refreshToken');

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            const now = Date.now() / 1000;

            if (decodedToken.exp < now) {
               const tokens = await axios.get("http://localhost:8000/auth/request-refresh-token", {
                    headers: {
                        token: `Bearer ${accessToken}`,
                        refreshToken: refreshToken
                    }
                });
                await localStorage.setItem("token", tokens.data.accessToken);
                await localStorage.setItem("refreshToken", tokens.data.refreshToken);
            }
        }

        accessToken = localStorage.getItem('token');
        refreshToken = localStorage.getItem('refreshToken');

        if (accessToken) {
            config.headers.token = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
