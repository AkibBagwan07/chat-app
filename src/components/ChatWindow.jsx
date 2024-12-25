import React, { useState, useEffect, useCallback } from 'react';
import { useMessageContext } from '../hooks/messageContext';
import "./ChatWindow.css"

const ChatWindow = ({ selectedContact }) => {
  const { state, dispatch } = useMessageContext();
  const [message, setMessage] = useState('');

  const fetchMessages = useCallback(() => {
    if (selectedContact) {
      const currentMessages = state.messages[selectedContact.id] || [];
      dispatch({
        type: 'SET_MESSAGES',
        payload: { contactId: selectedContact.id, messages: currentMessages },
      });
    }
  }, [dispatch, selectedContact, state.messages]);

  useEffect(() => {
    fetchMessages();
  }, [selectedContact, fetchMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = { id: Date.now(), text: message, sender: 'You' };
      const updatedMessages = [...(state.messages[selectedContact.id] || []), newMessage];
      dispatch({
        type: 'SET_MESSAGES',
        payload: { contactId: selectedContact.id, messages: updatedMessages },
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-window">
      {selectedContact ? (
        <div>
          <div className="chat-header">
            <h2>Chat with {selectedContact.name}</h2>
          </div>
          <div className="chat-messages">
            {(state.messages[selectedContact.id] || []).map(msg => (
              <div key={msg.id} className="message">
                <span className="sender">{msg.sender}</span>
                <span className="text">{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div className="no-contact">Select a contact to start chatting</div>
      )}
    </div>
  );
};

export default ChatWindow;
