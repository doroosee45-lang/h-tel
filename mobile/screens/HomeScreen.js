import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import useFetch from '../components/useFetch';
import { Badge, Card, formatMoney } from '../components/UI';
import { colors, radius, spacing } from '../theme';

const tiles = [
  { to: 'Rooms', icon: 'bed-outline', label: 'Chambres' },
  { to: 'Restaurant', icon: 'restaurant-outline', label: 'Restaurant' },
  { to: 'Bar', icon: 'wine-outline', label: 'Bar' },
  { to: 'RoomService', icon: 'cafe-outline', label: 'Room service' },
  { to: 'Concierge', icon: 'headset-outline', label: 'Conciergerie' },
  { to: 'Bookings', icon: 'calendar-outline', label: 'Mes réservations' },
];

const statusLabel = { new: 'Reçue', preparing: 'En préparation', ready: 'Prête', served: 'Servie', cancelled: 'Annulée' };

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  // Sondage toutes les 15 s: suivi des commandes en cours
  const { data: orders, refreshing, refresh } = useFetch('/client-portal/my-orders', { pollMs: 15000 });
  const active = (orders || []).filter((o) => ['new', 'preparing', 'ready'].includes(o.status));

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.md }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <Text style={styles.hello}>Bonjour {user?.firstName} 👋</Text>
      <View style={styles.grid}>
        {tiles.map((t) => (
          <TouchableOpacity key={t.to} style={styles.tile} onPress={() => navigation.navigate(t.to)}>
            <Ionicons name={t.icon} size={30} color={colors.primary} />
            <Text style={styles.tileText}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.section}>Commandes en cours</Text>
      {active.length === 0 ? (
        <Text style={{ color: colors.textSecondary }}>Aucune commande en cours.</Text>
      ) : (
        active.map((o) => (
          <Card key={o._id}>
            <Text style={{ fontWeight: '700', color: colors.text }}>{o.orderNumber}</Text>
            <Text style={{ color: colors.textSecondary, marginVertical: 4 }}>{formatMoney(o.total)}</Text>
            <Badge text={statusLabel[o.status]} color={o.status === 'ready' ? colors.success : colors.warning} />
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hello: { fontSize: 22, fontWeight: '800', color: colors.primary, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%', backgroundColor: colors.card, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  tileText: { marginTop: spacing.sm, color: colors.text, fontWeight: '600' },
  section: { fontSize: 17, fontWeight: '700', color: colors.text, marginVertical: spacing.md },
});
