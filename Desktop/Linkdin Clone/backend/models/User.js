import mongoose from 'mongoose';

// User Schema define karna
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String, // Public URL of the image
        default: 'https://placehold.co/100x100/3182CE/FFFFFF?text=P',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Model ko export karte samay check karein ki 'User' model pehle se toh nahi bana hua hai
// Agar bana hai toh use hi use karein, warna naya banayein
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
