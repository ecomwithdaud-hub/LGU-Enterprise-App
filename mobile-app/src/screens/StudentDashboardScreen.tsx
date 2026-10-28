import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { StudentDashboardData } from '../types';
import { fetchStudentDashboard, MOCK_STUDENT_DASHBOARD } from '../services/api';

const { width } = Dimensions.get('window');

type ActiveTab = 'COURSES' | 'CHALLANS' | 'CALENDAR';

export default function StudentDashboardScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<StudentDashboardData>(MOCK_STUDENT_DASHBOARD);
  const [activeTab, setActiveTab] = useState<ActiveTab>('COURSES');
  const [selectedChallan, setSelectedChallan] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchStudentDashboard();
      if (data && data.student) {
        setDashboard(data);
      }
    } catch (err) {
      console.warn('Error fetching student dashboard, using fallback:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0f2b48" />
        <Text style={styles.loadingText}>Loading LGU Student Portal...</Text>
      </SafeAreaView>
    );
  }

  const { student, academicSummary, financialSummary, studentChallansLedger, currentEnrolledCourses, academicCalendar } = dashboard;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1d33" />

      {/* Top University Branding Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {student.fullName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <View style={styles.badgeRow}>
              <View style={styles.rollBadge}>
                <Text style={styles.rollBadgeText}>{student.rollNumber}</Text>
              </View>
              <View style={styles.statusLiveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Fall 2026 Active</Text>
              </View>
            </View>
            <Text style={styles.studentName} numberOfLines={1}>
              {student.fullName}
            </Text>
            <Text style={styles.studentProgram} numberOfLines={1}>
              {student.programName}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0f2b48']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================================================================
            1. TOP 4 SUMMARY CARDS (LGU Portal 4-Grid)
            ========================================================================= */}
        <View style={styles.summaryGrid}>
          {/* Card 1: Enrolled Semester */}
          <View style={[styles.summaryCard, styles.cardSemester]}>
            <Text style={styles.summaryLabel}>Enrolled Semester</Text>
            <Text style={styles.summaryValuePrimary}>{academicSummary.enrolledSemester}</Text>
            <Text style={styles.summarySubtext}>Session 2026-2027</Text>
          </View>

          {/* Card 2: Outstanding Dues (Alert highlighted) */}
          <View style={[styles.summaryCard, styles.cardDues]}>
            <View style={styles.duesHeaderRow}>
              <Text style={styles.summaryLabel}>Outstanding Dues</Text>
              {financialSummary.hasPendingDues && (
                <View style={styles.dueAlertBadge}>
                  <Text style={styles.dueAlertText}>Due</Text>
                </View>
              )}
            </View>
            <Text style={styles.duesValue}>{financialSummary.formattedOutstandingDues}</Text>
            <Text style={styles.duesSubtext}>
              {financialSummary.hasPendingDues ? 'Voucher Generated' : 'All Dues Cleared'}
            </Text>
          </View>

          {/* Card 3: CGPA Badge */}
          <View style={[styles.summaryCard, styles.cardCgpa]}>
            <Text style={styles.summaryLabel}>Cumulative CGPA</Text>
            <View style={styles.cgpaRow}>
              <Text style={styles.cgpaValue}>{academicSummary.cumulativeCgpa.toFixed(2)}</Text>
              <Text style={styles.cgpaMax}> / 4.00</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(academicSummary.cumulativeCgpa / 4) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Card 4: Class Section */}
          <View style={[styles.summaryCard, styles.cardSection]}>
            <Text style={styles.summaryLabel}>Class Section</Text>
            <Text style={styles.sectionValue}>{academicSummary.classSection}</Text>
            <Text style={styles.summarySubtext}>Morning Shift • Block B</Text>
          </View>
        </View>

        {/* =========================================================================
            2. SEGMENTED NAVIGATION TABS
            ========================================================================= */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'COURSES' && styles.tabButtonActive]}
            onPress={() => setActiveTab('COURSES')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'COURSES' && styles.tabTextActive]}>
              Courses ({currentEnrolledCourses.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'CHALLANS' && styles.tabButtonActive]}
            onPress={() => setActiveTab('CHALLANS')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'CHALLANS' && styles.tabTextActive]}>
              Fee Challans
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'CALENDAR' && styles.tabButtonActive]}
            onPress={() => setActiveTab('CALENDAR')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'CALENDAR' && styles.tabTextActive]}>
              Calendar
            </Text>
          </TouchableOpacity>
        </View>

        {/* =========================================================================
            TAB 1: ENROLLED COURSES & ATTENDANCE PROGRESS
            ========================================================================= */}
        {activeTab === 'COURSES' && (
          <View style={styles.tabContent}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Enrolled Courses & Attendance</Text>
              <Text style={styles.sectionSubtitle}>Minimum 75% required for exams</Text>
            </View>

            {currentEnrolledCourses.map((course, idx) => {
              const isShort = course.attendancePercentage < 75;
              const barColor = isShort ? '#ef4444' : course.attendancePercentage < 82 ? '#f59e0b' : '#10b981';

              return (
                <View key={idx} style={styles.courseCard}>
                  <View style={styles.courseHeader}>
                    <View style={styles.courseCodeBadge}>
                      <Text style={styles.courseCodeText}>{course.courseCode}</Text>
                    </View>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{course.type}</Text>
                    </View>
                    <View style={styles.creditBadge}>
                      <Text style={styles.creditBadgeText}>{course.creditHours} CH</Text>
                    </View>
                  </View>

                  <Text style={styles.courseTitle}>{course.courseName}</Text>
                  <Text style={styles.courseInstructor}>👨‍🏫 {course.teacherName}</Text>

                  {/* Attendance Stats & Progress Bar */}
                  <View style={styles.attendanceBlock}>
                    <View style={styles.attendanceMetaRow}>
                      <Text style={styles.attendanceCountText}>
                        Present: <Text style={styles.textBold}>{course.presentClasses}</Text> / {course.totalClasses} classes
                      </Text>
                      <View style={[styles.percentageBadge, { backgroundColor: isShort ? '#fee2e2' : '#ecfdf5' }]}>
                        <Text style={[styles.percentageText, { color: isShort ? '#b91c1c' : '#047857' }]}>
                          {course.attendancePercentage}%
                        </Text>
                      </View>
                    </View>

                    <View style={styles.attendanceProgressBarTrack}>
                      <View
                        style={[
                          styles.attendanceProgressBarFill,
                          { width: `${course.attendancePercentage}%`, backgroundColor: barColor },
                        ]}
                      />
                    </View>

                    {isShort && (
                      <View style={styles.shortWarningRow}>
                        <Text style={styles.shortWarningText}>⚠️ Critical: Attendance is below 75% examination threshold.</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* =========================================================================
            TAB 2: FEE CHALLANS LEDGER TABLE / LIST
            ========================================================================= */}
        {activeTab === 'CHALLANS' && (
          <View style={styles.tabContent}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Fee Challans Ledger</Text>
              <Text style={styles.sectionSubtitle}>1Bill / HBL Konnect / Campus Counters</Text>
            </View>

            {studentChallansLedger.map((challan) => {
              const isPaid = challan.status === 'Paid';
              const isOverdue = challan.status === 'Overdue';
              const isExpanded = selectedChallan === challan.id;

              return (
                <View key={challan.id} style={styles.challanCard}>
                  <View style={styles.challanHeader}>
                    <View>
                      <Text style={styles.challanNumberText}>{challan.challanNumber}</Text>
                      <Text style={styles.challanSessionText}>{challan.semesterSession}</Text>
                    </View>
                    <View
                      style={[
                        styles.challanStatusBadge,
                        isPaid ? styles.statusPaid : isOverdue ? styles.statusOverdue : styles.statusValid,
                      ]}
                    >
                      <Text
                        style={[
                          styles.challanStatusText,
                          isPaid ? styles.textPaid : isOverdue ? styles.textOverdue : styles.textValid,
                        ]}
                      >
                        {challan.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.challanBody}>
                    <View style={styles.challanDetailRow}>
                      <Text style={styles.detailLabel}>Challan Type:</Text>
                      <Text style={styles.detailValueBold}>{challan.challanType}</Text>
                    </View>

                    <View style={styles.challanDetailRow}>
                      <Text style={styles.detailLabel}>Total Amount:</Text>
                      <Text style={styles.amountValue}>Rs. {challan.amount.toLocaleString('en-PK')}</Text>
                    </View>

                    <View style={styles.challanDetailRow}>
                      <Text style={styles.detailLabel}>Due Date:</Text>
                      <Text style={[styles.detailValue, isOverdue && styles.textRed]}>{challan.dueDate}</Text>
                    </View>

                    {isPaid && challan.paidDate && (
                      <View style={styles.challanDetailRow}>
                        <Text style={styles.detailLabel}>Paid On:</Text>
                        <Text style={styles.detailValueGreen}>{challan.paidDate} ({challan.bankReference})</Text>
                      </View>
                    )}
                  </View>

                  {/* Expandable Breakdown Accordion */}
                  {isExpanded && challan.breakdown && (
                    <View style={styles.breakdownBox}>
                      <Text style={styles.breakdownTitle}>Voucher Fee Breakdown:</Text>
                      {Object.entries(challan.breakdown).map(([k, v]) => (
                        <View key={k} style={styles.breakdownItemRow}>
                          <Text style={styles.breakdownKeyText}>
                            {k.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                          </Text>
                          <Text style={styles.breakdownValText}>Rs. {Number(v).toLocaleString('en-PK')}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.challanActionRow}>
                    <TouchableOpacity
                      style={styles.breakdownToggleBtn}
                      onPress={() => setSelectedChallan(isExpanded ? null : challan.id)}
                    >
                      <Text style={styles.breakdownToggleText}>
                        {isExpanded ? 'Hide Breakdown ▲' : 'View Breakdown ▼'}
                      </Text>
                    </TouchableOpacity>

                    {!isPaid && (
                      <TouchableOpacity
                        style={styles.payBtn}
                        onPress={() => alert(`Opening 1Bill Online Gateway for Challan ${challan.challanNumber}`)}
                      >
                        <Text style={styles.payBtnText}>Pay Online</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* =========================================================================
            TAB 3: ACADEMIC CALENDAR & DATES
            ========================================================================= */}
        {activeTab === 'CALENDAR' && (
          <View style={styles.tabContent}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Academic Calendar & Milestones</Text>
              <Text style={styles.sectionSubtitle}>Fall 2026 – Spring 2027 Schedule</Text>
            </View>

            {academicCalendar.map((item) => (
              <View key={item.id} style={styles.calendarCard}>
                <View style={styles.calendarDateBox}>
                  <Text style={styles.calendarDayText}>{item.date.split('-')[2]}</Text>
                  <Text style={styles.calendarMonthText}>
                    {new Date(item.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.calendarInfo}>
                  <View style={styles.calendarHeaderRow}>
                    <Text style={styles.calendarItemTitle}>{item.title}</Text>
                    <View style={styles.daysLeftChip}>
                      <Text style={styles.daysLeftText}>{item.daysLeft}d left</Text>
                    </View>
                  </View>
                  <Text style={styles.calendarDesc}>{item.description}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                </View>
              </View>
            ))}
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
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    marginRight: 14,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  studentInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  rollBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rollBadgeText: {
    color: '#93c5fd',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34d399',
  },
  liveText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '600',
  },
  studentName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  studentProgram: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    width: (width - 44) / 2,
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSemester: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  cardDues: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  cardCgpa: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  cardSection: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryValuePrimary: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 6,
  },
  summarySubtext: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  duesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueAlertBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dueAlertText: {
    color: '#dc2626',
    fontSize: 10,
    fontWeight: '700',
  },
  duesValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#b91c1c',
    marginTop: 6,
  },
  duesSubtext: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 4,
  },
  cgpaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  cgpaValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#047857',
  },
  cgpaMax: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  sectionValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#d97706',
    marginTop: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#0f2b48',
    fontWeight: '700',
  },
  tabContent: {
    gap: 14,
  },
  sectionTitleRow: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  courseCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  courseCodeBadge: {
    backgroundColor: '#0f2b48',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  courseCodeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  typeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  typeBadgeText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '600',
  },
  creditBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  creditBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  attendanceBlock: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  attendanceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attendanceCountText: {
    fontSize: 12,
    color: '#475569',
  },
  textBold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '700',
  },
  attendanceProgressBarTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  attendanceProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  shortWarningRow: {
    marginTop: 8,
    backgroundColor: '#fef2f2',
    padding: 6,
    borderRadius: 6,
  },
  shortWarningText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '600',
  },
  challanCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  challanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
    marginBottom: 10,
  },
  challanNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  challanSessionText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  challanStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPaid: {
    backgroundColor: '#dcfce7',
  },
  statusValid: {
    backgroundColor: '#fef3c7',
  },
  statusOverdue: {
    backgroundColor: '#fee2e2',
  },
  challanStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textPaid: {
    color: '#15803d',
  },
  textValid: {
    color: '#b45309',
  },
  textOverdue: {
    color: '#b91c1c',
  },
  challanBody: {
    gap: 6,
  },
  challanDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  detailValueBold: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  detailValue: {
    fontSize: 12,
    color: '#334155',
  },
  detailValueGreen: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  textRed: {
    color: '#dc2626',
    fontWeight: '700',
  },
  breakdownBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  breakdownItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  breakdownKeyText: {
    fontSize: 11,
    color: '#64748b',
  },
  breakdownValText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0f172a',
  },
  challanActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  breakdownToggleBtn: {
    paddingVertical: 4,
  },
  breakdownToggleText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
  },
  payBtn: {
    backgroundColor: '#0f2b48',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  payBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  calendarDateBox: {
    width: 50,
    height: 52,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  calendarDayText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  calendarMonthText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3b82f6',
  },
  calendarInfo: {
    flex: 1,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  daysLeftChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  daysLeftText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  calendarDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 15,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
  },
});
