import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import api, { errorMessage } from '../api/client';
import { Button, Card, formatMoney } from '../components/UI';
import { colors, radius, spacing } from '../theme';

const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s));

export default function RoomDetailScreen({ route, navigation }) {
  const { room } = route.params;
  const [checkInDate, setIn] = useState(route.params.checkInDate || '');
  const [checkOutDate, setOut] = useState(route.params.checkOutDate || '');
  const [adults, setAdults] = useState('1');
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState(null);
  const [booking, setBooking] = useState(false);
  const valid = isDate(checkInDate) && isDate(checkOutDate) && checkOutDate > checkInDate;

  useEffect(() => {
    setQuote(null);
    setQuoteError(null);
    if (!valid) return;
    api
      .get(`/client-portal/rooms/${room._id}/price-quote`, { params: { checkInDate, checkOutDate } })
      .then((res) => setQuote(res.data.data))
      .catch((e) => setQuoteError(errorMessage(e)));
  }, [valid, checkInDate, checkOutDate, room._id]);

  const book = async () => {
    setBooking(true);
    try {
      await api.post('/client-portal/book-room', { room: room._id, checkInDate, checkOutDate, adults: Number(adults) || 1 });
      Alert.alert('Réservation confirmée', 'Retrouvez-la dans vos réservations.', [{ text: 'OK', onPress: () => navigation.navigate('Bookings') }]);
    } catch (e) {
      Alert.alert('Réservation impossible', errorMessage(e));
    } finally {
      setBooking(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.md }}>
      <Card>
        <Text style={styles.title}>Chambre {room.number}{room.name ? ` · ${room.name}` : ''}</Text>
        <Text style={{ color: colors.textSecondary, marginVertical: 4 }}>{room.category?.name} · {room.category?.capacity} pers. · étage {room.floor || '-'}</Text>
        {room.description ? <Text style={{ color: colors.text }}>{room.description}</Text> : null}
        {room.category?.amenities?.length ? <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Équipements : {room.category.amenities.join(', ')}</Text> : null}
        {room.equipment?.length ? <Text style={{ color: colors.textSecondary }}>{room.equipment.join(', ')}</Text> : null}
      </Card>
      <TextInput style={styles.input} placeholder="Arrivée AAAA-MM-JJ" value={checkInDate} onChangeText={setIn} />
      <TextInput style={styles.input} placeholder="Départ AAAA-MM-JJ" value={checkOutDate} onChangeText={setOut} />
      <TextInput style={styles.input} placeholder="Adultes" keyboardType="number-pad" value={adults} onChangeText={setAdults} />
      {quote ? (
        <Card>
          <Text style={{ color: colors.text }}>{quote.nights} nuit(s) · {formatMoney(quote.averagePricePerNight)} / nuit</Text>
          <Text style={{ fontWeight: '800', color: colors.primary, fontSize: 18 }}>Total : {formatMoney(quote.totalAfterPromotion)}</Text>
        </Card>
      ) : null}
      {quoteError ? <Text style={{ color: colors.error, marginBottom: spacing.md }}>{quoteError}</Text> : null}
      <Button title="Réserver" onPress={book} disabled={!valid} loading={booking} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '800', color: colors.primary },
  input: { backgroundColor: '#fff', borderRadius: radius.sm, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
});
