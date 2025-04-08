// app/messages.js

import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const chats = [
  {
    id: '1',
    name: 'Lira Belmond',
    avatar: 'https://i.pravatar.cc/100?img=1',
    lastMessage: 'Este item ainda está disponível?',
  },
  {
    id: '2',
    name: 'Théo Ravencroft',
    avatar: 'https://i.pravatar.cc/100?img=2',
    lastMessage: 'Posso reservar esse produto?',
  },
  {
    id: '3',
    name: 'Isolde Durand',
    avatar: 'https://i.pravatar.cc/100?img=3',
    lastMessage: 'Esse item já foi vendido ou trocado?',
  },
  {
    id: '4',
    name: 'Serenna Valmont',
    avatar: 'https://i.pravatar.cc/100?img=4',
    lastMessage: 'Você tem mais unidades?',
  },
  {
    id: '5',
    name: 'Elara Whitford',
    avatar: 'https://i.pravatar.cc/100?img=5',
    lastMessage: 'Esse produto está disponível para envio?',
  },
  {
    id: '6',
    name: 'Dorian Ashford',
    avatar: 'https://i.pravatar.cc/100?img=6',
    lastMessage: 'Obrigado pela troca!',
  },
];

export default function MessageHubScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => router.push(`/dm/${item.id}`)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.lastMessage}</Text>
      </View>
      <Ionicons name="checkmark-done-outline" size={18} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: 'https://i.imgur.com/PBnxUoB.png' }} style={styles.logo} />
        <Text style={styles.title}>Mensagens</Text>
        <View style={styles.counter}><Text style={styles.counterText}>6</Text></View>
        <TouchableOpacity style={styles.fontToggle}><Text style={{ fontWeight: 'bold' }}>aA</Text></TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#888" />
        <TextInput style={styles.searchInput} placeholder="Pesquisar" />
      </View>

      {/* List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Text style={styles.tip}>Use mensagens objetivas para facilitar a comunicação.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  logo: { width: 100, height: 108 },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  counter: {
    backgroundColor: '#3B9C8F',
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  counterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fontToggle: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  name: { fontWeight: 'bold', fontSize: 15 },
  message: { color: '#444', fontSize: 13 },
  tip: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
    marginBottom: 20,
  },
});
