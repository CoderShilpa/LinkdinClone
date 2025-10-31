import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // --- NEW FIELD FOR PROFILE PHOTO ---
    avatar: {
        type: String, // Stores the path to the user's uploaded profile photo
        required: false,
        default: null,
    },
    // -----------------------------------
    date: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', UserSchema);

export default User;
