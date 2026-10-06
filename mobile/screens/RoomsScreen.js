import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import useFetch from '../components/useFetch';
import { Card, Empty, ErrorBox, Loading, formatMoney } from '../components/UI';
import { colors, radius, spacing } from '../theme';

const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s));

export default function RoomsScreen({ navigation }) {
  const [checkInDate, setIn] = useState('');
  const [checkOutDate, setOut] = useState('');
  const filtered = isDate(checkInDate) && isDate(checkOutDate) && checkOutDate > checkInDate;
  const { data, loading, error, reload, refreshing, refresh } = useFetch('/client-portal/rooms', {
    params: filtered ? { checkInDate, checkOutDate } : {},
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.filters}>
        <TextInput style={styles.input} placeholder="Arrivée AAAA-MM-JJ" value={checkInDate} onChangeText={setIn} />
        <TextInput style={styles.input} placeholder="Départ AAAA-MM-JJ" value={checkOutDate} onChangeText={setOut} />
      </View>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(r) => r._id}
          contentContainerStyle={{ padding: spacing.md, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          ListEmptyComponent={<Empty text="Aucune chambre disponible." />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('RoomDetail', { room: item, checkInDate: filtered ? checkInDate : '', checkOutDate: filtered ? checkOutDate : '' })}>
              <Card>
                <Text style={styles.title}>Chambre {item.number}{item.name ? ` · ${item.name}` : ''}</Text>
                <Text style={{ color: colors.textSecondary }}>{item.category?.name} · {item.category?.capacity} pers.</Text>
                <Text style={{ color: colors.primary, fontWeight: '700', marginTop: 4 }}>dès {formatMoney(item.category?.basePrice)} / nuit</Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: radius.sm, padding: 10, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
});
