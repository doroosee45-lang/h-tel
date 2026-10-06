import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useFetch from '../components/useFetch';
import { Badge, Card, Empty, ErrorBox, Loading, formatDate, formatMoney } from '../components/UI';
import { colors, spacing } from '../theme';

const resLabel = { pending: 'En attente', confirmed: 'Confirmée', checked_in: 'En séjour', checked_out: 'Terminée', cancelled: 'Annulée', no_show: 'Absent' };
const orderLabel = { new: 'Reçue', preparing: 'En préparation', ready: 'Prête', served: 'Servie', cancelled: 'Annulée' };
const invLabel = { unpaid: 'Impayée', partial: 'Partielle', paid: 'Payée', cancelled: 'Annulée' };
const good = ['confirmed', 'checked_in', 'ready', 'served', 'paid', 'checked_out'];
const color = (s) => (good.includes(s) ? colors.success : s === 'cancelled' || s === 'no_show' || s === 'unpaid' ? colors.error : colors.warning);

const TABS = [['reservations', 'Séjours'], ['orders', 'Commandes'], ['invoices', 'Factures']];
const URLS = { reservations: '/client-portal/my-reservations', orders: '/client-portal/my-orders', invoices: '/client-portal/my-invoices' };

export default function BookingsScreen() {
  const [tab, setTab] = useState('reservations');
  // Sondage 15 s: statut des réservations/commandes mis à jour sans action de l'utilisateur
  const { data, loading, error, reload, refreshing, refresh } = useFetch(URLS[tab], { pollMs: 15000 });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.tabs}>
        {TABS.map(([k, label]) => (
          <TouchableOpacity key={k} onPress={() => setTab(k)} style={[styles.tab, tab === k && styles.tabOn]}>
            <Text style={{ color: tab === k ? '#fff' : colors.text, fontWeight: '600' }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.md, flexGrow: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
          {(data || []).length === 0 ? <Empty text="Rien à afficher pour le moment." /> : null}
          {tab === 'reservations' && (data || []).map((r) => (
            <Card key={r._id}>
              <Text style={styles.t}>Chambre {r.room?.number} · {r.reference}</Text>
              <Text style={styles.s}>{formatDate(r.checkInDate)} → {formatDate(r.checkOutDate)} ({r.nights} nuit(s))</Text>
              <Text style={styles.s}>{formatMoney(r.totalAmount)}</Text>
              <Badge text={resLabel[r.status] || r.status} color={color(r.status)} />
            </Card>
          ))}
          {tab === 'orders' && (data || []).map((o) => (
            <Card key={o._id}>
              <Text style={styles.t}>{o.orderNumber} · {o.origin === 'bar' ? 'Bar' : 'Restaurant'}</Text>
              <Text style={styles.s}>{o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}</Text>
              <Text style={styles.s}>{formatMoney(o.total)} · {formatDate(o.createdAt)}</Text>
              <Badge text={orderLabel[o.status] || o.status} color={color(o.status)} />
            </Card>
          ))}
          {tab === 'invoices' && (data || []).map((inv) => (
            <Card key={inv._id}>
              <Text style={styles.t}>{inv.invoiceNumber || inv.reference || 'Facture'}</Text>
              <Text style={styles.s}>{formatMoney(inv.total)} · {formatDate(inv.createdAt)}</Text>
              <Badge text={invLabel[inv.status] || inv.status} color={color(inv.status)} />
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', padding: spacing.sm, gap: spacing.sm },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  tabOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  t: { fontWeight: '700', color: colors.text },
  s: { color: colors.textSecondary, marginVertical: 3 },
});
