// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { database } from './firebaseConfig';
import '../assets/css/Chat.css';

const Chat = ({ userId, closeChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const chatRef = ref(database, 'messages');
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const chatList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setChatHistory(chatList);
    });

    const requestsRef = ref(database, `friendRequests/${userId}`);
    onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      const requestsArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setFriendRequests(requestsArray);
    });
  }, [userId]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && activeChat) {
      const messagesRef = ref(database, `messages/${activeChat}`);
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
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const user = Object.values(data).find(user => user.email === userEmail);
        if (user) {
          const requestsRef = ref(database, `friendRequests/${user.id}`);
          push(requestsRef, { requesterId: userId, requesterEmail: userEmail });
        } else {
          alert('Usuario no encontrado');
        }
      }, { onlyOnce: true });
      setUserEmail('');
    }
  };

  const handleAcceptRequest = (requestId, requesterId) => {
    const newChatRef = ref(database, 'messages');
    const newChatKey = push(newChatRef).key;
    const updates = {};

    updates[`/messages/${newChatKey}`] = {
      [push().key]: {
        text: 'Chat creado',
        userId: 'system',
        timestamp: Date.now()
      }
    };

    updates[`/users/${userId}/chats/${newChatKey}`] = true;
    updates[`/users/${requesterId}/chats/${newChatKey}`] = true;

    update(ref(database), updates).then(() => {
      remove(ref(database, `friendRequests/${userId}/${requestId}`));
      setFriendRequests(friendRequests.filter(request => request.id !== requestId));
      alert('Chat creado');
    });
  };

  const handleRejectRequest = (requestId) => {
    remove(ref(database, `friendRequests/${userId}/${requestId}`));
    setFriendRequests(friendRequests.filter(request => request.id !== requestId));
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
        {friendRequests.length > 0 && (
          <div className="friend-requests">
            <h4>Solicitudes de Amistad</h4>
            {friendRequests.map((request) => (
              <div key={request.id} className="request">
                <span>{request.requesterEmail}</span>
                <button onClick={() => handleAcceptRequest(request.id, request.requesterId)}>Aceptar</button>
                <button onClick={() => handleRejectRequest(request.id)}>Rechazar</button>
              </div>
            ))}
          </div>
        )}
        {chatHistory.map((chat) => (
          <div key={chat.id} className="user-list" onClick={() => handleSelectChat(chat.id)}>
            <strong>{chat.id}</strong>
            <p>{chat.messages && chat.messages[Object.keys(chat.messages)[0]].text}</p>
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
      </div>
    </div>
  );
};

export default Chat;
