import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api/client';
import { Button } from '../components/UI';
import { colors, radius, spacing } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) return Alert.alert('Connexion', 'Email et mot de passe requis');
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (e) {
      Alert.alert('Connexion impossible', errorMessage(e));
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.primary }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Smart Hotel 360</Text>
        <Text style={styles.subtitle}>Espace client</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.textSecondary} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Mot de passe" placeholderTextColor={colors.textSecondary} secureTextEntry value={password} onChangeText={setPassword} />
        <Button title="Se connecter" onPress={submit} loading={loading} style={{ backgroundColor: colors.secondary }} />
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: spacing.lg }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Pas de compte ? Créer un compte</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  title: { color: colors.secondary, fontSize: 32, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#fff', textAlign: 'center', marginBottom: spacing.xl },
  input: { backgroundColor: '#fff', borderRadius: radius.md, padding: 14, marginBottom: spacing.md, color: colors.text },
});
