import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const data = await AsyncStorage.getItem('@logged_in_user');
      if (data) {
        router.replace('/profile');
      }
    };
    checkLoggedIn();
  }, []);

  const login = async () => {
    try {
      const usersData = await AsyncStorage.getItem('@users');
      const users = usersData ? JSON.parse(usersData) : [];

      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        Alert.alert('Email ou senha inválidos!');
        return;
      }

      await AsyncStorage.setItem('@logged_in_user', JSON.stringify(foundUser));
      Alert.alert('Login realizado com sucesso!');
      router.push('/profile');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro ao fazer login.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        {/* Back + Logo */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#444" />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://i.imgur.com/GYaQl3K.png' }}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>Login</Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: joao.silva@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Senha */}
        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordField}>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Esqueceu a senha?.</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={login}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Social login icons */}
        <Text style={styles.socialText}>Ou faça Login com:</Text>
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

        {/* Footer */}
        <Text style={styles.footerText}>
          Novo por aqui? Crie sua conta gratuitamente.
        </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.signupLink}>CADASTRE-SE</Text>
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
  topBar: {
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
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
  forgotBtn: { alignSelf: 'flex-end', marginTop: 6 },
  forgotText: { fontSize: 12, color: '#888' },
  loginBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  loginText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  socialText: {
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
  socialIcon: { width: 36, height: 36 },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#777',
  },
  signupLink: {
    textAlign: 'center',
    color: '#3B9C8F',
    fontWeight: '600',
    marginTop: 4,
  },
});
