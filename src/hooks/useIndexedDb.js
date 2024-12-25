import { useState, useEffect, useCallback } from 'react';

const useIndexedDB = () => {
  const [db, setDb] = useState(null);
  const [isDbReady, setIsDbReady] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true); 
    
  useEffect(() => {
    const openDB = () => {
      const request = indexedDB.open('chatApp', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('messages')) {
          db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        console.log('IndexedDB initialized successfully');
        setDb(db);
        setIsDbReady(true); 
        setIsInitializing(false); 
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event);
        setIsInitializing(false); 
      };
    };

    openDB();
  }, []);

  
  const ensureDbIsReady = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (isInitializing) {
        console.log('Waiting for IndexedDB to initialize...');
        reject('IndexedDB is still initializing...');
      } else if (!isDbReady || !db) {
        console.error('IndexedDB is not initialized yet');
        reject('IndexedDB is not initialized yet');
      } else {
        resolve(db);
      }
    });
  }, [db, isDbReady, isInitializing]);

  
  const loadMessages = useCallback(() => {
    return new Promise((resolve, reject) => {
      ensureDbIsReady()
        .then((db) => {
          const transaction = db.transaction(['messages'], 'readonly');
          const store = transaction.objectStore('messages');
          const request = store.getAll();
          request.onsuccess = () => {
            resolve(request.result);
          };
          request.onerror = (e) => {
            reject('Error reading from IndexedDB:', e);
          };
        })
        .catch((error) => {
          console.error('Error loading messages:', error);
          reject(error);
        });
    });
  }, [ensureDbIsReady]);


  const storeMessageOffline = useCallback((message) => {
    return new Promise((resolve, reject) => {
      ensureDbIsReady()
        .then((db) => {
          const transaction = db.transaction(['messages'], 'readwrite');
          const store = transaction.objectStore('messages');
          const request = store.add(message);

          request.onsuccess = () => {
            console.log('Message stored in IndexedDB:', message);
            resolve();
          };

          request.onerror = (event) => {
            reject('Error storing message in IndexedDB:', event);
          };
        })
        .catch((error) => {
          console.error('Error storing message:', error);
          reject(error);
        });
    });
  }, [ensureDbIsReady]);

  return { loadMessages, storeMessageOffline, isDbReady, isInitializing };
};

export default useIndexedDB;
