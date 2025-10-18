import React from 'react';
import AuthModal from './AuthModal';

const LoginRegister = ({ onClose }) => {
    return (
        <AuthModal isOpen={true} onClose={onClose} initialTab="login" />
    );
};

export default LoginRegister;
