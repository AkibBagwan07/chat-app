import React, { createContext, useReducer, useContext, useEffect } from 'react';

const MessageContext = createContext();

const initialState = {
  contacts: [], 
  messages: {}, 
};

const messageReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: { ...state.messages, [action.payload.contactId]: action.payload.messages } };
    default:
      return state;
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);

  useEffect(() => {
    setTimeout(() => {
      dispatch({
        type: 'SET_CONTACTS',
        payload: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ],
      });
    }, 1000);
  }, []);

  return (
    <MessageContext.Provider value={{ state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
