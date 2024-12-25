import React, { useEffect, useState } from 'react';
import { useMessageContext } from '../hooks/messageContext';
import './ContactList.css';

const ContactList = ({ onSelectContact }) => {
  const { state, dispatch } = useMessageContext(); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      setTimeout(() => {
        dispatch({
          type: 'SET_CONTACTS',
          payload: [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Doe' },
          ],
        });
        setLoading(false); 
      }, 1000); 
    };

    fetchContacts();
  }, [dispatch]); 

  return (
    <div className="contact-list">
      <div className="contact-header">
        <h2>Contacts</h2>
      </div>

      {loading ? (
        <div className="loading">Loading contacts...</div>
      ) : state.contacts && state.contacts.length > 0 ? (
        state.contacts.map(contact => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className="contact-item"
          >
            {contact.name}
          </div>
        ))
      ) : (
        <div className="no-contacts">No contacts available</div>
      )}
    </div>
  );
};

export default ContactList;
