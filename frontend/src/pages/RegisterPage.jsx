// frontend/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        const result = await register(name, email, password);
        
        if (result.success) {
            navigate('/'); // Redirect to the feed on success
        } else {
            setError(result.error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>User Registration</h2>
            {error && <p style={{ color: 'red' }}>**Error:** {error}</p>}
            
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px', border: '1px solid #ddd' }} />
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px', border: '1px solid #ddd' }} />
                <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px', border: '1px solid #ddd' }} />
                <button type="submit" style={{ padding: '10px', background: '#0077b5', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Sign Up</button>
            </form>
        </div>
    );
};

export default RegisterPage;