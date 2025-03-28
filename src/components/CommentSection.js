
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';
import Comment from './Comment';
import { getCurrentAccount } from '../services/contractService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const CommentSection = ({ paperId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  // Load user address
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const address = await getCurrentAccount();
        setUserAddress(address);
      } catch (err) {
        console.error("Failed to get account", err);
      }
    };
    
    loadAddress();
  }, []);

  // Load comments when paperId changes
  useEffect(() => {
    if (paperId) {
      loadComments();
    }
  }, [paperId]);

  async function loadComments() {
    if (!paperId) return;
    
    setLoading(true);
    try {
      // Update API endpoint as needed
      const resp = await fetch(`http://localhost:3002/api/comments?paperId=${paperId}`);
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || "Failed to load comments");
      }
      
      const data = await resp.json();
      // Transform data for nested comments structure
      const transformedData = data.map(comment => ({
        commentId: comment.id,
        userAddr: comment.userAddr,
        content: comment.content,
        replies: [], // Empty replies for now
        createdAt: comment.createdAt
      }));
      
      setComments(transformedData);
    } catch (err) {
      toast.error("Error loading comments: " + err.message);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    
    setSubmitting(true);
    try {
      const resp = await fetch("http://localhost:3002/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId,
          userAddr: userAddress,
          content: content.trim()
        })
      });
      
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || "Submission failed");
      }
      
      toast.success("Comment submitted successfully");
      setContent("");
      // Reload comments
      loadComments();
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const handleReply = (commentId, replyContent) => {
    if (!replyContent.trim()) return;
    
    // Logic to submit a reply
    toast.info(`Replying to comment: ${commentId}`);
    // Here you would call your API to save the reply
    // After successful API call, reload the comments
  };

  const handleLike = (commentId) => {
    toast.success(`Liked comment: ${commentId}`);
    // Logic for liking a comment
  };

  const handleReport = (commentId) => {
    toast.info(`Reported comment: ${commentId}`);
    // Logic for reporting a comment
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full mb-2"
          />
          <Button 
            type="submit" 
            className="w-full"
            disabled={submitting || !userAddress}
          >
            {submitting ? (
              <>
                <span className="mr-2">Submitting...</span>
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Submit Comment</span>
              </>
            )}
          </Button>
          {!userAddress && (
            <p className="text-red-500 text-sm mt-2">
              Connect wallet to comment
            </p>
          )}
        </form>

        {loading ? (
          <div className="text-center py-4">Loading comments...</div>
        ) : (
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <Comment 
                  key={comment.commentId}
                  commentId={comment.commentId}
                  userAddr={comment.userAddr}
                  content={comment.content}
                  replies={comment.replies}
                  onReply={handleReply}
                  onLike={handleLike}
                  onReport={handleReport}
                />
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentSection;
