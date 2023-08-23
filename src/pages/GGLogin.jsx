import React from 'react'
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import {AuthService} from "../services/auth.service";
import {useNavigate} from "react-router-dom";

export function GGLogin() {
    const navigate = useNavigate();
    const handleLogin = async (credential) => {
        try {
            const response = await AuthService.googleLogin(credential);
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            const userObject = response.data.user;
            const userString = JSON.stringify(userObject);
            localStorage.setItem("userLogin", userString);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='main-container'>
            <GoogleOAuthProvider clientId="683585484602-h399cig7631kcaq65kpn1a3nva3mco5m.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        const credential = credentialResponse.credential;
                        await handleLogin(credential);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </GoogleOAuthProvider>
        </div>
    )
}