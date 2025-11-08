import React, { useState } from 'react';
// FIX: Removed 'react-icons/fa' import and defined icons using inline SVG to avoid build issues.

// --- Inline SVG Icon Definitions ---
const IconBase = ({ children, style }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        style={{ width: '1em', height: '1em', ...style }}
    >
        {children}
    </svg>
);

const ThumbsUpIcon = (props) => (
    <IconBase {...props}>
        <path d="M7 11V7a3 3 0 016-1v2a2 2 0 100 4h-3a2 2 0 00-2 2v4a2 2 0 002 2h3a2 2 0 002-2v-4.84l.87-1.3A1.5 1.5 0 0014.28 9H12a2 2 0 00-2-2V7a1 1 0 10-2 0v4zM4 17h2v2H4zM4 11h2v4H4zM4 7h2v2H4z" />
    </IconBase>
);

const ThumbsDownIcon = (props) => (
    <IconBase {...props}>
        <path d="M17 13v4a3 3 0 01-6 1v-2a2 2 0 100-4h3a2 2 0 002-2V8a2 2 0 00-2-2h-3a2 2 0 00-2 2v4.84l-.87 1.3A1.5 1.5 0 009.72 15H12a2 2 0 002 2v2a1 1 0 102 0v-4zM20 7h-2v2h2zM20 11h-2v4h2zM20 17h-2v2h2z" />
    </IconBase>
);

const EditIcon = (props) => (
    <IconBase {...props}>
        <path d="M14 6L16 8 5 19H3v-2L14 6zM21 7l-2-2-1 1 2 2 1-1z" />
    </IconBase>
);

const TrashIcon = (props) => (
    <IconBase {...props}>
        <path d="M10 12h4v7h-4v-7zM7 7h10v12c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2V7zm2-4h6v2H9V3zm7 2h-6v-2h6v2z" />
    </IconBase>
);

const CommentIcon = (props) => (
    <IconBase {...props}>
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </IconBase>
);
// --- End Icon Definitions ---


const PostCard = ({ 
    post, 
    currentUserId, 
    onDelete, 
    onUpdate, 
    onLike,        // NEW: for liking
    onDislike,     // NEW: for disliking
    onAddComment,  // NEW: for adding comment
    onDeleteComment // NEW: for deleting comment
}) => {
    // Local state for editing post content
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.text);
    
    // Local state for comment input
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    // Check if the current user is the author of the post
    const isOwner = currentUserId === post.user._id;

    // Check if the user has liked or disliked the post
    const hasLiked = post.likes.some(like => like.user === currentUserId);
    const hasDisliked = post.dislikes.some(dislike => dislike.user === currentUserId);

    // --- CRITICAL FIX: Direct call to onLike/onDislike props ---
    const handleReaction = async (type) => {
        // This function will call the correct handler passed from FeedPage
        if (type === 'like') {
            await onLike(post._id);
        } else if (type === 'dislike') {
            await onDislike(post._id);
        }
    };
    // -------------------------------------------------------------

    const handleEditSave = async () => {
        if (editText.trim() === '' || editText === post.text) {
            setIsEditing(false);
            return;
        }

        const result = await onUpdate(post._id, editText);
        if (result && result.success) {
            setIsEditing(false);
        }
        // Error handling is managed in FeedPage
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (commentText.trim() === '') return;
        
        await onAddComment(post._id, commentText);
        setCommentText('');
    };

    // Style constants for reusable buttons
    const iconStyle = { marginRight: '8px', fontSize: '1.2em' };
    const reactionButtonStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        backgroundColor: isActive ? '#0077b5' : '#f0f2f5',
        color: isActive ? 'white' : '#65676b',
        fontWeight: 'bold',
        transition: 'background-color 0.2s, color 0.2s',
        marginRight: '10px'
    });

    return (
        <div style={{ 
            marginBottom: '20px', 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '12px', 
            backgroundColor: 'white', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
            {/* Post Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0077b5', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2em', marginRight: '10px' }}>
                        {post.name ? post.name[0] : 'U'}
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontWeight: '600' }}>{post.name || 'Unknown User'}</h4>
                        <p style={{ margin: 0, fontSize: '0.8em', color: '#65676b' }}>
                            {new Date(post.date).toLocaleString()}
                        </p>
                    </div>
                </div>
                {isOwner && (
                    <div>
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            style={{ ...reactionButtonStyle(isEditing), backgroundColor: isEditing ? '#ffc107' : '#f0f2f5', color: isEditing ? 'white' : '#65676b' }}
                            title="Edit Post"
                        >
                            <EditIcon style={iconStyle} />
                        </button>
                        <button 
                            onClick={() => onDelete(post._id)}
                            style={{ ...reactionButtonStyle(false), backgroundColor: '#f0f2f5', color: '#dc3545', marginLeft: '5px' }}
                            title="Delete Post"
                        >
                            <TrashIcon style={iconStyle} />
                        </button>
                    </div>
                )}
            </div>

            {/* Post Content */}
            {isEditing ? (
                <div style={{ marginBottom: '15px' }}>
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows="4"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
                    />
                    <button 
                        onClick={handleEditSave}
                        style={{ ...reactionButtonStyle(true), width: '100%', justifyContent: 'center', marginTop: '10px' }}
                    >
                        Save Changes
                    </button>
                </div>
            ) : (
                <p style={{ fontSize: '1em', lineHeight: '1.5', marginBottom: '20px' }}>{post.text}</p>
            )}

            {/* Reaction Counts */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9em', color: '#65676b', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: 0 }}>
                    {post.likes.length > 0 && <span><ThumbsUpIcon style={{ marginRight: '5px', color: '#0077b5' }} />{post.likes.length} Likes </span>}
                    {post.dislikes.length > 0 && <span style={{ marginLeft: '10px' }}><ThumbsDownIcon style={{ marginRight: '5px', color: '#dc3545' }} />{post.dislikes.length} Dislikes</span>}
                </p>
                <p style={{ margin: 0, cursor: 'pointer' }} onClick={() => setShowComments(!showComments)}>
                    {post.comments.length} Comments
                </p>
            </div>

            {/* Action Buttons (Like/Dislike/Comment) */}
            <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '10px' }}>
                <button 
                    onClick={() => handleReaction('like')}
                    style={reactionButtonStyle(hasLiked)}
                >
                    <ThumbsUpIcon style={iconStyle} />
                    Like
                </button>
                <button 
                    onClick={() => handleReaction('dislike')}
                    style={reactionButtonStyle(hasDisliked)}
                >
                    <ThumbsDownIcon style={iconStyle} />
                    Dislike
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    style={reactionButtonStyle(showComments)}
                >
                    <CommentIcon style={iconStyle} />
                    Comment
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    {/* Comment Input */}
                    <form onSubmit={handleCommentSubmit} style={{ display: 'flex', marginBottom: '15px' }}>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            style={{ flexGrow: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc', marginRight: '10px' }}
                            required
                        />
                        <button 
                            type="submit" 
                            style={{ ...reactionButtonStyle(true), padding: '10px 15px', borderRadius: '20px' }}
                        >
                            Post
                        </button>
                    </form>

                    {/* Comment List */}
                    {post.comments.map(comment => (
                        <div key={comment._id} style={{ 
                            padding: '10px', 
                            backgroundColor: '#f9f9f9', 
                            borderRadius: '8px', 
                            marginBottom: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <div>
                                <h6 style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#0077b5' }}>{comment.name}</h6>
                                <p style={{ margin: 0, fontSize: '0.9em' }}>{comment.text}</p>
                            </div>
                            {/* Check if current user is the comment owner */}
                            {currentUserId === comment.user && (
                                <button
                                    onClick={() => onDeleteComment(post._id, comment._id)}
                                    style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '0.8em', padding: 0 }}
                                    title="Delete Comment"
                                >
                                    <TrashIcon style={{ width: '0.8em', height: '0.8em' }} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostCard;
