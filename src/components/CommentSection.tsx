
import React, { useState, useEffect } from "react";
import { getCurrentAccount } from "@/services/contractService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageCircle, Send } from "lucide-react";

interface Comment {
  id: string;
  paperId: string;
  userAddr: string;
  content: string;
  createdAt: number;
}

interface CommentSectionProps {
  paperId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ paperId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userAddress, setUserAddress] = useState("");

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
      setComments(data);
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
      // Update API endpoint as needed
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
                <Send className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
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
                <div key={comment.id} className="border-b pb-3">
                  <p className="mb-2">{comment.content}</p>
                  <div className="text-sm text-gray-500 flex justify-between">
                    <span className="font-medium">
                      {comment.userAddr.slice(0, 6)}...{comment.userAddr.slice(-4)}
                    </span>
                    <span>
                      {new Date(comment.createdAt * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentSection;
