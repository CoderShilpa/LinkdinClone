import mongoose from 'mongoose';


// Profile Schema define karna
const profileSchema = new mongoose.Schema({
    user: {
       
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        default: '',
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
