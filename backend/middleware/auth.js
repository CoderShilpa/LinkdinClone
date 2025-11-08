import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = (req, res, next) => {
    // Get the Authorization header (this is the standard format: "Bearer <token>")
    const authHeader = req.header('Authorization');
    
    let token;

    // Check if Authorization header exists and is formatted as 'Bearer <token>'
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token by splitting the string and taking the second element
        // e.g., 'Bearer <token>' -> ['Bearer', '<token>']
        token = authHeader.split(' ')[1];
    } else {
        // Fallback: Check for the legacy 'x-auth-token' header
        token = req.header('x-auth-token');
    }

    // Check if a token was successfully extracted
    if (!token) {
        // This is the error you were seeing, now correctly triggered if no token is found
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user payload to the request
        req.user = decoded.user;
        next();
    } catch (err) {
        // This catches cases where the token is expired or invalid
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default auth;
