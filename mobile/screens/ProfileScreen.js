import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api, { errorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import useFetch from '../components/useFetch';
import { Button, Card, formatDate } from '../components/UI';
import { colors, radius, spacing } from '../theme';

export default function ProfileScreen() {
  const { user, updateProfile, logout, refreshUnread } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const { data: notifications, refreshing, refresh, reload } = useFetch('/client-portal/my-notifications', { pollMs: 20000 });

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' });
  }, [user]);

  const save = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return Alert.alert('Profil', 'Prénom et nom requis');
    setSaving(true);
    try {
      await updateProfile(form);
      Alert.alert('Profil', 'Informations enregistrées');
    } catch (e) {
      Alert.alert('Erreur', errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const markRead = async (n) => {
    if (n.isRead) return;
    try {
      await api.patch(`/client-portal/my-notifications/${n._id}/read`);
      await reload(true);
      refreshUnread();
    } catch (e) {
      // ignoré: sera resynchronisé au prochain sondage
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={{ color: colors.textSecondary, marginBottom: spacing.md }}>Points fidélité : {user?.loyaltyPoints ?? 0}{user?.vipStatus ? ' · VIP' : ''}</Text>
      <TextInput style={styles.input} placeholder="Prénom" value={form.firstName} onChangeText={(v) => setForm({ ...form, firstName: v })} />
      <TextInput style={styles.input} placeholder="Nom" value={form.lastName} onChangeText={(v) => setForm({ ...form, lastName: v })} />
      <TextInput style={styles.input} placeholder="Téléphone" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} />
      <Button title="Enregistrer" onPress={save} loading={saving} />

      <Text style={styles.h}>Notifications</Text>
      {(notifications || []).length === 0 ? (
        <Text style={{ color: colors.textSecondary }}>Aucune notification.</Text>
      ) : (
        notifications.map((n) => (
          <TouchableOpacity key={n._id} onPress={() => markRead(n)}>
            <Card style={!n.isRead && { borderColor: colors.secondary }}>
              <Text style={{ fontWeight: n.isRead ? '500' : '800', color: colors.text }}>{n.title}</Text>
              <Text style={{ color: colors.textSecondary }}>{n.message}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 11 }}>{formatDate(n.createdAt)}</Text>
            </Card>
          </TouchableOpacity>
        ))
      )}

      <View style={{ marginTop: spacing.lg }}>
        <Button title="Se déconnecter" variant="secondary" onPress={logout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  email: { fontSize: 18, fontWeight: '800', color: colors.primary },
  h: { fontSize: 17, fontWeight: '700', color: colors.text, marginVertical: spacing.md },
  input: { backgroundColor: '#fff', borderRadius: radius.sm, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
});
