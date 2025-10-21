'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/products';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface ProductComment {
    id: string;
    product_id: number;
    user_id: string;
    content: string;
    user_name?: string | null;
    created_at?: string;
}

interface ProductCommentsProps {
    productId: number;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
    const { user } = useUser();
    const [comments, setComments] = useState<ProductComment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Fetch comments for this product
    useEffect(() => {
        const loadComments = async () => {
            if (!productId) return;
            setIsLoadingComments(true);
            const { data, error } = await supabase
                .from('product_comments')
                .select('id, product_id, user_id, content, user_name, created_at')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Load comments error:', error);
            }
            setComments(data || []);
            setIsLoadingComments(false);
        };
        loadComments();
    }, [productId]);

    const handleSubmitComment = async () => {
        if (!productId) return;
        if (!user?.id) {
            toast.error('Please sign in to comment');
            return;
        }
        if (!commentText.trim()) {
            toast('Write something first');
            return;
        }
        
        setIsSubmittingComment(true);
        const payload = {
            product_id: productId,
            user_id: user.id,
            content: commentText.trim(),
            user_name: user.fullName || user.username || user.primaryEmailAddress?.emailAddress || null,
        } as const;
        
        const { data, error } = await supabase
            .from('product_comments')
            .insert([payload])
            .select()
            .single();
            
        if (error) {
            console.error('Add comment error:', error);
            toast.error(error.message || 'Failed to add comment');
            setIsSubmittingComment(false);
            return;
        }
        
        setComments((prev) => [data as ProductComment, ...prev]);
        setCommentText('');
        setIsSubmittingComment(false);
        toast.success('Comment added');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInHours < 168) { // 7 days
            return `${Math.floor(diffInHours / 24)}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className='mt-8 sm:mt-12 p-4 sm:p-6 bg-white/95 rounded-xl lg:rounded-2xl shadow-sm border border-[#F0E7DE] relative'>
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#6f5a4d] font-serif`}>
                Customer Reviews ({comments.length})
            </h2>
            
            {/* Comment Input */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
                <input
                    type='text'
                    placeholder={user?.id ? 'Write your review...' : 'Sign in to write a review'}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={!user?.id || isSubmittingComment}
                    className='comment-input flex-1 border-2 border-[#F0E7DE] rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 relative z-20 bg-white'
                    style={{
                        pointerEvents: 'auto',
                        touchAction: 'manipulation',
                        WebkitUserSelect: 'text',
                        userSelect: 'text'
                    }}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitComment();
                        }
                    }}
                />
                <button
                    onClick={handleSubmitComment}
                    disabled={!user?.id || isSubmittingComment}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition text-sm sm:text-base font-medium ${
                        (!user?.id || isSubmittingComment) 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-[#F4DCDC] text-[#6f5a4d] hover:opacity-90'
                    }`}
                >
                    {isSubmittingComment ? 'Posting...' : 'Submit'}
                </button>
            </div>

            {/* Comments List */}
            <div className='space-y-4'>
                {isLoadingComments ? (
                    <div className="text-center text-[#8A6F5C] py-6 sm:py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
                        <p className="text-sm sm:text-base">Loading comments...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center text-[#8A6F5C] py-6 sm:py-8">
                        <div className="text-3xl sm:text-4xl mb-2">💬</div>
                        <p className="text-sm sm:text-base">Be the first to review this product!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className='border border-[#F0E7DE] rounded-xl p-3 sm:p-4 hover:shadow-sm transition-shadow'>
                            <div className='flex items-center justify-between mb-2'>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#F4DCDC] rounded-full flex items-center justify-center">
                                        <span className="text-[#6f5a4d] font-semibold text-sm">
                                            {(comment.user_name || 'Customer').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className='text-[#6f5a4d] font-semibold text-sm sm:text-base'>
                                        {comment.user_name || 'Customer'}
                                    </span>
                                </div>
                                <span className='text-xs text-[#8A6F5C]'>
                                    {comment.created_at ? formatDate(comment.created_at) : ''}
                                </span>
                            </div>
                            <p className='text-sm sm:text-base text-[#6f5a4d] leading-relaxed pl-10'>
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductComments;
