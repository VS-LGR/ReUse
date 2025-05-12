import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const STORAGE_KEYS = {
  image: '@profile_image',
  notifications: '@notifications_enabled',
  language: '@language',
  theme: '@theme',
  xp: '@user_xp',
  level: '@user_level',
  badges: '@user_badges',
  location: '@user_location',
};

export default function ProfileScreen() {
  const [image, setImage] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('Português Br');
  const [theme, setTheme] = useState('Claro');
  const [user, setUser] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapData, setMapData] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

  // XP per level threshold
  const XP_PER_LEVEL = 100;

  useEffect(() => {
    (async () => {
      // Load user data
      const userData = await AsyncStorage.getItem('@logged_in_user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Load location data for the logged-in user
        const locationData = await AsyncStorage.getItem('@user_location');
        if (locationData) {
          setLocation(JSON.parse(locationData));
        }
      }

      // Load other user preferences
      const storedImage = await AsyncStorage.getItem(STORAGE_KEYS.image);
      const storedNotifications = await AsyncStorage.getItem(STORAGE_KEYS.notifications);
      const storedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.language);
      const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.theme);
      const storedXP = await AsyncStorage.getItem(STORAGE_KEYS.xp);
      const storedLevel = await AsyncStorage.getItem(STORAGE_KEYS.level);
      const storedBadges = await AsyncStorage.getItem(STORAGE_KEYS.badges);

      if (storedImage) setImage(storedImage);
      if (storedNotifications !== null) setNotifications(JSON.parse(storedNotifications));
      if (storedLanguage) setLanguage(storedLanguage);
      if (storedTheme) setTheme(storedTheme);
      if (storedXP) setXp(parseInt(storedXP));
      if (storedLevel) setLevel(parseInt(storedLevel));
      if (storedBadges) setBadges(JSON.parse(storedBadges));
    })();

    // +10 XP por visitar o perfil
    addXP(10);
  }, []);

  const addXP = async (amount) => {
    let newXP = xp + amount;
    let newLevel = level;

    while (newXP >= XP_PER_LEVEL) {
      newXP -= XP_PER_LEVEL;
      newLevel += 1;
      Alert.alert("🎉 Subiu de nível!", `Você agora é nível ${newLevel}!`);
    }

    setXp(newXP);
    setLevel(newLevel);
    await AsyncStorage.setItem(STORAGE_KEYS.xp, newXP.toString());
    await AsyncStorage.setItem(STORAGE_KEYS.level, newLevel.toString());
  };

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
      addXP(5); // tirar foto de perfil dá XP!
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
    addXP(5); // muda idioma = +XP
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'Claro' ? 'Escuro' : 'Claro';
    setTheme(newTheme);
    await AsyncStorage.setItem(STORAGE_KEYS.theme, newTheme);
    addXP(5); // muda tema = +XP
  };  

  const xpProgress = (xp / XP_PER_LEVEL) * 100;

  const getMapUrl = (lat, lon) => {
    return `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=15&addressdetails=1`;
  };

  const fetchMapData = async (lat, lon) => {
    setMapLoading(true);
    try {
      const response = await fetch(getMapUrl(lat, lon));
      const data = await response.json();
      setMapData(data);
    } catch (error) {
      console.log('Map data error:', error);
    } finally {
      setMapLoading(false);
    }
  };

  useEffect(() => {
    if (location && showMap) {
      fetchMapData(location.latitude, location.longitude);
    }
  }, [location, showMap]);

  const openInMaps = () => {
    if (location) {
      const url = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=15`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={[styles.mainContainer, theme === 'Claro' ? styles.light : styles.dark]}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            {/* Botão de Notificação */}
            <TouchableOpacity
              style={styles.notificationsBtn}
              onPress={() => router.push('/notifications')}
            >
              <Ionicons name="notifications-outline" size={34} color="#3B9C8F" />
            </TouchableOpacity>

            {/* Banner */}
            <Image
              source={{ uri: 'https://i.imgur.com/GYaQl3K.png' }}
              style={styles.headerBackground}
            />

            {/* Avatar */}
            <TouchableOpacity onPress={takePhoto}>
              <Image
                source={image ? { uri: image } : { uri: 'https://i.imgur.com/qkdpN.jpg' }}
                style={styles.avatar}
              />
            </TouchableOpacity>

            <Text style={styles.name}>{user?.name || 'Nome não disponível'}</Text>

            {/* Gamificação: XP e Level */}
            <Text style={styles.levelText}>Nível {level}</Text>
            <View style={styles.xpBarContainer}>
              <View style={[styles.xpBar, { width: `${xpProgress}%` }]} />
            </View>
            <Text style={styles.xpLabel}>{xp}/{XP_PER_LEVEL} XP</Text>

            {/* Editar Perfil */}
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar Perfil</Text>
              <MaterialIcons name="edit" size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* Linha de ícones */}
          <View style={styles.iconRow}>
            <IconLabel icon="sync" label="Trocas Pendentes" />
            <IconLabel icon="people" label="Amigos" />
            <IconLabel icon="cart" label="Compras" />
            <IconLabel icon="checkmark-done" label="Concluídos" />
          </View>

          {/* Location Card */}
          {location && (
            <View style={styles.locationCard}>
              <Text style={styles.locationCardTitle}>Localização</Text>
              <View style={styles.locationContainer}>
                <View style={styles.locationInfo}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.locationText}>{location.address}</Text>
                </View>

                {showMap && (
                  <TouchableOpacity 
                    style={styles.mapContainer}
                    onPress={openInMaps}
                    activeOpacity={0.9}
                  >
                    <View style={styles.mapContent}>
                      {mapLoading ? (
                        <ActivityIndicator size="large" color="#3B9C8F" />
                      ) : mapData ? (
                        <>
                          <View style={styles.mapInfo}>
                            <Ionicons name="location" size={24} color="#3B9C8F" />
                            <View style={styles.mapInfoText}>
                              <Text style={styles.mapInfoTitle}>
                                {mapData.display_name.split(',')[0]}
                              </Text>
                              <Text style={styles.mapInfoSubtitle}>
                                {mapData.display_name.split(',').slice(1).join(',').trim()}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.mapPreview}>
                            <Ionicons name="map-outline" size={48} color="#ccc" />
                            <Text style={styles.mapPreviewText}>
                              Visualizar no mapa
                            </Text>
                          </View>
                        </>
                      ) : (
                        <Text style={styles.mapError}>
                          Não foi possível carregar o mapa
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.mapCloseButton}
                      onPress={() => setShowMap(false)}
                    >
                      <Ionicons name="close-circle" size={24} color="#666" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}

                <View style={styles.locationDetails}>
                  {location.street && (
                    <View style={styles.locationDetailItem}>
                      <Ionicons name="navigate-outline" size={16} color="#666" />
                      <Text style={styles.locationDetailText}>{location.street}</Text>
                    </View>
                  )}
                  <View style={styles.locationDetailItem}>
                    <Ionicons name="business-outline" size={16} color="#666" />
                    <Text style={styles.locationDetailText}>
                      {[location.city, location.region].filter(Boolean).join(', ')}
                    </Text>
                  </View>
                  <View style={styles.locationDetailItem}>
                    <Ionicons name="flag-outline" size={16} color="#666" />
                    <Text style={styles.locationDetailText}>{location.country}</Text>
                  </View>
                  {location.postalCode && (
                    <View style={styles.locationDetailItem}>
                      <Ionicons name="mail-outline" size={16} color="#666" />
                      <Text style={styles.locationDetailText}>{location.postalCode}</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.toggleMapButton}
                  onPress={() => setShowMap(!showMap)}
                >
                  <Ionicons
                    name={showMap ? 'map-outline' : 'map'}
                    size={16}
                    color="#3B9C8F"
                  />
                  <Text style={styles.toggleMapText}>
                    {showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Configurações */}
          <View style={styles.settingsCard}>
            <SettingRow label="Notificações" value={notifications ? 'Ativo' : 'Inativo'} toggle={toggleNotifications} />
            <SettingRow label="Idioma" value={language} toggle={toggleLanguage} />
            <SettingRow label="Tema" value={theme} toggle={toggleTheme} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={24} />
        </TouchableOpacity>
        <Ionicons name="document-text-outline" size={24} />
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
        <Ionicons name="settings-outline" size={24} />
        <Ionicons name="person-circle-outline" size={24} />
      </View>

      {/* Floating Message Button */}
      <TouchableOpacity
        style={styles.dmFloatingButton}
        onPress={() => router.push('/messages')}
      >
        <Ionicons name="chatbubble-outline" size={20} color="#fff" />
        <Text style={styles.dmFloatingText}>Mensagens</Text>
      </TouchableOpacity>
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
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for floating button
  },
  container: {
    flex: 1,
    paddingTop: 40,
  },
  light: { backgroundColor: '#f9f9f9' },
  dark: { backgroundColor: '#1e1e1e' },
  header: { alignItems: 'center' },
  headerBackground: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: -50,
    borderWidth: 3,
    borderColor: 'white',
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
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 1000,
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
    bottom: 80,
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
    zIndex: 1001, // Higher than bottomBar
  },
  dmFloatingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  notificationsBtn: {
    position: 'absolute',
    top: -20,
    right: 20,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    zIndex: 100,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    color: '#4CAF50',
  },
  xpBarContainer: {
    width: 200,
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 6,
  },
  xpBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  xpLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
    marginBottom: 10,
  },
  locationCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
  },
  locationCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  locationContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    gap: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9f7',
    padding: 8,
    borderRadius: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#2c7a6f',
    flex: 1,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mapContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  mapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  mapInfoText: {
    flex: 1,
  },
  mapInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  mapInfoSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  mapPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  mapPreviewText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  mapError: {
    textAlign: 'center',
    color: '#dc3545',
    fontSize: 14,
  },
  mapCloseButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationDetails: {
    gap: 8,
  },
  locationDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationDetailText: {
    fontSize: 13,
    color: '#444',
  },
  toggleMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  toggleMapText: {
    color: '#3B9C8F',
    fontSize: 13,
    fontWeight: '600',
  },
});
