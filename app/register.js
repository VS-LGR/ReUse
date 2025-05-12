// app/register.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';

export default function RegisterScreen() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const getLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address ? `${address.city}, ${address.region}, ${address.country}` : 'Localização obtida',
        street: address?.street || '',
        city: address?.city || '',
        region: address?.region || '',
        country: address?.country || '',
        postalCode: address?.postalCode || '',
      });
      setShowMap(true);
    } catch (error) {
      setLocationError('Erro ao obter localização');
      console.error(error);
    } finally {
      setLocationLoading(false);
    }
  };

  const openInMaps = () => {
    if (location) {
      const url = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=15`;
      Linking.openURL(url);
    }
  };

  const getMapUrl = (lat, lon) => {
    // Using a simple, reliable static map service
    return `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=15&addressdetails=1`;
  };

  const [mapData, setMapData] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

  const fetchMapData = async (lat, lon) => {
    setMapLoading(true);
    try {
      const response = await fetch(getMapUrl(lat, lon));
      const data = await response.json();
      setMapData(data);
    } catch (error) {
      console.log('Map data error:', error);
      setLocationError('Erro ao carregar dados do mapa');
    } finally {
      setMapLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchMapData(location.latitude, location.longitude);
    }
  }, [location]);

  const registerUser = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('As senhas não coincidem!');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Você precisa aceitar os termos!');
      return;
    }

    try {
      const usersData = await AsyncStorage.getItem('@users');
      const users = usersData ? JSON.parse(usersData) : [];

      const alreadyExists = users.find((u) => u.email === email);
      if (alreadyExists) {
        Alert.alert('Este email já está registrado.');
        return;
      }

      // Create user object with location data
      const newUser = { 
        name, 
        email, 
        password,
        createdAt: new Date().toISOString()
      };

      // Store user data
      users.push(newUser);
      await AsyncStorage.setItem('@users', JSON.stringify(users));

      // Store location data separately for the user
      if (location) {
        await AsyncStorage.setItem('@user_location', JSON.stringify(location));
      }

      // Clear any existing login session
      await AsyncStorage.removeItem('@logged_in_user');

      // Navigate to login
      router.replace('/login');
      
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Erro', 'Não foi possível criar sua conta. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#444" />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://i.imgur.com/GYaQl3K.png' }}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>Crie sua conta</Text>

        {/* Inputs */}
        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="ex: joão silva"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="ex: joao.silva@email.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordField}>
            <TextInput
              style={styles.input}
              placeholder="********"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={20}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar Senha</Text>
          <View style={styles.passwordField}>
            <TextInput
              style={styles.input}
              placeholder="********"
              secureTextEntry={!showConfirmPass}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPass(!showConfirmPass)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showConfirmPass ? 'eye-off-outline' : 'eye-outline'}
                size={20}
              />
            </TouchableOpacity>
          </View>

          {/* Location Field */}
          <Text style={styles.label}>Localização</Text>
          <View style={styles.locationField}>
            <TouchableOpacity
              style={[styles.locationButton, locationLoading && styles.locationButtonDisabled]}
              onPress={getLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="location-outline" size={20} color="#fff" />
                  <Text style={styles.locationButtonText}>
                    {location ? 'Atualizar Localização' : 'Obter Localização'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {location && (
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
            )}

            {locationError && (
              <Text style={styles.locationError}>{locationError}</Text>
            )}
          </View>

          <View style={styles.terms}>
            <TouchableOpacity
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              style={styles.checkbox}
            >
              <Ionicons
                name={acceptedTerms ? 'checkbox' : 'square-outline'}
                size={20}
                color="#3B9C8F"
              />
            </TouchableOpacity>
            <Text style={styles.termsText}>
              Eu aceito os <Text style={styles.link}>Termos de Política</Text> e{' '}
              <Text style={styles.link}>Privacidade.</Text>
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.createBtn} 
            onPress={() => {
              console.log('Create button pressed');
              registerUser();
            }}
          >
            <Text style={styles.createText}>Criar</Text>
          </TouchableOpacity>
        </View>

        {/* Social logins */}
        <Text style={styles.socialTitle}>Crie sua conta com:</Text>
        <View style={styles.socialRow}>
          <Image
            source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
            style={styles.socialIcon}
          />
          <Image
            source={{ uri: 'https://img.icons8.com/fluency/48/facebook-new.png' }}
            style={styles.socialIcon}
          />
          <Image
            source={{ uri: 'https://img.icons8.com/ios-glyphs/60/github.png' }}
            style={styles.socialIcon}
          />
        </View>

        <Text style={styles.footerText}>
          Acesse sua conta para começar a trocar
        </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { width: 100, height: 108 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  form: { gap: 16 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
  },
  passwordField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  terms: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  checkbox: {
    marginTop: 2,
  },
  termsText: {
    fontSize: 12,
    color: '#444',
    flex: 1,
    flexWrap: 'wrap',
  },
  link: {
    color: '#3B9C8F',
    fontWeight: 'bold',
  },
  createBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  createText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  socialTitle: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 10,
    fontSize: 14,
    color: '#555',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  socialIcon: {
    width: 36,
    height: 36,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#777',
  },
  loginLink: {
    textAlign: 'center',
    color: '#3B9C8F',
    fontWeight: '600',
    marginTop: 4,
  },
  locationContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    gap: 12,
  },
  locationField: {
    gap: 8,
  },
  locationButton: {
    backgroundColor: '#3B9C8F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  locationButtonDisabled: {
    opacity: 0.7,
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
  locationError: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
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
