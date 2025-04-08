// app/dm/[id].js

import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList,
  TouchableOpacity, Image, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DMThreadScreen() {
  const { id } = useLocalSearchParams();

  const [input, setInput] = useState('');
  const messages = [
    { id: '1', type: 'incoming', text: 'Olá, item ainda disponível?', time: '09:20' },
    { id: '2', type: 'outgoing', text: 'Sim! Está disponível.', time: '09:21' },
    { id: '3', type: 'incoming', text: 'Perfeito, gostaria de trocar!', time: '09:22' },
  ];

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.bubble,
        item.type === 'outgoing' ? styles.outgoing : styles.incoming,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?img=${id}` }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Usuário #{id}</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity>
          <Ionicons name="send" size={24} color="#3B9C8F" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  messages: {
    padding: 16,
    gap: 10,
  },
  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 10,
  },
  incoming: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  outgoing: {
    backgroundColor: '#3B9C8F',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#001',
  },
  time: {
    fontSize: 10,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'right',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 10,
  },
});
