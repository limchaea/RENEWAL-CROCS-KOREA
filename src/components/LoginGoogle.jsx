import React from 'react';
import { loginAuthStore } from '../store/loginStore';
import { useNavigate } from 'react-router-dom';

const LoginGoogle = () => {
    const { onGoogleLogin } = loginAuthStore();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const success = await onGoogleLogin();
        if (success) {
            navigate('/userinfo'); // ✅ 마이페이지로 이동
        }
    };

    return (
        <div className='google_wrap'>
            <button className='sns_login google' onClick={handleGoogleLogin} type='button'>
                <img src='/images/google_icon.svg' alt='google_login' />
            </button>
        </div>
    );
};

export default LoginGoogle;
