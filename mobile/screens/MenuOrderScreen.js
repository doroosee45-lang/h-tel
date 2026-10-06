import React, { useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api, { errorMessage } from '../api/client';
import useFetch from '../components/useFetch';
import { Button, Card, Empty, ErrorBox, Loading, formatMoney } from '../components/UI';
import { colors, radius, spacing } from '../theme';

// type: 'menu' (restaurant, GET /menu) ou 'drink' (bar, GET /drinks)
// mode: 'room_service' => commande livrée en chambre et facturée sur la chambre
export default function MenuOrderScreen({ type = 'menu', mode, navigation }) {
  const isDrink = type === 'drink';
  const roomService = mode === 'room_service';
  const { data: items, loading, error, reload, refreshing, refresh } = useFetch(isDrink ? '/drinks' : '/menu', { params: { limit: 100, available: true } });
  const { data: reservations } = useFetch(roomService ? '/client-portal/my-reservations' : '/client-portal/me');
  const [cart, setCart] = useState({});
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);

  const stays = (reservations || []).filter((r) => r.status === 'checked_in');
  const stay = stays[0];

  const lines = useMemo(() => (items || []).filter((i) => cart[i._id]).map((i) => ({ item: i, quantity: cart[i._id] })), [items, cart]);
  const total = lines.reduce((s, l) => s + l.item.price * l.quantity, 0);

  const change = (id, delta) =>
    setCart((c) => {
      const q = Math.max(0, (c[id] || 0) + delta);
      const next = { ...c };
      if (q === 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const submit = async () => {
    if (lines.length === 0) return;
    if (roomService && !stay) return Alert.alert('Room service', 'Le room service est disponible après votre check-in à la réception.');
    setSending(true);
    try {
      await api.post('/client-portal/order', {
        origin: isDrink ? 'bar' : 'restaurant',
        channel: roomService ? 'room_service' : 'mobile',
        room: roomService ? stay.room?._id || stay.room : undefined,
        chargedToRoom: roomService,
        notes: notes || undefined,
        items: lines.map((l) => ({ menuItem: l.item._id, quantity: l.quantity })),
      });
      setCart({});
      setNotes('');
      Alert.alert('Commande envoyée', 'Suivez son état depuis l’accueil ou vos réservations.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Commande impossible', errorMessage(e));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {roomService ? (
        <Text style={styles.banner}>{stay ? `Livraison chambre ${stay.room?.number || ''} — facturé sur la chambre` : 'Disponible après votre check-in'}</Text>
      ) : null}
      <FlatList
        data={items}
        keyExtractor={(i) => i._id}
        contentContainerStyle={{ padding: spacing.md, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListEmptyComponent={<Empty text="Aucun article disponible." />}
        renderItem={({ item }) => (
          <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: colors.text }}>{item.name}</Text>
              {item.description ? <Text style={{ color: colors.textSecondary, fontSize: 12 }} numberOfLines={2}>{item.description}</Text> : null}
              <Text style={{ color: colors.primary, fontWeight: '700', marginTop: 4 }}>{formatMoney(item.price)}</Text>
            </View>
            <View style={styles.qty}>
              <TouchableOpacity onPress={() => change(item._id, -1)} style={styles.qtyBtn}><Text style={styles.qtyTxt}>−</Text></TouchableOpacity>
              <Text style={{ minWidth: 22, textAlign: 'center' }}>{cart[item._id] || 0}</Text>
              <TouchableOpacity onPress={() => change(item._id, 1)} style={styles.qtyBtn}><Text style={styles.qtyTxt}>+</Text></TouchableOpacity>
            </View>
          </Card>
        )}
      />
      {lines.length > 0 ? (
        <ScrollView style={styles.footer} keyboardShouldPersistTaps="handled">
          <TextInput style={styles.input} placeholder="Instructions (optionnel)" value={notes} onChangeText={setNotes} />
          <Button title={`Commander · ${formatMoney(total)}`} onPress={submit} loading={sending} />
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: colors.primaryLight, color: '#fff', padding: spacing.sm, textAlign: 'center' },
  qty: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  qtyTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
  footer: { maxHeight: 140, padding: spacing.md, backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.border },
  input: { backgroundColor: colors.background, borderRadius: radius.sm, padding: 10, marginBottom: spacing.sm },
});
