import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc, where } from 'firebase/firestore';
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
        const currentUserDoc = await getDoc(doc(db, 'docentes', userId));
        
        if (!currentUserDoc.exists()) {
          throw new Error("Current user document does not exist");
        }
  
        const currentUserData = currentUserDoc.data();
        const userCentroId = currentUserData.centro_id ? currentUserData.centro_id[0] : null;
  
        if (!userCentroId) {
          throw new Error("User does not have a valid centro_id");
        }
  
        let participantsList = [];
  
        // Fetch superusuarios
        const superUserSnapshot = await getDocs(collection(db, 'superusuario'));
        participantsList = [
          ...participantsList,
          ...superUserSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), role: 'superusuario' })).filter(doc => doc.id !== userId)
        ];
  
        // Fetch admincentro participants of the same centro_id
        const admincentroQuery = query(collection(db, 'admincentro'), where('centro_id', 'array-contains', userCentroId));
        const admincentroSnapshot = await getDocs(admincentroQuery);
        participantsList = [
          ...participantsList,
          ...admincentroSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), role: 'admincentro' })).filter(doc => doc.id !== userId)
        ];
  
        // Fetch docentes participants of the same centro_id
        const docentesQuery = query(collection(db, 'docentes'), where('centro_id', 'array-contains', userCentroId));
        const docentesSnapshot = await getDocs(docentesQuery);
        participantsList = [
          ...participantsList,
          ...docentesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), role: 'docente' })).filter(doc => doc.id !== userId)
        ];
  
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
      console.log(`Fifteen days ago timestamp: ${fifteenDaysAgo}`);
  
      try {
        const messagesRef = collection(db, 'messages');
        const chatsSnapshot = await getDocs(messagesRef);
        console.log(`Number of chat documents found: ${chatsSnapshot.size}`);
  
        for (const chatDoc of chatsSnapshot.docs) {
          const chatId = chatDoc.id;
          console.log(`Processing chatId: ${chatId}`);
          const chatMessagesRef = collection(db, `messages/${chatId}/chat`);
          const q = query(chatMessagesRef, orderBy('timestamp'));
          const oldMessagesSnapshot = await getDocs(q);
          console.log(`Number of messages found in chat ${chatId}: ${oldMessagesSnapshot.size}`);
  
          for (const messageDoc of oldMessagesSnapshot.docs) {
            const messageTimestamp = messageDoc.data().timestamp;
            console.log(`Message timestamp: ${messageTimestamp}`);
  
            if (messageTimestamp < fifteenDaysAgo) {
              console.log(`Deleting message with timestamp: ${messageTimestamp}`);
              await deleteDoc(messageDoc.ref);
            }
          }
        }
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
