import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import {
  LibraryBookItem,
  BorrowedBookItem,
  DigitalWorkstationLab,
  EResourceItem,
} from '../types';
import {
  fetchLibraryBooks,
  fetchMyBorrowedBooks,
  fetchDigitalWorkstations,
  reserveWorkstationSlot,
  fetchEResources,
} from '../services/api';

const { width } = Dimensions.get('window');

type LibraryTab = 'PHYSICAL' | 'DIGITAL';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('PHYSICAL');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Physical Library State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [books, setBooks] = useState<LibraryBookItem[]>([]);
  const [borrowedData, setBorrowedData] = useState<{
    activeLoans: BorrowedBookItem[];
    activeLoansCount: number;
    totalFinesAccrued: number;
  }>({ activeLoans: [], activeLoansCount: 0, totalFinesAccrued: 0 });

  // Digital Library State
  const [labs, setLabs] = useState<DigitalWorkstationLab[]>([]);
  const [summary, setSummary] = useState<any>({ totalWorkstations: 60, availableSlots: 41, activeUsers: 19 });
  const [eResources, setEResources] = useState<EResourceItem[]>([]);
  const [selectedLabId, setSelectedLabId] = useState<string>('LAB-01');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30 - 12:30');
  const [reserving, setReserving] = useState<boolean>(false);
  const [activeReservation, setActiveReservation] = useState<any>(null);

  const categories = ['All', 'Computer Science', 'Software Engineering', 'Artificial Intelligence', 'Databases'];

  const loadData = useCallback(async () => {
    try {
      const [booksRes, borrowedRes, workstationRes, eresRes] = await Promise.all([
        fetchLibraryBooks(searchQuery, selectedCategory === 'All' ? undefined : selectedCategory),
        fetchMyBorrowedBooks(),
        fetchDigitalWorkstations(),
        fetchEResources(),
      ]);

      setBooks(booksRes.data || []);
      setBorrowedData(borrowedRes);
      setLabs(workstationRes.labs || []);
      setSummary(workstationRes.summary || {});
      setEResources(eresRes || []);
    } catch (err) {
      console.warn('Error loading library records:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleBookWorkstation = async () => {
    setReserving(true);
    try {
      const res = await reserveWorkstationSlot(
        'WS-14',
        '2026-10-29',
        selectedSlot,
        'Research & Model Training',
      );
      setActiveReservation(res.reservation);
      Alert.alert(
        'Workstation Reserved!',
        `Your PC workstation slot for ${selectedSlot} has been confirmed. Pass: ${res.reservation?.reservationCode}`,
      );
    } catch {
      Alert.alert('Reservation Failed', 'Unable to book workstation slot. Please try again.');
    } finally {
      setReserving(false);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Unable to open link', `Could not open ${url}`);
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0f2b48" />
        <Text style={styles.loadingText}>Accessing LGU Central Library Catalog...</Text>
      </SafeAreaView>
    );
  }

  const selectedLab = labs.find((l) => l.labId === selectedLabId) || labs[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1d33" />

      {/* Top University Library Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSubtitle}>Iqbal Library Complex</Text>
            <Text style={styles.headerTitle}>Central & Digital Library</Text>
          </View>
          <View style={styles.catalogSizeBadge}>
            <Text style={styles.catalogSizeText}>15,000+ Books</Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'PHYSICAL' && styles.tabItemActive]}
            onPress={() => setActiveTab('PHYSICAL')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabItemText, activeTab === 'PHYSICAL' && styles.tabItemTextActive]}>
              📚 Physical Library
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'DIGITAL' && styles.tabItemActive]}
            onPress={() => setActiveTab('DIGITAL')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabItemText, activeTab === 'DIGITAL' && styles.tabItemTextActive]}>
              💻 Digital Labs & E-Hub
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0f2b48']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================================================================
            TAB 1: PHYSICAL LIBRARY
            ========================================================================= */}
        {activeTab === 'PHYSICAL' && (
          <View style={styles.tabContent}>
            {/* Digital Library Membership Card */}
            <View style={styles.membershipCard}>
              <View style={styles.membershipTopRow}>
                <View>
                  <Text style={styles.membershipCardTitle}>LGU Library Member Pass</Text>
                  <Text style={styles.membershipName}>Muhammad Hamza Khan</Text>
                  <Text style={styles.membershipMeta}>Roll: FA23-BCS-042 • RFID: LGU-LIB-9418</Text>
                </View>
                <View style={styles.activeStatusPill}>
                  <Text style={styles.activeStatusPillText}>Active Member</Text>
                </View>
              </View>

              <View style={styles.barcodeBox}>
                <View style={styles.barcodeBars}>
                  <View style={[styles.bar, { width: 4 }]} />
                  <View style={[styles.bar, { width: 2 }]} />
                  <View style={[styles.bar, { width: 6 }]} />
                  <View style={[styles.bar, { width: 3 }]} />
                  <View style={[styles.bar, { width: 8 }]} />
                  <View style={[styles.bar, { width: 4 }]} />
                  <View style={[styles.bar, { width: 2 }]} />
                  <View style={[styles.bar, { width: 5 }]} />
                  <View style={[styles.bar, { width: 7 }]} />
                  <View style={[styles.bar, { width: 3 }]} />
                  <View style={[styles.bar, { width: 4 }]} />
                  <View style={[styles.bar, { width: 2 }]} />
                  <View style={[styles.bar, { width: 6 }]} />
                  <View style={[styles.bar, { width: 8 }]} />
                  <View style={[styles.bar, { width: 2 }]} />
                  <View style={[styles.bar, { width: 5 }]} />
                  <View style={[styles.bar, { width: 3 }]} />
                </View>
                <Text style={styles.barcodeCodeText}>*FA23-BCS-042-LIB*</Text>
              </View>
            </View>

            {/* My Active Borrowed Books Card */}
            {borrowedData.activeLoans.length > 0 && (
              <View style={styles.borrowedSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeaderTitle}>My Borrowed Books ({borrowedData.activeLoansCount})</Text>
                  <Text style={styles.fineNotice}>
                    {borrowedData.totalFinesAccrued > 0
                      ? `Fine: Rs. ${borrowedData.totalFinesAccrued}`
                      : 'No Outstanding Fines'}
                  </Text>
                </View>

                {borrowedData.activeLoans.map((loan) => (
                  <View key={loan.recordId} style={styles.borrowCard}>
                    <View style={styles.borrowHeaderRow}>
                      <Text style={styles.borrowBookTitle} numberOfLines={1}>
                        {loan.title}
                      </Text>
                      <View
                        style={[
                          styles.loanStatusBadge,
                          loan.isOverdue ? styles.badgeOverdue : styles.badgeActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.loanStatusText,
                            loan.isOverdue ? styles.textOverdue : styles.textActive,
                          ]}
                        >
                          {loan.isOverdue ? `Overdue by ${loan.overdueDays}d` : `${loan.daysRemaining}d left`}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.borrowAuthor}>✍️ {loan.author}</Text>
                    <View style={styles.borrowMetaRow}>
                      <Text style={styles.borrowMetaText}>📍 {loan.rackLocation}</Text>
                      <Text style={styles.borrowDueDateText}>Due: {loan.dueDate}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* 15,000+ Book Inventory Search Bar */}
            <View style={styles.searchSection}>
              <Text style={styles.sectionHeaderTitle}>Search Library Catalog</Text>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by Title, Author, ISBN, or Rack..."
                  placeholderTextColor="#94a3b8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  clearButtonMode="while-editing"
                />
              </View>

              {/* Category Pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesBar}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.catPillText, selectedCategory === cat && styles.catPillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Books Listing */}
            <View style={styles.booksGrid}>
              {books.map((book) => {
                const isAvailable = book.availableCopies > 0;

                return (
                  <View key={book.id} style={styles.bookCard}>
                    <View style={styles.bookHeaderRow}>
                      <View style={styles.bookCategoryTag}>
                        <Text style={styles.bookCategoryText}>{book.category}</Text>
                      </View>
                      <View
                        style={[
                          styles.stockBadge,
                          isAvailable ? styles.stockAvailable : styles.stockOut,
                        ]}
                      >
                        <Text
                          style={[
                            styles.stockText,
                            isAvailable ? styles.stockTextAvailable : styles.stockTextOut,
                          ]}
                        >
                          {isAvailable ? `${book.availableCopies}/${book.totalCopies} Available` : 'All Issued'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.catalogBookTitle}>{book.title}</Text>
                    <Text style={styles.catalogBookAuthor}>By {book.author}</Text>

                    <View style={styles.bookFooterRow}>
                      <View style={styles.rackPill}>
                        <Text style={styles.rackPillText}>📍 {book.rackLocation}</Text>
                      </View>
                      <Text style={styles.isbnText}>ISBN: {book.isbn.slice(-10)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* =========================================================================
            TAB 2: DIGITAL LIBRARY & LAB WORKSTATIONS
            ========================================================================= */}
        {activeTab === 'DIGITAL' && (
          <View style={styles.tabContent}>
            {/* Live PC Availability Counter Card */}
            <View style={styles.livePcCard}>
              <View style={styles.livePcHeader}>
                <View>
                  <Text style={styles.livePcTitle}>Digital Lab Workstations</Text>
                  <Text style={styles.livePcSub}>High-Performance Computing & Research</Text>
                </View>
                <View style={styles.networkSpeedBadge}>
                  <Text style={styles.networkSpeedText}>⚡ 1 Gbps Fiber</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumberGreen}>{summary.availableSlots || 41}</Text>
                  <Text style={styles.statLabel}>PCs Available</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statNumberBlue}>{summary.activeUsers || 19}</Text>
                  <Text style={styles.statLabel}>Active Users</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statNumberSlate}>{summary.totalWorkstations || 60}</Text>
                  <Text style={styles.statLabel}>Total Units</Text>
                </View>
              </View>
            </View>

            {/* Active Reservation Confirmation Banner (if any) */}
            {activeReservation && (
              <View style={styles.confirmedBanner}>
                <View style={styles.confirmedTopRow}>
                  <Text style={styles.confirmedTitle}>Workstation Slot Confirmed</Text>
                  <Text style={styles.confirmedCode}>{activeReservation.reservationCode}</Text>
                </View>
                <Text style={styles.confirmedDetails}>
                  {activeReservation.allocatedDesk} • {activeReservation.timeSlot} • {activeReservation.date}
                </Text>
              </View>
            )}

            {/* Workstation Slot Booking Widget */}
            <View style={styles.bookingWidget}>
              <Text style={styles.bookingWidgetTitle}>Book a Computer Workstation</Text>
              <Text style={styles.bookingWidgetDesc}>
                Reserve a high-spec PC slot for thesis research, deep learning, or programming projects.
              </Text>

              {/* Lab Selector */}
              <Text style={styles.inputLabel}>Select Research Lab:</Text>
              <View style={styles.labSelectorRow}>
                {labs.map((l) => (
                  <TouchableOpacity
                    key={l.labId}
                    style={[styles.labSelectBtn, selectedLabId === l.labId && styles.labSelectBtnActive]}
                    onPress={() => setSelectedLabId(l.labId)}
                  >
                    <Text style={[styles.labSelectBtnText, selectedLabId === l.labId && styles.labSelectBtnTextActive]}>
                      {l.labId === 'LAB-01' ? 'AI & HPC Lab (RTX 4080)' : 'Digital Archive Lab (Core i7)'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Lab Specs Info */}
              {selectedLab && (
                <View style={styles.specsInfoBox}>
                  <Text style={styles.specsTitle}>🖥️ Specs: {selectedLab.hardwareSpecs}</Text>
                  <Text style={styles.specsSub}>OS: {selectedLab.operatingSystem}</Text>
                </View>
              )}

              {/* Time Slots Grid */}
              <Text style={styles.inputLabel}>Available Session Slots (Today / Tomorrow):</Text>
              <View style={styles.slotsGrid}>
                {['08:30 - 10:30', '10:30 - 12:30', '13:00 - 15:00', '15:00 - 17:00'].map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      style={[styles.slotCard, isSelected && styles.slotCardSelected]}
                      onPress={() => setSelectedSlot(slot)}
                    >
                      <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>{slot}</Text>
                      <Text style={[styles.slotSub, isSelected && styles.slotSubSelected]}>Open for Booking</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[styles.reserveBtn, reserving && styles.reserveBtnDisabled]}
                onPress={handleBookWorkstation}
                disabled={reserving}
              >
                {reserving ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.reserveBtnText}>Confirm Workstation Reservation ({selectedSlot})</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Quick Links to Digital Research Databases (HEC, IEEE, ScienceDirect) */}
            <View style={styles.eResourcesSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeaderTitle}>Digital Research Gateways</Text>
                <Text style={styles.fineNotice}>Free Campus & VPN Access</Text>
              </View>

              {eResources.map((res) => (
                <TouchableOpacity
                  key={res.id}
                  style={styles.eResourceCard}
                  onPress={() => openLink(res.url)}
                  activeOpacity={0.8}
                >
                  <View style={styles.eResourceHeader}>
                    <Text style={styles.eResourceName}>{res.name}</Text>
                    <View style={styles.eResourceBadge}>
                      <Text style={styles.eResourceBadgeText}>{res.badge}</Text>
                    </View>
                  </View>

                  <Text style={styles.eResourceDesc}>{res.description}</Text>
                  <View style={styles.eResourceFooter}>
                    <Text style={styles.eResourceCoverage}>📖 {res.coverage}</Text>
                    <Text style={styles.openLinkArrow}>Access Database →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#0a1d33',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerSubtitle: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  catalogSizeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  catalogSizeText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    padding: 3,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabItemActive: {
    backgroundColor: '#ffffff',
  },
  tabItemText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  tabItemTextActive: {
    color: '#0f2b48',
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 16,
  },
  membershipCard: {
    backgroundColor: '#0f2b48',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#0f2b48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  membershipTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  membershipCardTitle: {
    color: '#93c5fd',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  membershipName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  membershipMeta: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 2,
  },
  activeStatusPill: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  activeStatusPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  barcodeBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  barcodeBars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    gap: 3,
  },
  bar: {
    height: '100%',
    backgroundColor: '#0f172a',
  },
  barcodeCodeText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
  borrowedSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  fineNotice: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  borrowCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  borrowHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borrowBookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  loanStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeActive: {
    backgroundColor: '#ecfdf5',
  },
  badgeOverdue: {
    backgroundColor: '#fee2e2',
  },
  loanStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textActive: {
    color: '#047857',
  },
  textOverdue: {
    color: '#b91c1c',
  },
  borrowAuthor: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  borrowMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  borrowMetaText: {
    fontSize: 11,
    color: '#475569',
  },
  borrowDueDateText: {
    fontSize: 11,
    color: '#b91c1c',
    fontWeight: '600',
  },
  searchSection: {
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  categoriesBar: {
    flexDirection: 'row',
  },
  catPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  catPillActive: {
    backgroundColor: '#0f2b48',
    borderColor: '#0f2b48',
  },
  catPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  catPillTextActive: {
    color: '#ffffff',
  },
  booksGrid: {
    gap: 10,
  },
  bookCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bookHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bookCategoryTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bookCategoryText: {
    color: '#2563eb',
    fontSize: 10,
    fontWeight: '700',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  stockAvailable: {
    backgroundColor: '#ecfdf5',
  },
  stockOut: {
    backgroundColor: '#fee2e2',
  },
  stockText: {
    fontSize: 10,
    fontWeight: '700',
  },
  stockTextAvailable: {
    color: '#059669',
  },
  stockTextOut: {
    color: '#dc2626',
  },
  catalogBookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  catalogBookAuthor: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  bookFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  rackPill: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rackPillText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  isbnText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  livePcCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  livePcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  livePcTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  livePcSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  networkSpeedBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  networkSpeedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e2e8f0',
  },
  statNumberGreen: {
    fontSize: 22,
    fontWeight: '800',
    color: '#10b981',
  },
  statNumberBlue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3b82f6',
  },
  statNumberSlate: {
    fontSize: 22,
    fontWeight: '800',
    color: '#475569',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  confirmedBanner: {
    backgroundColor: '#ecfdf5',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  confirmedTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065f46',
  },
  confirmedCode: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
  },
  confirmedDetails: {
    fontSize: 11,
    color: '#047857',
    marginTop: 4,
  },
  bookingWidget: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  bookingWidgetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  bookingWidgetDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 6,
  },
  labSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  labSelectBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  labSelectBtnActive: {
    backgroundColor: '#0f2b48',
    borderColor: '#0f2b48',
  },
  labSelectBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  labSelectBtnTextActive: {
    color: '#ffffff',
  },
  specsInfoBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  specsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
  specsSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotCard: {
    width: (width - 72) / 2,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  slotCardSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  slotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  slotTextSelected: {
    color: '#1d4ed8',
  },
  slotSub: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 2,
  },
  slotSubSelected: {
    color: '#2563eb',
  },
  reserveBtn: {
    backgroundColor: '#0f2b48',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  reserveBtnDisabled: {
    opacity: 0.6,
  },
  reserveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  eResourcesSection: {
    gap: 10,
  },
  eResourceCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  eResourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eResourceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  eResourceBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  eResourceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563eb',
  },
  eResourceDesc: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
  },
  eResourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  eResourceCoverage: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  openLinkArrow: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '700',
  },
});
