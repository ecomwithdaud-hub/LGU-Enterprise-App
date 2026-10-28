import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import StudentDashboardScreen from './src/screens/StudentDashboardScreen';
import LibraryScreen from './src/screens/LibraryScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'STUDENT_PORTAL' | 'LIBRARY' | 'HUB'>('STUDENT_PORTAL');

  const modules = [
    { id: 'timetables', title: '📅 Class Timetables', desc: 'Real-time clash-free schedule matrix', target: 'STUDENT_PORTAL' },
    { id: 'library', title: '📚 Central Library', desc: '15,000+ catalog, digital labs & e-resources', target: 'LIBRARY' },
    { id: 'fees', title: '💳 Fee Challans', desc: 'HBL / 1Bill voucher & online ledger', target: 'STUDENT_PORTAL' },
    { id: 'transport', title: '🚌 Transport Tracking', desc: 'Live bus routes, stops & digital pass', target: 'HUB' },
    { id: 'cafeteria', title: '🍔 Campus Cafeteria', desc: 'Digital canteen menu & order queue', target: 'HUB' },
    { id: 'notices', title: '📢 Campus Notices', desc: 'Official academic circulars & alerts', target: 'HUB' },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'STUDENT_PORTAL':
        return <StudentDashboardScreen />;
      case 'LIBRARY':
        return <LibraryScreen />;
      case 'HUB':
      default:
        return (
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f2b48" />
            <View style={styles.header}>
              <Text style={styles.headerSubtitle}>Lahore Garrison University</Text>
              <Text style={styles.headerTitle}>LGU Super App</Text>
              <Text style={styles.headerStatus}>Enterprise Mobile Portal • Connected</Text>
            </View>

            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
              <View style={styles.welcomeBanner}>
                <Text style={styles.welcomeTitle}>Welcome to LGU Campus Life</Text>
                <Text style={styles.welcomeDesc}>
                  All-in-one ecosystem for students, faculty members, and administrative departments.
                </Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.portalActionBtn}
                    onPress={() => setCurrentScreen('STUDENT_PORTAL')}
                  >
                    <Text style={styles.portalActionBtnText}>Student Portal →</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.portalActionBtn, styles.libraryActionBtn]}
                    onPress={() => setCurrentScreen('LIBRARY')}
                  >
                    <Text style={styles.portalActionBtnText}>Central Library →</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.sectionHeader}>Campus Modules</Text>
              <View style={styles.grid}>
                {modules.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={styles.card}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (m.target === 'STUDENT_PORTAL') setCurrentScreen('STUDENT_PORTAL');
                      else if (m.target === 'LIBRARY') setCurrentScreen('LIBRARY');
                    }}
                  >
                    <Text style={styles.cardTitle}>{m.title}</Text>
                    <Text style={styles.cardDesc}>{m.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a1d33' }}>
      {renderScreen()}

      {/* Bottom Floating Navigation Switcher for Developer Preview */}
      <View style={styles.floatingBar}>
        <TouchableOpacity
          style={[styles.floatingBtn, currentScreen === 'STUDENT_PORTAL' && styles.floatingBtnActive]}
          onPress={() => setCurrentScreen('STUDENT_PORTAL')}
        >
          <Text style={[styles.floatingBtnText, currentScreen === 'STUDENT_PORTAL' && styles.floatingBtnTextActive]}>
            🎓 Student
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingBtn, currentScreen === 'LIBRARY' && styles.floatingBtnActive]}
          onPress={() => setCurrentScreen('LIBRARY')}
        >
          <Text style={[styles.floatingBtnText, currentScreen === 'LIBRARY' && styles.floatingBtnTextActive]}>
            📚 Library
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingBtn, currentScreen === 'HUB' && styles.floatingBtnActive]}
          onPress={() => setCurrentScreen('HUB')}
        >
          <Text style={[styles.floatingBtnText, currentScreen === 'HUB' && styles.floatingBtnTextActive]}>
            🏛️ Hub
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#0f2b48',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerSubtitle: {
    color: '#93c5fd',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  headerStatus: {
    color: '#34d399',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  welcomeBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  welcomeDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  portalActionBtn: {
    backgroundColor: '#0f2b48',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  libraryActionBtn: {
    backgroundColor: '#10b981',
  },
  portalActionBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  floatingBar: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    backgroundColor: '#0a1d33',
    flexDirection: 'row',
    borderRadius: 30,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  floatingBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25,
  },
  floatingBtnActive: {
    backgroundColor: '#10b981',
  },
  floatingBtnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  floatingBtnTextActive: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
