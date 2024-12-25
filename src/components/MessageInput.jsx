import React, { useState, useEffect } from 'react';
import { useMessageContext } from '../hooks/messageContext'; 
import useIndexedDB from '../hooks/useIndexedDb'; 
import './MessageInput.css';

const MessageInput = ({ contactId }) => {
  const [message, setMessage] = useState('');
  const { state, dispatch } = useMessageContext(); 
  const { storeMessageOffline, isDbReady, isInitializing } = useIndexedDB();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isDbReady && !isInitializing) {
      setIsReady(true);  
    }
  }, [isDbReady, isInitializing]);

  const handleSendMessage = async () => {
    if (!isReady) {
      console.log('Waiting for IndexedDB to initialize...');
      return; 
    }

    if (message.trim()) {
      const newMessage = { content: message, contactId, timestamp: new Date() };

      try {
      
        await storeMessageOffline(newMessage);

    
        dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        disabled={!isReady}  // Disable input until DB is ready
      />
      <button onClick={handleSendMessage} disabled={!isReady}>
        Send
      </button>
      {isInitializing && <div>Initializing...</div>} {/* Optional loading message */}
    </div>
  );
};

export default MessageInput;
