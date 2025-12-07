// src/pages/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatListItem from '../components/ChatListItem';
import { API_BASE } from '../config';

export default function HomeScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchChats() {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem('@rahas_auth');
      const auth = raw ? JSON.parse(raw) : {};
      const headers = auth?.token ? { Authorization: auth.token, token: auth.token } : {};
      const res = await axios.get(`${API_BASE}/api/messages/chats`, { headers, timeout: 8000 });
      setChats(res.data || []);
    } catch (err) {
      console.warn('fetchChats err', err.message || err);
    } finally { setLoading(false); }
  }

  useEffect(()=> {
    fetchChats();
  }, []);

  if (!chats || chats.length === 0) {
    return <View style={styles.empty}><Text>No chats yet — pull to refresh or create one on web</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList data={chats} keyExtractor={c => c._id || c.id} renderItem={({item}) => (
        <ChatListItem chat={item} onPress={() => navigation.navigate('Chat', { chatId: item._id || item.id })} />
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:8},
  empty:{flex:1,alignItems:'center',justifyContent:'center',padding:20}
});