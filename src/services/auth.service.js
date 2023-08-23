import axios from "axios";

export class AuthService {
    static async jwtLogin(values) {
        return await axios.post("http://localhost:8000/auth/login", values);
    }

    static async googleLogin(values) {
        return await axios.post("http://localhost:8000/auth/google-login", {
            token: values
        });
    }
}
