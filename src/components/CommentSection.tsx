
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MessageCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { getCurrentAccount } from '../services/contractService';

interface Comment {
  commentId: string | number;
  userAddr: string;
  content: string;
  createdAt: number;
  replies?: Comment[];
}

interface CommentProps {
  paperId: string;
}

const CommentSection: React.FC<CommentProps> = ({ paperId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
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
      const resp = await fetch(`http://localhost:3002/api/comments?paperId=${paperId}`);
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || "Failed to load comments");
      }
      
      const data = await resp.json();
      // Transform data for nested comments structure
      const transformedData = data.map((comment: any) => ({
        commentId: comment.id,
        userAddr: comment.userAddr,
        content: comment.content,
        createdAt: comment.createdAt,
        replies: [] // Empty replies for now
      }));
      
      setComments(transformedData);
    } catch (err) {
      toast.error("Error loading comments: " + (err as Error).message);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
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
      toast.error("Error: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  // This is a simplified Comment component since we don't have access to the actual Comment component
  const CommentItem: React.FC<{comment: Comment}> = ({ comment }) => {
    return (
      <div className="p-4 border rounded-md mb-3 bg-white">
        <div className="flex justify-between items-start">
          <div className="font-medium text-sm text-primary">
            {comment.userAddr.substring(0, 6)}...{comment.userAddr.substring(comment.userAddr.length - 4)}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(comment.createdAt * 1000).toLocaleString()}
          </div>
        </div>
        <div className="mt-2 text-gray-700">{comment.content}</div>
        <div className="flex gap-2 mt-2">
          <button className="text-xs text-gray-500 hover:text-primary">Reply</button>
          <button className="text-xs text-gray-500 hover:text-primary">Like</button>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-primary">
          <MessageCircle className="h-5 w-5" />
          Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full mb-2 cnki-textarea"
          />
          <Button 
            type="submit" 
            className="w-full cnki-button"
            disabled={submitting || !userAddress}
          >
            {submitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Comment
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
                <CommentItem key={comment.commentId} comment={comment} />
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentSection;
