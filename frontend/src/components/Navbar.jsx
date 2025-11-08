import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming this context exists

function Navbar() {
    // Get user and logout function from your authentication context
    const { user, logout } = useAuth(); 

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', // Vertically align items
            padding: '10px 20px', 
            background: '#0077b5', // LinkedIn Blue
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}>
            {/* Left side: App Name/Logo */}
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>SimpleClone</Link>
            </div>
            
            {/* Right side: Links and User Info */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {user ? (
                    // --- Links for Authenticated Users ---
                    <>
                        {/* Feed Link */}
                        <Link to="/" style={{ color: 'white', marginRight: '15px', padding: '8px 12px', textDecoration: 'none', borderRadius: '4px', transition: 'background-color 0.3s' }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#00598a'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            Feed
                        </Link>
                        
                        {/* Profile Link (The requested link) */}
                        <Link to="/profile" style={{ color: 'white', marginRight: '15px', padding: '8px 12px', textDecoration: 'none', fontWeight: 'bold', borderRadius: '4px', transition: 'background-color 0.3s' }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#00598a'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            Profile
                        </Link>
                        
                        {/* User Greeting */}
                        <span style={{ marginRight: '15px', padding: '8px 0', opacity: 0.9 }}>Hello, **{user.name}**</span>
                        
                        {/* Logout Button */}
                        <button onClick={logout} style={{ 
                            background: '#ff4d4d', 
                            border: 'none', 
                            color: 'white', 
                            cursor: 'pointer', 
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontWeight: '600',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#cc0000'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff4d4d'}>
                            Logout
                        </button>
                    </>
                ) : (
                    // --- Links for Guests (Not Logged In) ---
                    <>
                        <Link to="/login" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
