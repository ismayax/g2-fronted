// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import '../assets/css/Chat.css';

const Chat = ({ userId, closeChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const fetchDocentes = async () => {
      const docentesCollection = collection(db, 'docentes');
      const docentesSnapshot = await getDocs(docentesCollection);
      const docentesList = docentesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocentes(docentesList);
    };

    fetchDocentes();
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
    loadMessages(chatId);
  };

  const loadMessages = async (chatId) => {
    const messagesRef = collection(db, `messages/${chatId}/chat`);
    const q = query(messagesRef, orderBy('timestamp'));
    const messageSnapshot = await getDocs(q);
    const messagesArray = messageSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMessages(messagesArray);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>Chat</span>
        <button onClick={closeChat}>×</button>
      </div>
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
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className="message">
                <strong>{message.userId}:</strong> {message.text}
              </div>
            ))}
          </div>
        )}
        {activeUser && (
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
