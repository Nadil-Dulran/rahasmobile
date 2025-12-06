// src/pages/MainScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { io } from 'socket.io-client';
import { API_BASE } from '../config';

export default function MainScreen() {
  const navigation = useNavigation();
  const [users, setUsers] = React.useState([]);
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const socketRef = React.useRef(null);
    React.useEffect(() => {
      (async () => {
        try {
          const raw = await AsyncStorage.getItem('@rahas_auth');
          const auth = raw ? JSON.parse(raw) : {};
          const me = auth?.user || auth?.userData || {};
          const headers = auth?.token ? { Authorization: auth.token, token: auth.token } : {};
          const { data } = await axios.get(`${API_BASE}/api/auth/users`, { headers });
          if (data?.success) {
            setUsers(data.users || []);
            setOnlineUsers(data.onlineUsers || []);
            // Connect socket for presence
            if (!socketRef.current) {
              const s = io(API_BASE, { query: { userId: me._id } });
              socketRef.current = s;
              s.on('getOnlineUsers', (ids) => {
                setOnlineUsers(ids || []);
              });
            }
          } else {
            setUsers([]);
          }
        } catch (e) {
          setUsers([]);
        }
      })();
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }, []);
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@rahas_auth');
    } catch {}
    // Reset stack to Login
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={users}
        keyExtractor={(u)=>u._id}
        renderItem={({item})=> (
          <TouchableOpacity style={styles.userItem} onPress={()=> navigation.navigate('Chat', { chatId: item._id })}>
            <Text style={styles.userName}>{item.fullName}</Text>
            <Text style={[styles.badge, onlineUsers.includes(item._id) ? styles.badgeOnline : styles.badgeOffline]}>{onlineUsers.includes(item._id) ? 'Online' : 'Offline'}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Chat', { chatId: 'demo' })}>
        <Text style={{color:'#fff'}}>Open demo chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, {marginTop:12, backgroundColor:'#444'}]} onPress={logout}>
        <Text style={{color:'#fff'}}>Logout (back to login)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, {marginTop:12, backgroundColor:'#6a11cb'}]} onPress={()=> navigation.navigate('Profile')}>
        <Text style={{color:'#fff'}}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:20},
  title:{fontSize:22,fontWeight:'700',marginBottom:12, color:'#7aa2ff'},
  btn:{backgroundColor:'#2575fc',padding:12,borderRadius:8}
  ,userItem:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:12, backgroundColor:'#1a1a2a', borderRadius:10, marginBottom:10},
  userName:{color:'#fff',fontSize:16},
  badge:{paddingHorizontal:10,paddingVertical:4,borderRadius:20,fontSize:12,color:'#fff'},
  badgeOnline:{backgroundColor:'#2e7d32'},
  badgeOffline:{backgroundColor:'#616161'}
});
