// src/components/MessageBubble.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message, isMine=false }) {
  return (
    <View style={[styles.container, isMine ? styles.mine : styles.theirs]}>
      <Text style={isMine ? styles.mineText : styles.theirsText}>{message.text}</Text>
      <Text style={styles.time}>{message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{maxWidth:'80%',padding:10,borderRadius:10,marginVertical:6},
  mine:{backgroundColor:'#0b93f6',alignSelf:'flex-end',borderTopRightRadius:0},
  theirs:{backgroundColor:'#eee',alignSelf:'flex-start',borderTopLeftRadius:0},
  mineText:{color:'#fff'},
  theirsText:{color:'#333'},
  time:{fontSize:10,marginTop:6,opacity:0.6}
});