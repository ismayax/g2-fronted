import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import '../assets/css/Chat.css';

const Chat = ({ userId, closeChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Define colors for different roles
  const roleColors = {
    superusuario: '#FF0000', // Red
    admincentro: '#FFA500',  // Orange
    docente: '#0000FF'       // Blue
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const roles = ['superusuario', 'admincentro', 'docentes'];
        let participantsList = [];

        for (const role of roles) {
          const participantsCollection = collection(db, role);
          const participantsSnapshot = await getDocs(participantsCollection);
          participantsList = [
            ...participantsList,
            ...participantsSnapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data(), role }))
              .filter(doc => doc.id !== userId)
          ];
        }

        setParticipants(participantsList);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
    setIsOpen(true);
  }, [userId]);

  useEffect(() => {
    const cleanOldMessages = async () => {
      const fifteenDaysAgo = Date.now() - 15 * 24 * 60 * 60 * 1000;
      try {
        const messagesRef = collection(db, `messages`);
        const chatsSnapshot = await getDocs(messagesRef);

        chatsSnapshot.forEach(async (chatDoc) => {
          const chatId = chatDoc.id;
          const chatMessagesRef = collection(db, `messages/${chatId}/chat`);
          const q = query(chatMessagesRef, orderBy('timestamp'));
          const oldMessagesSnapshot = await getDocs(q);

          oldMessagesSnapshot.forEach(async (messageDoc) => {
            if (messageDoc.data().timestamp < fifteenDaysAgo) {
              await deleteDoc(messageDoc.ref);
            }
          });
        });
      } catch (error) {
        console.error("Error cleaning old messages:", error);
      }
    };

    cleanOldMessages();
    const intervalId = setInterval(cleanOldMessages, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && activeChat) {
      try {
        const messagesRef = collection(db, `messages/${activeChat}/chat`);
        await addDoc(messagesRef, {
          text: newMessage,
          userId: userId,
          timestamp: Date.now()
        });
        setNewMessage('');
        loadMessages(activeChat);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleSelectUser = async (selectedUserId) => {
    const chatId = [userId, selectedUserId].sort().join('_');
    setActiveChat(chatId);
    setActiveUser(selectedUserId);

    try {
      const chatDocRef = doc(db, 'messages', chatId);
      const chatDoc = await getDoc(chatDocRef);
      
      if (!chatDoc.exists()) {
        await setDoc(chatDocRef, {
          participants: [userId, selectedUserId]
        });
      }

      loadMessages(chatId);
    } catch (error) {
      console.error("Error creating or fetching chat document:", error);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const messagesRef = collection(db, `messages/${chatId}/chat`);
      const q = query(messagesRef, orderBy('timestamp'));
      const messageSnapshot = await getDocs(q);
      const messagesArray = messageSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesArray);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setTimeout(closeChat, 300);
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
          {participants.length > 0 ? (
            participants.map((participant) => (
              <div key={participant.id} className="user-list" onClick={() => handleSelectUser(participant.id)}>
                <strong>
                  {participant.email}
                  <span className="role-indicator" style={{ borderLeft: `5px solid ${roleColors[participant.role]}` }}></span>
                </strong>
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
