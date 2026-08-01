import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Stack, Typography, Dialog, InputBase, List, ListItemButton,
  ListItemIcon, ListItemText, Chip, Divider, CircularProgress, IconButton
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import LocalBarRoundedIcon from '@mui/icons-material/LocalBarRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import RoomServiceRoundedIcon from '@mui/icons-material/RoomServiceRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { AppContext } from '../../context/AppContext.jsx';
import { tokens } from '../../theme.js';
import { multiSearch, highlightSegments } from '../../utils/searchUtils.js';
import {
  rooms, reservations, menuItems, barItems, clients, financeJournal, stockItems,
  employees, activities, notifications, auditLogs, events, roomServiceOrders,
  purchaseRequests, restaurantTables, kitchenOrders, concierge, qrCodes,
  rapports, clientInvoicesData, clientOrdersData, clientActivitiesData, systemUsers
} from '../../data/mockData.js';

const C = {
  chambres: <MeetingRoomRoundedIcon />,
  reservations: <EventAvailableRoundedIcon />,
  restaurant: <RestaurantRoundedIcon />,
  bar: <LocalBarRoundedIcon />,
  activites: <SpaRoundedIcon />,
  clients: <ContactsRoundedIcon />,
  factures: <ReceiptLongRoundedIcon />,
  paiements: <PaymentsRoundedIcon />,
  utilisateurs: <GroupRoundedIcon />,
  stock: <Inventory2RoundedIcon />,
  rh: <GroupRoundedIcon />,
  notifications: <NotificationsRoundedIcon />,
  audit: <HistoryRoundedIcon />,
  evenements: <CelebrationRoundedIcon />,
  commandes: <ShoppingCartRoundedIcon />,
  concierge: <SupportAgentRoundedIcon />,
  fournisseurs: <LocalShippingRoundedIcon />,
  roomService: <RoomServiceRoundedIcon />,
  qr: <QrCode2RoundedIcon />,
  rapports: <DescriptionRoundedIcon />
};

function Highlight({ text, query }) {
  const segments = highlightSegments(text, query);
  return (
    <>
      {segments.map((seg, i) =>
        seg.match ? (
          <Box component="span" key={i} sx={{ fontWeight: 700, color: tokens.color.navy }}>
            {seg.text}
          </Box>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

// Construit l'index global selon le rôle connecté.
function buildGlobalIndex(userRole, withAppState) {
  const isAdmin = userRole === 'Super Admin';
  const isManager = userRole === 'Manager';
  const isClient = userRole === 'Client';

  const groups = [];

  // --- Chambres (tous rôles opérationnels + client) ---
  groups.push({
    key: 'chambres',
    label: 'Chambres',
    icon: C.chambres,
    route: isClient ? '/client/chambres' : '/chambres',
    visible: true,
    records: rooms.map((r) => ({
      titre: r.nom,
      sousTitre: `${r.id} · ${r.categorie} · Étage ${r.etage} · ${r.statut}`,
      extra: new Intl.NumberFormat('fr-FR').format(r.prix),
      route: isClient ? '/client/chambres' : '/chambres',
      fields: ['nom', 'id', 'categorie', 'statut', 'client']
    }))
  });

  // --- Réservations ---
  groups.push({
    key: 'reservations',
    label: 'Réservations',
    icon: C.reservations,
    route: isClient ? '/client/reservations' : '/reservations',
    visible: isAdmin || isManager || isClient,
    records: (withAppState.reservations || reservations).map((r) => ({
      titre: `${r.client} — ${r.chambre}`,
      sousTitre: `${r.id} · ${r.arrivee} → ${r.depart} · ${r.statut} · ${r.canal || ''}`,
      extra: r.statut,
      route: isClient ? '/client/reservations' : '/reservations',
      fields: ['id', 'client', 'chambre', 'statut', 'canal', 'arrivee', 'depart']
    }))
  });

  // --- Restaurant ---
  if (isAdmin || isManager || isClient) {
    groups.push({
      key: 'restaurant',
      label: 'Restaurant',
      icon: C.restaurant,
      route: isClient ? '/client/restaurant' : '/restaurant',
      visible: true,
      records: menuItems.map((m) => ({
        titre: m.nom,
        sousTitre: `${m.categorie} · ${m.temps}${m.allergenes?.length ? ` · Allergènes: ${m.allergenes.join(', ')}` : ''}`,
        extra: `${new Intl.NumberFormat('fr-FR').format(m.prix)} FC`,
        route: isClient ? '/client/restaurant' : '/restaurant',
        fields: ['nom', 'categorie', 'description', 'prix', 'allergenes']
      }))
    });
  }

  // --- Bar ---
  if (isAdmin || isManager || isClient) {
    groups.push({
      key: 'bar',
      label: 'Bar',
      icon: C.bar,
      route: isClient ? '/client/bar' : '/bar',
      visible: true,
      records: barItems.map((b) => ({
        titre: b.nom,
        sousTitre: `${b.categorie} · ${b.marque} · ${b.volume} · Stock ${b.stock}`,
        extra: `${new Intl.NumberFormat('fr-FR').format(b.prix)} FC`,
        route: isClient ? '/client/bar' : '/bar',
        fields: ['nom', 'categorie', 'marque', 'volume', 'prix', 'description']
      }))
    });
  }

  // --- Activités ---
  if (isAdmin || isManager || isClient) {
    groups.push({
      key: 'activites',
      label: 'Activités',
      icon: C.activites,
      route: isClient ? '/client/activites' : '/activites',
      visible: true,
      records: activities.map((a) => ({
        titre: a.nom,
        sousTitre: a.horaire,
        extra: a.prix ? `${new Intl.NumberFormat('fr-FR').format(a.prix)} FC` : 'Inclus séjour',
        route: isClient ? '/client/activites' : '/activites',
        fields: ['nom', 'horaire', 'prix', 'description']
      }))
    });
  }

  // --- Clients (admin / manager) ---
  if (isAdmin || isManager) {
    groups.push({
      key: 'clients',
      label: 'Clients (CRM)',
      icon: C.clients,
      route: '/crm',
      visible: true,
      records: clients.map((c) => ({
        titre: c.nom,
        sousTitre: `${c.nationalite} · ${c.telephone} · ${c.email}`,
        extra: `${c.fidelite} · ${c.pointsFidelite} pts`,
        route: '/crm',
        fields: ['nom', 'nationalite', 'telephone', 'email', 'fidelite']
      }))
    });
  }

  // --- Factures (client) / Finance (admin-manager) ---
  if (isClient) {
    groups.push({
      key: 'factures',
      label: 'Mes Factures',
      icon: C.factures,
      route: '/client/factures',
      visible: true,
      records: clientInvoicesData.map((inv) => ({
        titre: inv.id,
        sousTitre: `${inv.periode} · ${inv.methode} · ${inv.date}`,
        extra: `${new Intl.NumberFormat('fr-FR').format(inv.total)} FC`,
        route: '/client/factures',
        fields: ['id', 'periode', 'methode', 'statut', 'date', 'total']
      }))
    });
  }

  // --- Paiements ---
  if (isAdmin || isManager) {
    groups.push({
      key: 'paiements',
      label: 'Paiements',
      icon: C.paiements,
      route: '/paiements',
      visible: true,
      records: (withAppState.payments || []).map((p) => ({
        titre: `${p.reference || p.client || 'Paiement'}`,
        sousTitre: `${p.type || ''} · ${p.methode || p.methodePaiement || ''} · ${p.statut || ''}`,
        extra: p.montant != null ? `${new Intl.NumberFormat('fr-FR').format(p.montant)} FC` : '',
        route: '/paiements',
        fields: ['reference', 'client', 'type', 'methode', 'methodePaiement', 'statut', 'montant']
      }))
    });
  } else if (isClient) {
    groups.push({
      key: 'paiements',
      label: 'Paiements',
      icon: C.paiements,
      route: '/client/paiements',
      visible: true,
      records: (withAppState.payments || []).filter((p) => p.client === 'M. Kanyinda Tshibola').map((p) => ({
        titre: `${p.reference || p.client || 'Paiement'}`,
        sousTitre: `${p.type || ''} · ${p.methode || p.methodePaiement || ''} · ${p.statut || ''}`,
        extra: p.montant != null ? `${new Intl.NumberFormat('fr-FR').format(p.montant)} FC` : '',
        route: '/client/paiements',
        fields: ['reference', 'client', 'type', 'methode', 'methodePaiement', 'statut', 'montant']
      }))
    });
  }

  // --- Utilisateurs (admin) ---
  if (isAdmin) {
    groups.push({
      key: 'utilisateurs',
      label: 'Utilisateurs',
      icon: C.utilisateurs,
      route: '/admin/utilisateurs',
      visible: true,
      records: (systemUsers || []).map((u) => ({
        titre: u.nom,
        sousTitre: `${u.email || ''} · ${u.role || ''} · ${u.statut || ''}`,
        extra: u.role || '',
        route: '/admin/utilisateurs',
        fields: ['nom', 'email', 'role', 'statut']
      }))
    });
  }

  // --- Stock (admin) ---
  if (isAdmin) {
    groups.push({
      key: 'stock',
      label: 'Stock',
      icon: C.stock,
      route: '/stock',
      visible: true,
      records: stockItems.map((s) => ({
        titre: s.produit,
        sousTitre: `${s.categorie} · Fournisseur: ${s.fournisseur}`,
        extra: `${s.quantite} unités · ${s.statut}`,
        route: '/stock',
        fields: ['produit', 'categorie', 'fournisseur', 'statut']
      }))
    });
  }

  // --- Personnel (admin / manager) ---
  if (isAdmin || isManager) {
    groups.push({
      key: 'rh',
      label: 'Ressources Humaines',
      icon: C.rh,
      route: '/rh',
      visible: true,
      records: employees.map((e) => ({
        titre: e.nom,
        sousTitre: `${e.poste} · ${e.departement}`,
        extra: e.statut,
        route: '/rh',
        fields: ['nom', 'poste', 'departement', 'statut']
      }))
    });
  }

  // --- Notifications ---
  if (isAdmin || isManager || isClient) {
    groups.push({
      key: 'notifications',
      label: 'Notifications',
      icon: C.notifications,
      route: isClient ? '/client/notifications' : '/notifications',
      visible: true,
      records: (withAppState.notifications || notifications).map((n) => ({
        titre: n.titre || n.detail,
        sousTitre: `${n.destinataire || n.type || ''} · ${n.canal || n.heure || ''}`,
        extra: n.heure || n.statut || '',
        route: isClient ? '/client/notifications' : '/notifications',
        fields: ['titre', 'destinataire', 'canal', 'detail', 'type', 'statut', 'heure']
      }))
    });
  }

  // --- Journal d'audit (admin) ---
  if (isAdmin) {
    groups.push({
      key: 'audit',
      label: 'Journal d’Audit',
      icon: C.audit,
      route: '/audit-logs',
      visible: true,
      records: (withAppState.auditLogs || auditLogs).map((log) => ({
        titre: log.action,
        sousTitre: `${log.user} · ${log.module} · ${log.timestamp || ''}`,
        extra: log.status || '',
        route: '/audit-logs',
        fields: ['action', 'user', 'module', 'status', 'timestamp']
      }))
    });
  }

  // --- Événements (admin / manager) ---
  if (isAdmin || isManager) {
    groups.push({
      key: 'evenements',
      label: 'Événements',
      icon: C.evenements,
      route: '/evenements',
      visible: true,
      records: events.map((e) => ({
        titre: `${e.type} — ${e.client}`,
        sousTitre: `${e.salle} · ${e.date} · ${e.traiteur}`,
        extra: `${new Intl.NumberFormat('fr-FR').format(e.montant)} FC`,
        route: '/evenements',
        fields: ['type', 'client', 'salle', 'date', 'traiteur', 'statut', 'montant']
      }))
    });
  }

  // --- Commandes (client) ---
  if (isClient) {
    groups.push({
      key: 'commandes',
      label: 'Mes Commandes',
      icon: C.commandes,
      route: '/client/commandes',
      visible: true,
      records: clientOrdersData.map((o) => ({
        titre: o.id,
        sousTitre: `${o.type} · ${new Date(o.date).toLocaleDateString('fr-FR')} · ${o.methode}`,
        extra: o.statut,
        route: '/client/commandes',
        fields: ['id', 'type', 'statut', 'methode', 'date', 'total']
      }))
    });
  }

  // --- Room Service (admin / manager) ---
  if (isAdmin || isManager) {
    groups.push({
      key: 'roomService',
      label: 'Room Service',
      icon: C.roomService,
      route: '/room-service',
      visible: true,
      records: roomServiceOrders.map((o) => ({
        titre: `${o.client} — ${o.items.join(', ')}`,
        sousTitre: `${o.id} · Chambre ${o.chambre} · ${o.heure}`,
        extra: o.statut,
        route: '/room-service',
        fields: ['id', 'client', 'chambre', 'items', 'statut', 'heure']
      }))
    });
  }

  // --- Conciergerie ---
  if (isAdmin || isManager || isClient) {
    groups.push({
      key: 'concierge',
      label: 'Conciergerie',
      icon: C.concierge,
      route: isClient ? '/client/concierge' : '/concierge',
      visible: true,
      records: concierge.map((co) => ({
        titre: co.service,
        sousTitre: co.description,
        extra: '',
        route: isClient ? '/client/concierge' : '/concierge',
        fields: ['service', 'description']
      }))
    });
  }

  // --- Achats / Fournisseurs (admin) ---
  if (isAdmin) {
    groups.push({
      key: 'achats',
      label: 'Achats & Fournisseurs',
      icon: C.fournisseurs,
      route: '/achats',
      visible: true,
      records: purchaseRequests.map((p) => ({
        titre: p.produit,
        sousTitre: `${p.id} · Fournisseur: ${p.fournisseur}`,
        extra: p.etape,
        route: '/achats',
        fields: ['produit', 'fournisseur', 'demandeur', 'etape']
      }))
    });
  }

  // --- QR Code (admin) ---
  if (isAdmin) {
    groups.push({
      key: 'qr',
      label: 'QR Code',
      icon: C.qr,
      route: '/qr-code',
      visible: true,
      records: qrCodes.map((q) => ({
        titre: q.cible,
        sousTitre: `${q.id} · ${q.type}`,
        extra: `${q.scans} scans · ${q.statut}`,
        route: '/qr-code',
        fields: ['id', 'type', 'cible', 'statut']
      }))
    });
  }

  // --- Rapports (admin / manager) ---
  if (isAdmin || isManager) {
    groups.push({
      key: 'rapports',
      label: 'Rapports',
      icon: C.rapports,
      route: '/rapports',
      visible: true,
      records: rapports.map((r) => ({
        titre: r.nom,
        sousTitre: `${r.periode} · ${r.format}`,
        extra: r.format,
        route: '/rapports',
        fields: ['nom', 'periode', 'format']
      }))
    });
  }

  return groups;
}

export default function GlobalSearch({ open, onClose }) {
  const { userRole, payments, reservations: liveReservations, notifications: liveNotifications, auditLogs: liveAuditLogs } = useContext(AppContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const appState = useMemo(
    () => ({
      payments: payments || [],
      reservations: liveReservations,
      notifications: liveNotifications,
      auditLogs: liveAuditLogs
    }),
    [payments, liveReservations, liveNotifications, liveAuditLogs]
  );

  const index = useMemo(() => buildGlobalIndex(userRole, appState), [userRole, appState]);

  // Résultats plats groupés (groupe -> liste de correspondances)
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const out = [];
    index.forEach((group) => {
      const hits = multiSearch(group.records, query, group.fields);
      if (hits.length > 0) {
        out.push({ group, hits });
      }
    });
    return out;
  }, [query, index]);

  const flatItems = useMemo(() => {
    const items = [];
    results.forEach(({ group, hits }) => {
      hits.forEach((rec, i) => items.push({ group, rec, groupHitIndex: i }));
    });
    return items;
  }, [results]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll pour suivre l'élément actif
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleSelect = (item) => {
    navigate(item.rec.route || item.group.route);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (flatItems[activeIndex]) handleSelect(flatItems[activeIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const totalHits = flatItems.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: '20px', overflow: 'hidden', boxShadow: tokens.shadow.lg } }}
    >
      <Box sx={{ p: 1.2, borderBottom: `1px solid ${tokens.color.line}`, bgcolor: '#fff' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <SearchRoundedIcon sx={{ color: tokens.color.gold, ml: 0.6 }} />
          <InputBase
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher chambres, réservations, clients, menus…"
            fullWidth
            sx={{ fontSize: 15, py: 0.6 }}
          />
          {query && (
            <IconButton size="small" onClick={() => setQuery('')}>
              <CloseRoundedIcon sx={{ fontSize: 19 }} />
            </IconButton>
          )}
          <Chip label="ESC" size="small" sx={{ fontFamily: tokens.font.mono, bgcolor: tokens.color.cream, color: 'text.secondary', height: 22 }} />
        </Stack>
      </Box>

      <Box sx={{ maxHeight: 480, overflowY: 'auto', p: 1, bgcolor: tokens.color.cream }} ref={listRef}>
        {!query.trim() && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <SearchRoundedIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.4 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Tapez pour lancer une recherche dans toute l’application
            </Typography>
          </Box>
        )}

        {query.trim() && totalHits === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Aucun résultat</Typography>
            <Typography variant="body2" color="text.secondary">
              Aucune correspondance pour « {query} ».
            </Typography>
          </Box>
        )}

        {results.map(({ group, hits }, gi) => {
          // Calcul de l'index absolu du premier item de ce groupe
          const groupStart = results.slice(0, gi).reduce((sum, g) => sum + g.hits.length, 0);
          return (
            <Box key={group.key}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1.5, pt: 1.4, pb: 0.4 }}>
                <Box sx={{ color: tokens.color.gold, display: 'flex' }}>{group.icon}</Box>
                <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '0.08em', fontWeight: 700 }}>
                  {group.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: tokens.font.mono }}>
                  {hits.length}
                </Typography>
              </Stack>
              <List dense disablePadding>
                {hits.map((rec, i) => {
                  const idx = groupStart + i;
                  return (
                    <ListItemButton
                      key={`${group.key}-${rec.titre}-${i}`}
                      data-idx={idx}
                      onClick={() => handleSelect({ rec, group })}
                      onMouseEnter={() => setActiveIndex(idx)}
                      sx={{
                        borderRadius: '10px',
                        mx: 0.5,
                        mb: 0.2,
                        bgcolor: idx === activeIndex ? tokens.color.goldSoft : 'transparent',
                        '&:hover': { bgcolor: tokens.color.goldSoft }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: tokens.color.navy }}>
                        {group.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                            <Highlight text={rec.titre} query={query} />
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 260 }}>
                              <Highlight text={rec.sousTitre} query={query} />
                            </Typography>
                            {rec.extra && (
                              <Chip label={<Highlight text={rec.extra} query={query} />} size="small" sx={{ fontSize: 10.5, height: 20, bgcolor: tokens.color.cream }} />
                            )}
                          </Stack>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
              {gi < results.length - 1 && <Divider sx={{ mt: 0.8 }} />}
            </Box>
          );
        })}
      </Box>

      <Box sx={{ px: 2, py: 1.2, borderTop: `1px solid ${tokens.color.line}`, bgcolor: '#fff', display: { xs: 'none', sm: 'block' } }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" color="text.secondary">↑↓ Naviguer</Typography>
          <Typography variant="caption" color="text.secondary">Entrée Ouvrir</Typography>
          <Typography variant="caption" color="text.secondary">Échap Fermer</Typography>
        </Stack>
      </Box>
    </Dialog>
  );
}

