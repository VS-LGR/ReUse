import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BOLD_WEIGHT } from 'jest-matcher-utils';


const STORAGE_KEYS = {
  image: '@profile_image',
  notifications: '@notifications_enabled',
  language: '@language',
  theme: '@theme',
};

export default function App() {
  const [image, setImage] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('Português Br');
  const [theme, setTheme] = useState('Claro');

  // Load data from AsyncStorage
  useEffect(() => {
    (async () => {
      const storedImage = await AsyncStorage.getItem(STORAGE_KEYS.image);
      const storedNotifications = await AsyncStorage.getItem(STORAGE_KEYS.notifications);
      const storedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.language);
      const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.theme);

      if (storedImage) setImage(storedImage);
      if (storedNotifications !== null) setNotifications(JSON.parse(storedNotifications));
      if (storedLanguage) setLanguage(storedLanguage);
      if (storedTheme) setTheme(storedTheme);
    })();
  }, []);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão de câmera é necessária!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await AsyncStorage.setItem(STORAGE_KEYS.image, uri);
    }
  };

  const toggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await AsyncStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(newValue));
  };

  const toggleLanguage = async () => {
    const newLang = language === 'Português Br' ? 'English' : 'Português Br';
    setLanguage(newLang);
    await AsyncStorage.setItem(STORAGE_KEYS.language, newLang);
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'Claro' ? 'Escuro' : 'Claro';
    setTheme(newTheme);
    await AsyncStorage.setItem(STORAGE_KEYS.theme, newTheme);
  };

  return (
    <View style={[styles.container, theme === 'Claro' ? styles.light : styles.dark]}>
      <View style={styles.header}>
        
        <Image
          source={{ uri: 'https://i.imgur.com/qkdpN.jpg' }}
          style={styles.headerBackground}
        />
        <TouchableOpacity onPress={takePhoto}>
          <Image
            source={image ? { uri: image } : require('./assets/default-avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.name}>Logan Mendes</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
          <MaterialIcons name="edit" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.iconRow}>
        <IconLabel icon="sync" label="Trocas\nPendentes" />
        <IconLabel icon="people" label="Amigos" />
        <IconLabel icon="shopping-bag" label="Compras" />
        <IconLabel icon="checkmark-done" label="Trocas e compras\nRealizadas" />
      </View>

      <View style={styles.settingsCard}>
        <SettingRow label="Notificações" value={notifications ? 'Ativo' : 'Inativo'} toggle={toggleNotifications} />
        <SettingRow label="Idioma" value={language} toggle={toggleLanguage} />
        <SettingRow label="Tema" value={theme} toggle={toggleTheme} />
      </View>

      <View style={styles.bottomBar}>
        <Ionicons name="home-outline" size={24} />
        <Ionicons name="document-text-outline" size={24} />
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
        <Ionicons name="settings-outline" size={24} />
        <Ionicons name="person-circle-outline" size={24} />
      </View>
    </View>
  );
}

const IconLabel = ({ icon, label }) => (
  <View style={styles.iconLabel}>
    <Ionicons name={icon} size={28} />
    <Text style={styles.iconText}>{label}</Text>
  </View>
);

const SettingRow = ({ label, value, toggle }) => (
  <View style={styles.settingRow}>
    <Text style={styles.settingLabel}>{label}</Text>
    <TouchableOpacity onPress={toggle}>
      <Text style={styles.settingValue}>{value}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  light: { backgroundColor: '#f9f9f9' },
  dark: { backgroundColor: '#1e1e1e' },
  header: { alignItems: 'center' },
  headerBackground: { width: '100%', height: 100 },
  avatar: {
    width: 100, height: 100, borderRadius: 50, marginTop: -50,
    borderWidth: 3, borderColor: 'white',
  },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
  },
  editButtonText: { color: 'white', marginRight: 4 },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  iconLabel: { alignItems: 'center' },
  iconText: { textAlign: 'center', fontSize: 12, marginTop: 4 },
  settingsCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  settingLabel: { fontSize: 16 },
  settingValue: { fontSize: 16, color: '#3b82f6' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  dmFloatingButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#3B9C8F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },

dmFloatingText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
  marginLeft: 8,
},


});