import React from 'react';
import './Message.css';

const Message = ({ content, sender }) => {
  return (
    <div className={sender === 'me' ? 'message message-sent' : 'message message-received'}>
      <div className="message-content">{content}</div>
    </div>
  );
};

export default Message;
