// src/context/ChatContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(()=>{
    if(token) fetchChats();
  },[token]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/messages/chats`, {
        headers: { Authorization: token }
      });
      setChats(res.data || []);
    } catch (err) {
      console.warn('fetchChats', err.message);
    }
  };

  const sendMessage = async (chatId, text) => {
    try {
      const res = await axios.post(`${API_BASE}/api/messages/send`, { chatId, text }, {
        headers: { Authorization: token }
      });
      // append locally
      const updated = chats.map(c => c._id === chatId ? { ...c, messages: [...(c.messages||[]), res.data] } : c);
      setChats(updated);
      return res.data;
    } catch (err) {
      console.warn('sendMessage', err.message);
      throw err;
    }
  };

  return (
    <ChatContext.Provider value={{ chats, setChats, activeChat, setActiveChat, fetchChats, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
// ChatContext provides chat state and functions to the app.