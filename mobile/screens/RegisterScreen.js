import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api/client';
import { Button } from '../components/UI';
import { colors, radius, spacing } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) return Alert.alert('Inscription', 'Prénom, nom et email requis');
    if (form.password.length < 6) return Alert.alert('Inscription', 'Mot de passe : 6 caractères minimum');
    setLoading(true);
    try {
      await register({ ...form, email: form.email.trim().toLowerCase() });
    } catch (e) {
      Alert.alert('Inscription impossible', errorMessage(e));
      setLoading(false);
    }
  };

  const field = (key, placeholder, extra = {}) => (
    <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor={colors.textSecondary} value={form[key]} onChangeText={set(key)} {...extra} />
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.primary }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>
        {field('firstName', 'Prénom')}
        {field('lastName', 'Nom')}
        {field('email', 'Email', { autoCapitalize: 'none', keyboardType: 'email-address' })}
        {field('phone', 'Téléphone', { keyboardType: 'phone-pad' })}
        {field('password', 'Mot de passe (6+ caractères)', { secureTextEntry: true })}
        <Button title="S'inscrire" onPress={submit} loading={loading} style={{ backgroundColor: colors.secondary }} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: spacing.lg }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  title: { color: colors.secondary, fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: spacing.lg },
  input: { backgroundColor: '#fff', borderRadius: radius.md, padding: 14, marginBottom: spacing.md, color: colors.text },
});
