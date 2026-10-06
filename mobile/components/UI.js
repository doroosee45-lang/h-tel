import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export const Loading = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

export const ErrorBox = ({ message, onRetry }) => (
  <View style={styles.center}>
    <Text style={{ color: colors.error, textAlign: 'center', marginBottom: spacing.md }}>{message}</Text>
    {onRetry ? <Button title="Réessayer" onPress={onRetry} /> : null}
  </View>
);

export const Empty = ({ text }) => (
  <View style={styles.center}>
    <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>{text}</Text>
  </View>
);

export const Button = ({ title, onPress, disabled, loading, variant = 'primary', style }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    style={[styles.btn, variant === 'secondary' && styles.btnSecondary, (disabled || loading) && { opacity: 0.6 }, style]}
  >
    {loading ? (
      <ActivityIndicator color={variant === 'secondary' ? colors.primary : '#fff'} />
    ) : (
      <Text style={[styles.btnText, variant === 'secondary' && { color: colors.primary }]}>{title}</Text>
    )}
  </TouchableOpacity>
);

export const Card = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;

export const Badge = ({ text, color = colors.primary }) => (
  <View style={{ backgroundColor: color, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start' }}>
    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{text}</Text>
  </View>
);

export const formatDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '-');
export const formatMoney = (n) => `${Number(n || 0).toFixed(2)} €`;

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  btn: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: spacing.lg, borderRadius: radius.md, alignItems: 'center' },
  btnSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
});
