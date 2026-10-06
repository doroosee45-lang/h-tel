import React, { useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api, { errorMessage } from '../api/client';
import useFetch from '../components/useFetch';
import { Badge, Button, Card, formatDate } from '../components/UI';
import { colors, radius, spacing } from '../theme';

const types = [
  ['taxi', 'Taxi'],
  ['airport_shuttle', 'Navette aéroport'],
  ['car_rental', 'Location voiture'],
  ['excursion', 'Excursion'],
  ['tour_guide', 'Guide'],
  ['parcel_delivery', 'Colis'],
  ['restaurant_reservation', 'Resto'],
  ['laundry', 'Blanchisserie'],
  ['other', 'Autre'],
];
const statusLabel = { pending: 'En attente', confirmed: 'Confirmée', in_progress: 'En cours', completed: 'Terminée', cancelled: 'Annulée' };
const statusColor = { pending: colors.warning, confirmed: colors.primaryLight, in_progress: colors.primaryLight, completed: colors.success, cancelled: colors.error };

export default function ConciergeScreen() {
  const { data, loading, refreshing, refresh, reload } = useFetch('/client-portal/my-concierge-requests', { pollMs: 20000 });
  const { data: reservations } = useFetch('/client-portal/my-reservations');
  const [type, setType] = useState('taxi');
  const [details, setDetails] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [sending, setSending] = useState(false);
  const stay = (reservations || []).find((r) => r.status === 'checked_in');

  const submit = async () => {
    if (scheduledFor && isNaN(new Date(scheduledFor))) return Alert.alert('Conciergerie', 'Date invalide (ex: 2025-06-01 14:30)');
    setSending(true);
    try {
      await api.post('/client-portal/concierge-request', {
        type,
        details,
        room: stay ? stay.room?._id || stay.room : undefined,
        scheduledFor: scheduledFor ? new Date(scheduledFor.replace(' ', 'T')).toISOString() : undefined,
      });
      setDetails('');
      setScheduledFor('');
      Alert.alert('Demande envoyée', 'La conciergerie va la traiter.');
      reload();
    } catch (e) {
      Alert.alert('Envoi impossible', errorMessage(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <Text style={styles.h}>Nouvelle demande</Text>
      <View style={styles.chips}>
        {types.map(([k, label]) => (
          <TouchableOpacity key={k} onPress={() => setType(k)} style={[styles.chip, type === k && styles.chipOn]}>
            <Text style={{ color: type === k ? '#fff' : colors.text }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="Détails (lieu, nombre de personnes…)" value={details} onChangeText={setDetails} />
      <TextInput style={styles.input} placeholder="Date/heure souhaitée AAAA-MM-JJ HH:MM (optionnel)" value={scheduledFor} onChangeText={setScheduledFor} />
      <Button title="Envoyer la demande" onPress={submit} loading={sending} />

      <Text style={[styles.h, { marginTop: spacing.lg }]}>Mes demandes</Text>
      {loading ? null : (data || []).length === 0 ? (
        <Text style={{ color: colors.textSecondary }}>Aucune demande pour le moment.</Text>
      ) : (
        data.map((r) => (
          <Card key={r._id}>
            <Text style={{ fontWeight: '700', color: colors.text }}>{(types.find((t) => t[0] === r.type) || [, r.type])[1]} · {r.reference}</Text>
            {r.details ? <Text style={{ color: colors.textSecondary, marginVertical: 4 }}>{r.details}</Text> : null}
            <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 6 }}>{formatDate(r.createdAt)}</Text>
            <Badge text={statusLabel[r.status]} color={statusColor[r.status]} />
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  input: { backgroundColor: '#fff', borderRadius: radius.sm, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
});
