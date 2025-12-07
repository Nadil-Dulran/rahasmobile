// src/pages/ChatScreen.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import { API_BASE } from '../config';

export default function ChatScreen({ route }) {
  const chatId = route?.params?.chatId;
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);

  useEffect(()=> {
    if (!chatId) return;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@rahas_auth');
        const auth = raw ? JSON.parse(raw) : {};
        const uid = auth?.user?._id || auth?.userData?._id || auth?.userId || null;
        setMyId(uid);
        const headers = auth?.token ? { Authorization: auth.token, token: auth.token } : {};
        const res = await axios.get(`${API_BASE}/api/messages/${chatId}`, { headers });
        const incoming = res.data?.messages || res.data || [];
        const normalized = Array.isArray(incoming) ? incoming.map(m => ({
          _id: m._id || m.id || `${m.chatId || chatId}-${m.createdAt || Date.now()}`,
          text: m.text || m.message || '',
          senderId: m.senderId || m.userId || m.sender || m.from || null,
          createdAt: m.createdAt || m.timestamp || Date.now(),
        })) : [];
        setMessages(normalized);
      } catch (e) {
        console.warn('load chat:', e.message || e);
      }
    })();
  }, [chatId]);

  const onSend = async (text) => {
    if (!text) return;
    try {
      const raw = await AsyncStorage.getItem('@rahas_auth');
      const auth = raw ? JSON.parse(raw) : {};
      const headers = auth?.token ? { Authorization: auth.token, token: auth.token } : {};
      const res = await axios.post(`${API_BASE}/api/messages/send/${chatId}`, { text }, { headers });
      const data = res.data || {};
      const appended = {
        _id: data._id || data.id || `${chatId}-${Date.now()}`,
        text: data.text || text,
        senderId: data.senderId || data.userId || myId,
        createdAt: data.createdAt || Date.now(),
      };
      setMessages(prev => [...prev, appended]);
    } catch (e) {
      // Silently handle send failure to avoid noisy warnings in production
      // Optionally, you could show a lightweight UI hint here.
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{padding:12}}>
        {messages.map(m => (
          <MessageBubble
            key={m._id || m.createdAt}
            message={m}
            isMine={(m.senderId || m.userId || m.sender) === myId}
          />
        ))}
      </ScrollView>
      <MessageInput onSend={onSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1}
});