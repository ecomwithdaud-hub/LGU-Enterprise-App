import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  const modules = [
    { title: '📅 Class Timetables', desc: 'Real-time clash-free schedule matrix' },
    { title: '🚌 Transport Tracking', desc: 'Live bus routes, stops & digital pass' },
    { title: '💳 Fee Challans', desc: 'HBL / 1Bill voucher & online ledger' },
    { title: '📚 Central Library', desc: 'ISBN catalog & active borrow status' },
    { title: '🍔 Campus Cafeteria', desc: 'Digital canteen menu & order queue' },
    { title: '📢 Campus Notices', desc: 'Official academic circulars & alerts' },
  ];

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
        </View>

        <Text style={styles.sectionHeader}>Campus Modules</Text>
        <View style={styles.grid}>
          {modules.map((m, idx) => (
            <TouchableOpacity key={idx} style={styles.card} activeOpacity={0.8}>
              <Text style={styles.cardTitle}>{m.title}</Text>
              <Text style={styles.cardDesc}>{m.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
});
