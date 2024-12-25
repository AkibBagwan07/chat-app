import React, { useState } from 'react';
import { MessageProvider } from './hooks/messageContext'; // Adjust the path if necessary
import ContactList from './components/ContactList'; // Adjust the path if necessary
import ChatWindow from './components/ChatWindow'; // Adjust the path if necessary
import "./App.css"

const App = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  const handleSelectContact = contact => {
    setSelectedContact(contact);
  };

  return (
    <MessageProvider>
      <div className="App">
          <div className='contactList'>
            <ContactList onSelectContact={handleSelectContact} />
          </div>
          <div className='chatWindow'>
            <ChatWindow selectedContact={selectedContact} />
          </div>
      </div>
    </MessageProvider>
  );
};

export default App;
