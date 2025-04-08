import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header: Logo + Login */}
      <View style={styles.topBar}>
        <Image
          source={{ uri: 'https://i.imgur.com/GYaQl3K.png' }}
          style={styles.logo}
        />
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={styles.loginBtn}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Main Text */}
      <Text style={styles.title}>Bem-vindo ao ReUse!</Text>

      {/* Illustration */}
      <Image
        source={{
          uri: 'https://i.imgur.com/9bPPRpe.png', // Replace with your actual image URL if needed
        }}
        style={styles.illustration}
        
      />

      {/* Subtitle */}
      <Text style={styles.subtitle}>Dê uma nova vida aos seus objetos</Text>

      {/* Cadastro button */}
      <TouchableOpacity
        style={styles.cadastroBtn}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.cadastroText}>Cadastre-se aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 100,
    height: 108,
    resizeMode: 'center',
  },
  loginBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    marginTop: 40,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  illustration: {
    width: '100%',
    height: 200,
    marginVertical: 30,
    resizeMode: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  cadastroBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  cadastroText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
