// src/pages/LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('Login'); // or 'Sign up'
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState('unknown');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (t) => setLogs(prev => [ `${new Date().toLocaleTimeString()} — ${t}`, ...prev ]);

  useEffect(() => {
    addLog(`API_BASE = ${API_BASE}`);
    checkStatus();
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('@rahas_auth');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.token) {
            addLog('Found saved token: auto-entering Main');
            navigation.replace('Main');
          }
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const checkStatus = async () => {
    setStatus('checking');
    try {
      const res = await axios.get(`${API_BASE}/api/status`, { timeout: 5000 });
      setStatus('ok');
      addLog(`GET /api/status -> ${JSON.stringify(res.data)}`);
    } catch (err) {
      setStatus('error');
      const errText = err.response ? `HTTP ${err.response.status} ${JSON.stringify(err.response.data)}` :
                      err.request ? `No response (network?) ${err.message}` :
                      `Error: ${err.message}`;
      addLog(`GET /api/status failed: ${errText}`);
    }
  };

  const submit = async () => {
    if (mode === 'Login') {
      if (!email || !password) { alert('Please enter email and password'); return; }
    } else {
      if (!fullName || !email || !password || !bio) { alert('Please fill all fields'); return; }
    }
    setLoading(true);
    addLog(`Attempting ${mode.toLowerCase()}...`);
    try {
      const path = mode === 'Login' ? 'login' : 'signup';
      const payload = mode === 'Login' ? { email, password } : { fullName, email, password, bio };
      const response = await axios.post(`${API_BASE}/api/auth/${path}`, payload, { timeout: 10000 });
      addLog(`POST /api/auth/${path} -> ${JSON.stringify(response.data)}`);
      const token = response.data.token || response.data?.data?.token;
      const user = response.data.user || response.data?.data?.user || response.data?.userData || null;
      if (!token) {
        addLog('Auth response missing token');
        alert('Succeeded but token missing — check server response.');
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem('@rahas_auth', JSON.stringify({ token, user }));
      setLoading(false);
      navigation.replace('Main');
    } catch (err) {
      setLoading(false);
      const errText = err.response ? `HTTP ${err.response.status} ${JSON.stringify(err.response.data)}` :
                      err.request ? `No response (network?) ${err.message}` :
                      `Error: ${err.message}`;
      addLog(`${mode} failed: ${errText}`);
      alert(`${mode} failed — check logs below`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rahas Mobile — {mode}</Text>

      <Text style={{marginBottom:6}}>API Status: <Text style={{fontWeight:'700'}}>{status}</Text></Text>
      <TouchableOpacity style={styles.smallBtn} onPress={checkStatus}><Text style={{color:'#fff'}}>Check /api/status</Text></TouchableOpacity>

      {mode === 'Sign up' && (
        <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      )}
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {mode === 'Sign up' && (
        <TextInput style={[styles.input, {height:96}]} placeholder="Short bio" multiline value={bio} onChangeText={setBio} />
      )}

      <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign In</Text>}
      </TouchableOpacity>

      <Text style={{fontWeight:'700', marginTop:20}}>Logs (most recent first)</Text>
            <TouchableOpacity style={[styles.smallBtn, {backgroundColor:'#6a11cb'}]} onPress={()=> setMode(mode === 'Login' ? 'Sign up' : 'Login')}>
              <Text style={{color:'#fff'}}>{mode === 'Login' ? 'Switch to Sign up' : 'Switch to Login'}</Text>
            </TouchableOpacity>
      {logs.length === 0 && <Text style={{color:'#666'}}>No logs yet</Text>}
      {logs.map((l,i) => <Text key={i} style={{fontSize:12, marginTop:6}}>{l}</Text>)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{padding:20,paddingTop:60, backgroundColor:'#fff', minHeight:'100%'},
  title:{fontSize:26,fontWeight:'800',marginBottom:18, textAlign:'center'},
  input:{height:48,borderWidth:1,borderColor:'#ddd',borderRadius:8,paddingHorizontal:12,marginBottom:12,backgroundColor:'#fff'},
  btn:{backgroundColor:'#2575fc',padding:14,borderRadius:8,alignItems:'center'},
  btnText:{color:'#fff',fontWeight:'600'},
  smallBtn:{backgroundColor:'#666',padding:8,borderRadius:6,alignItems:'center',width:160,marginBottom:12}
});
