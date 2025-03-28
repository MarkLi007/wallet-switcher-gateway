import React, { useState } from 'react';

// 定义评论结构
interface CommentProps {
  commentId: number;
  userAddr: string;
  content: string;
  replies: CommentProps[];
  onReply: (commentId: number, replyContent: string) => void;
  onLike: (commentId: number) => void;
  onReport: (commentId: number) => void;
}

const Comment: React.FC<CommentProps> = ({ commentId, userAddr, content, replies, onReply, onLike, onReport }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleReply = () => {
    onReply(commentId, replyContent);
    setReplyContent('');
  };

  const handleLike = () => {
    onLike(commentId); // 点赞功能
  };

  const handleReport = () => {
    onReport(commentId); // 举报功能
  };

  return (
    <div className="comment">
      <p><strong>{userAddr}</strong>: {content}</p>
      <div>
        <button onClick={handleLike}>Like</button>
        <button onClick={handleReport}>Report</button>

        {replies && replies.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <Comment key={reply.commentId} {...reply} onReply={onReply} onLike={onLike} onReport={onReport} />
            ))}
          </div>
        )}

        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Reply..."
        />
        <button onClick={handleReply}>Reply</button>
      </div>
    </div>
  );
};

export const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<CommentProps[]>([]);

  const handleReply = (commentId: number, replyContent: string) => {
    console.log(`Replying to commentId: ${commentId} with content: ${replyContent}`);
    // 在此处进行评论回复的API请求
  };

  const handleLike = (commentId: number) => {
    console.log(`Liking commentId: ${commentId}`);
    // 在此处进行评论点赞的API请求
  };

  const handleReport = (commentId: number) => {
    console.log(`Reporting commentId: ${commentId}`);
    // 在此处进行评论举报的API请求
  };

  return (
    <div className="comment-section">
      {comments.map((comment) => (
        <Comment key={comment.commentId} {...comment} onReply={handleReply} onLike={handleLike} onReport={handleReport} />
      ))}
    </div>
  );
};
