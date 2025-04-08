import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';

const notifications = [
  {
    id: '1',
    text: 'A sua troca com Lira Belmond, foi finalizada',
    avatar: 'https://i.pravatar.cc/100?img=1',
    unread: true,
  },
  {
    id: '2',
    text: 'Um novo item está disponível, Confira agora se lhe interessa!',
    icon: 'cube-outline',
    unread: true,
  },
  {
    id: '3',
    text: 'Seu pedido está a caminho! Acompanhe o status de entrega.',
    icon: 'car-outline',
    unread: true,
  },
  {
    id: '4',
    text: 'Você recebeu uma nova mensagem de Serenna Valmont.',
    avatar: 'https://i.pravatar.cc/100?img=2',
    unread: true,
  },
  {
    id: '5',
    text: 'Sua conta foi verificada. Agora você pode vender ou trocar com mais confiança!',
    icon: 'checkmark-circle',
    unread: false,
  },
  {
    id: '6',
    text: 'Você recebeu uma nova avaliação! Confira como você está se saindo.',
    avatar: 'https://i.pravatar.cc/100?img=3',
    unread: false,
  },
  {
    id: '7',
    text: 'Parabéns! Você completou sua primeira troca com sucesso.',
    icon: 'medal-outline',
    unread: false,
  },
  {
    id: '8',
    text: 'Verifique sua conta para aumentar a segurança e proteger suas trocas.',
    icon: 'shield-checkmark-outline',
    unread: false,
  },
];

export default function NotificationsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.notification}>
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <Ionicons name={item.icon} size={28} color="#333" />
      )}
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{item.text}</Text>
      </View>
      {item.unread && <View style={styles.dot} />}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.imgur.com/PBnxUoB.png' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Notificações</Text>
        <Ionicons name="notifications-outline" size={24} style={styles.headerIcon} />
        <TouchableOpacity style={styles.fontBtn}>
          <Text style={styles.fontBtnText}>aA</Text>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
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
  logo: { width: 32, height: 32 },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  headerIcon: { color: '#333' },
  fontBtn: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderColor: '#ccc',
  },
  fontBtnText: { fontWeight: 'bold' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  notification: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    position: 'relative',
    gap: 10,
  },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  notificationContent: { flex: 1 },
  notificationText: { fontSize: 14 },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#3B9C8F',
    borderRadius: 5,
    marginTop: 4,
  },
});