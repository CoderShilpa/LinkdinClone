// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import FeedPage from './pages/FeedPage.jsx';
// --- ADD THIS IMPORT ---
import ProfilePage from './pages/ProfilePage.jsx'; 

// --- Protected Route Component ---
// This checks the authentication status before rendering the content
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }
    
    // If not authenticated, redirect to the login page
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <FeedPage />
                            </ProtectedRoute>
                        } 
                    />
                    {/* --- ADD THIS ROUTE FOR THE PROFILE PAGE --- */}
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Fallback route: Redirects all unknown paths to the main feed */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </>
    );
}

export default App;