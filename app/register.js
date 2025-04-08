// app/register.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

      const newUser = { name, email, password };
      users.push(newUser);

      await AsyncStorage.setItem('@users', JSON.stringify(users));

      Alert.alert('Usuário criado com sucesso!');
      router.push('/login');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro ao registrar usuário!');
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

          <Text style={styles.label}>Senha</Text>
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

          <TouchableOpacity style={styles.createBtn} onPress={registerUser}>
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
});
