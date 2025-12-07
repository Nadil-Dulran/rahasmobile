// src/pages/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import GradientBackground from '../components/GradientBackground';
import { API_BASE } from '../config';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('@rahas_auth');
      const auth = raw ? JSON.parse(raw) : {};
      const user = auth?.user || auth?.userData || {};
      setName(user.fullName || user.fullname || '');
      setBio(user.bio ?? '');
      setProfilePic(user.profilePic || null);
    })();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res?.granted) {
      Alert.alert('Permission required', 'Please allow photo access');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.8 });
    if (!result.canceled) {
      const asset = result.assets[0];
      setProfilePic(asset.uri);
      // Convert to base64 data URL for backend
      const base64 = `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
      await saveProfile({ profilePic: base64 });
    }
  };

  const saveProfile = async (extra = {}) => {
    try {
      const raw = await AsyncStorage.getItem('@rahas_auth');
      const auth = raw ? JSON.parse(raw) : {};
      const headers = auth?.token ? { Authorization: auth.token, token: auth.token } : {};
      const body = { fullName: name, bio, ...extra };
      const { data } = await axios.put(`${API_BASE}/api/auth/updateProfilePicture`, body, { headers });
      if (data.success) {
        const newAuth = { ...auth, user: data.user };
        await AsyncStorage.setItem('@rahas_auth', JSON.stringify(newAuth));
        Alert.alert('Success', 'Profile updated');
        setProfilePic(data.user?.profilePic || profilePic);
      } else {
        Alert.alert('Update failed', data.message || 'Try again later');
      }
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || e.message);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )}
          <Text style={styles.link}>Change Photo</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="Your name" value={name} onChangeText={setName} />
        <TextInput style={[styles.input, {height:96}]} placeholder="Bio" value={bio} onChangeText={setBio} multiline />
        <TouchableOpacity style={styles.btn} onPress={() => saveProfile()}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  wrapper:{ flex:1, padding:20 },
  title:{ color:'#7aa2ff', fontSize:20, fontWeight:'700', marginBottom:16 },
  avatarWrap:{ alignItems:'center', marginBottom:16 },
  avatar:{ width:96, height:96, borderRadius:48, borderWidth:2, borderColor:'#444' },
  avatarPlaceholder:{ backgroundColor:'#333' },
  link:{ color:'#9b7dfb', marginTop:8 },
  input:{ backgroundColor:'#1a1a2a', color:'#fff', borderColor:'#333', borderWidth:1, borderRadius:10, paddingHorizontal:12, marginBottom:12, height:48 },
  btn:{ backgroundColor:'#6a11cb', padding:12, borderRadius:10, alignItems:'center' },
  btnText:{ color:'#fff', fontWeight:'600' }
});