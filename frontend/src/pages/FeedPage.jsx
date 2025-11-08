import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard.jsx';

// Use the environment variable
const API_BASE = import.meta.env.VITE_API_URL || 'https://linkdinclone-1.onrender.com/api';
const API_POSTS_URL = `${API_BASE}/posts`; 

const FeedPage = () => {
    // We need 'user' for currentUserId, and 'getToken' for API calls
    const { getToken, user } = useAuth(); 
    const [posts, setPosts] = useState([]);
    const [postText, setPostText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Helper function to update a post in the state based on its ID and new data
    const updatePostInState = (postId, updates) => {
        setPosts(prevPosts => 
            prevPosts.map(post => 
                post._id === postId ? { ...post, ...updates } : post
            )
        );
    };

    const fetchPosts = async () => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setError('');
            const res = await axios.get(API_POSTS_URL, {
                headers: { 'x-auth-token': token },
            });
            
            // --- FIX START ---
            // If the backend returns an object like { posts: [...] }, use the posts array.
            // If the backend returns an array directly, use it.
            const postsData = Array.isArray(res.data) 
                ? res.data 
                : (res.data.posts || []); // Assuming the array might be nested inside 'posts' key
                
            setPosts(postsData);
            // --- FIX END ---
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError('Could not fetch posts. Try logging in again.');
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => { 
        fetchPosts(); 
    }, []);

    // --- 1. Create Post Handler ---
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (postText.trim() === '') return;

        try {
            const token = getToken();
            const res = await axios.post( API_POSTS_URL, { text: postText }, { headers: { 'x-auth-token': token } });
            setPosts([res.data, ...posts]); 
            setPostText(''); 
            setError(''); 
        } catch (err) {
            console.error("Error creating post:", err);
            setError('Failed to create post.');
        }
    };
    
    // --- 2. Delete Post Handler ---
    const handleDeletePost = async (postId) => {
        try {
            const token = getToken();
            await axios.delete(`${API_POSTS_URL}/${postId}`, { headers: { 'x-auth-token': token } });
            setPosts(posts.filter(post => post._id !== postId)); 
            setError(''); 
        } catch (err) {
            console.error("Error deleting post:", err);
            setError('Failed to delete post. Are you the owner?');
        }
    };

    // --- 3. Update Post Handler (Only for text edit) ---
    const handleUpdatePost = async (postId, newText) => {
        try {
            const token = getToken();
            const res = await axios.put(
                `${API_POSTS_URL}/${postId}`, 
                { text: newText }, 
                { headers: { 'x-auth-token': token } }
            );

            updatePostInState(postId, { text: res.data.text });
            setError('');
            return { success: true };
        } catch (err) {
            console.error("Error updating post:", err);
            setError('Failed to update post. Are you the owner?');
            return { success: false };
        }
    };
    
    // --- 4. FIX: Like Post Handler (Calls the correct endpoint) ---
    const handleLikePost = async (postId) => {
        const token = getToken();
        if (!token) return;

        try {
            // Hitting the specific /like endpoint to toggle the like state
            const res = await axios.put(`${API_POSTS_URL}/${postId}/like`, {}, {
                headers: { 'x-auth-token': token }
            });

            // Update ONLY likes/dislikes array with server response to avoid recursive errors
            updatePostInState(postId, {
                likes: res.data.likes, 
                dislikes: res.data.dislikes
            });
            setError('');
        } catch (err) {
            console.error("Error liking post:", err);
            setError('Failed to toggle like status.'); 
        }
    };

    // --- 5. FIX: Dislike Post Handler (Calls the correct endpoint) ---
    const handleDislikePost = async (postId) => {
        const token = getToken();
        if (!token) return;

        try {
            // Hitting the specific /dislike endpoint to toggle the dislike state
            const res = await axios.put(`${API_POSTS_URL}/${postId}/dislike`, {}, {
                headers: { 'x-auth-token': token }
            });

            // Update ONLY likes/dislikes array with server response
            updatePostInState(postId, {
                likes: res.data.likes, 
                dislikes: res.data.dislikes
            });
            setError('');
        } catch (err) {
            console.error("Error disliking post:", err);
            setError('Failed to toggle dislike status.');
        }
    };

    // --- 6. Add Comment Handler ---
    const handleAddComment = async (postId, text) => {
        const token = getToken();
        if (!token || !text.trim()) return;

        try {
            const res = await axios.post(`${API_POSTS_URL}/comment/${postId}`, { text }, {
                headers: { 'x-auth-token': token }
            });
            
            // Server returns the updated comments array, update the local state
            updatePostInState(postId, { comments: res.data });
            setError('');
        } catch (err) {
            console.error("Error adding comment:", err);
            setError('Failed to add comment.');
        }
    };

    // --- 7. Delete Comment Handler ---
    const handleDeleteComment = async (postId, commentId) => {
        const token = getToken();
        if (!token) return;

        try {
            // Hitting the new DELETE /api/posts/comment/:id/:comment_id route
            const res = await axios.delete(`${API_POSTS_URL}/comment/${postId}/${commentId}`, {
                headers: { 'x-auth-token': token }
            });

            // Server returns the updated comments array, update the local state
            updatePostInState(postId, { comments: res.data });
            setError('');
        } catch (err) {
            console.error("Error deleting comment:", err);
            setError('Failed to delete comment.');
        }
    };


    if (loading) return <h2 style={{textAlign: 'center', marginTop: '50px', color: '#0077b5'}}>Loading Feed...</h2>;
    if (error) return <h2 style={{color: 'red', textAlign: 'center'}}>{error}</h2>;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            {/* Post Creation Form */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3>Aapke mann mein kya hai? (What's on your mind?)</h3>
                <form onSubmit={handlePostSubmit}>
                    <textarea
                        placeholder="Yahaan apna post likhein..."
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        required
                        rows="4"
                        style={{ width: '100%', padding: '10px', marginBottom: '10px', resize: 'vertical', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <button 
                        type="submit" 
                        style={{ padding: '10px 15px', background: '#0077b5', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#005f99'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#0077b5'}
                    >
                         (Post Now)
                    </button>
                </form>
            </div>

            {/* Post Feed */}
            <h2>(Recent Posts)</h2>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostCard 
                        key={post._id} 
                        post={post} 
                        currentUserId={user ? user.id : null} 
                        onDelete={handleDeletePost} 
                        onUpdate={handleUpdatePost} 
                        onLike={handleLikePost} 
                        onDislike={handleDislikePost} 
                        onAddComment={handleAddComment} 
                        onDeleteComment={handleDeleteComment} 
                    />
                ))
            ) : (
                <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>Abhi tak koi post nahi. Pehle post karne wale banein!</p>
            )}
        </div>
    );
};

export default FeedPage;
