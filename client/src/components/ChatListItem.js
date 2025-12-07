// src/components/ChatListItem.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function ChatListItem({ chat, onPress }) {
  const last = (chat.messages && chat.messages.length) ? chat.messages[chat.messages.length-1] : null;
  const avatar = chat.participants && chat.participants[0]?.avatar;
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Image source={ avatar ? { uri: avatar } : require('../../assets/profile_marco.png') } style={styles.avatar}/>
      <View style={{flex:1}}>
        <Text style={styles.name}>{chat.name || chat.title || 'Chat'}</Text>
        <Text numberOfLines={1} style={styles.preview}>{last ? last.text : 'No messages yet'}</Text>
      </View>
      <Text style={styles.time}>{ last ? new Date(last.createdAt).toLocaleTimeString() : '' }</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row:{flexDirection:'row',alignItems:'center',padding:12,borderBottomWidth:0.5,borderColor:'#eee'},
  avatar:{width:48,height:48,borderRadius:24,marginRight:12},
  name:{fontWeight:'600'},
  preview:{color:'#666',marginTop:4},
  time:{color:'#999',fontSize:12}
});