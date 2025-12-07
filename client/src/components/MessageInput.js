// src/components/MessageInput.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };
  return (
    <View style={styles.row}>
      <TextInput value={text} onChangeText={setText} placeholder="Type a message" style={styles.input} />
      <TouchableOpacity onPress={send} style={styles.btn}><Text style={{color:'#fff'}}>Send</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row:{flexDirection:'row',padding:8,alignItems:'center',borderTopWidth:0.5,borderColor:'#ddd'},
  input:{flex:1,height:44,paddingHorizontal:12,backgroundColor:'#fff',borderRadius:22,marginRight:8,borderWidth:1,borderColor:'#eee'},
  btn:{backgroundColor:'#2575fc',paddingHorizontal:14,paddingVertical:10,borderRadius:20}
});