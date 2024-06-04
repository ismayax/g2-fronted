import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, where, doc, setDoc } from 'firebase/firestore'; // Asegúrate de importar todas las funciones necesarias
import { db } from './firebaseConfig';
import '../assets/css/Chat.css';

const Chat = ({ userId, closeChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchDocentes = async () => {
      const docentesCollection = collection(db, 'docentes');
      const docentesSnapshot = await getDocs(docentesCollection);
      const docentesList = docentesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocentes(docentesList);
    };

    fetchDocentes();
    setIsOpen(true); // Open the chat with animation
  }, []);

  useEffect(() => {
    const cleanOldMessages = async () => {
      const fifteenDaysAgo = Date.now() - 15 * 24 * 60 * 60 * 1000;
      const messagesRef = collection(db, `messages`);
      const chatsSnapshot = await getDocs(messagesRef);

      chatsSnapshot.forEach(async (chatDoc) => {
        const chatId = chatDoc.id;
        const chatMessagesRef = collection(db, `messages/${chatId}/chat`);
        const q = query(chatMessagesRef, where('timestamp', '<', fifteenDaysAgo));
        const oldMessagesSnapshot = await getDocs(q);

        oldMessagesSnapshot.forEach(async (messageDoc) => {
          await deleteDoc(messageDoc.ref);
        });
      });
    };

    // Run cleanup every time component mounts
    cleanOldMessages();

    // Set interval to run cleanup every 24 hours
    const intervalId = setInterval(cleanOldMessages, 24 * 60 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && activeChat) {
      const messagesRef = collection(db, `messages/${activeChat}/chat`);
      await addDoc(messagesRef, {
        text: newMessage,
        userId: userId,
        timestamp: Date.now()
      });
      setNewMessage('');
      loadMessages(activeChat);
    }
  };

  const handleSelectUser = async (selectedUserId) => {
    const chatId = [userId, selectedUserId].sort().join('_');
    setActiveChat(chatId);
    setActiveUser(selectedUserId);

    // Crear el documento de chat si no existe
    const chatDocRef = doc(db, 'messages', chatId);
    await setDoc(chatDocRef, {
      participants: [userId, selectedUserId]
    }, { merge: true });

    loadMessages(chatId);
  };

  const loadMessages = async (chatId) => {
    const messagesRef = collection(db, `messages/${chatId}/chat`);
    const q = query(messagesRef, orderBy('timestamp'));
    const messageSnapshot = await getDocs(q);
    const messagesArray = messageSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMessages(messagesArray);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setTimeout(closeChat, 300); // Wait for the animation to finish before closing the chat
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  };

  const formatDay = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="chat-header">
        <span>Chat</span>
        <button onClick={handleCloseChat}>×</button>
      </div>
      <div className="chat-body">
        <div className="sidebar">
          {docentes.length > 0 ? (
            docentes.map((docente) => (
              <div key={docente.id} className="user-list" onClick={() => handleSelectUser(docente.id)}>
                <strong>{docente.email}</strong>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
        <div className="chat-content">
          {activeUser && (
            <>
              <div className="messages">
                {messages.reduce((acc, message, index) => {
                  const currentDay = formatDay(message.timestamp);
                  const previousDay = index > 0 ? formatDay(messages[index - 1].timestamp) : null;

                  if (currentDay !== previousDay) {
                    acc.push(
                      <div key={`date-${message.id}`} className="date-separator">
                        {currentDay}
                      </div>
                    );
                  }

                  acc.push(
                    <div
                      key={message.id}
                      className={`message ${message.userId === userId ? 'sent' : 'received'}`}
                    >
                      <span>{message.text}</span>
                      <div className="timestamp">{formatDate(message.timestamp)}</div>
                    </div>
                  );

                  return acc;
                }, [])}
              </div>
              <div className="input-container">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSendMessage}>Enviar</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
