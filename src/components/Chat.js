// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from './firebaseConfig';
import '../assets/css/Chat.css';

const Chat = ({ userId, closeChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setMessages(messagesArray);
    });
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const messagesRef = ref(database, 'messages');
      const message = {
        text: newMessage,
        userId: userId,
        timestamp: Date.now()
      };
      push(messagesRef, message);
      setNewMessage('');
    }
  };

  const handleAddUser = () => {
    if (userEmail.trim() !== '') {
      const usersRef = ref(database, 'users');
      push(usersRef, { email: userEmail });
      setUserEmail('');
    }
  };

  const handleViewChatHistory = () => {
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const historyArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setChatHistory(historyArray);
    });
  };

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
    const messagesRef = ref(database, `messages/${chatId}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setMessages(messagesArray);
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>Chat</span>
        <button onClick={closeChat}>×</button>
      </div>
      <div className="sidebar">
        {chatHistory.map((chat) => (
          <div key={chat.id} className="user-list" onClick={() => handleSelectChat(chat.id)}>
            <strong>{chat.userId}</strong>
            <p>{chat.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-content">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className="message">
              <strong>{message.userId}:</strong> {message.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Agregar usuario por correo..."
          />
          <button onClick={handleAddUser}>Agregar</button>
        </div>
        <button onClick={handleViewChatHistory}>Ver Historial</button>
      </div>
    </div>
  );
};

export default Chat;
