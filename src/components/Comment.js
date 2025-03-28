
import React, { useState } from 'react';

const Comment = ({ commentId, userAddr, content, replies, onReply, onLike, onReport }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleReply = () => {
    onReply(commentId, replyContent);
    setReplyContent('');
  };

  const handleLike = () => {
    onLike(commentId); // Like functionality
  };

  const handleReport = () => {
    onReport(commentId); // Report functionality
  };

  return (
    <div className="border rounded-md p-4 mb-4 bg-white shadow-sm">
      <p className="mb-2"><span className="font-medium text-gray-700">{userAddr.slice(0, 6)}...{userAddr.slice(-4)}</span>: {content}</p>
      <div className="space-y-2">
        <div className="flex space-x-2">
          <button 
            onClick={handleLike}
            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
          >
            Like
          </button>
          <button 
            onClick={handleReport}
            className="text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded"
          >
            Report
          </button>
        </div>

        {replies && replies.length > 0 && (
          <div className="ml-6 mt-2 space-y-3 border-l-2 border-gray-100 pl-4">
            {replies.map((reply) => (
              <Comment key={reply.commentId} {...reply} onReply={onReply} onLike={onLike} onReport={onReport} />
            ))}
          </div>
        )}

        <div className="mt-2 space-y-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            rows={2}
          />
          <button 
            onClick={handleReply}
            className="px-3 py-1 bg-primary text-white rounded-md text-sm"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
