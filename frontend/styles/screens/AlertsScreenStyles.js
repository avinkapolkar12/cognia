import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Consistent crisp background
  },
  content: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'Inter',
    marginTop: 12,
    marginBottom: 6,
  },
  stateText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginTop: 10,
  },
  
  // Card Layout
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  // Icon Styles
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCriticalBg: {
    backgroundColor: '#FEF2F2', // Soft Red
  },
  iconModerateBg: {
    backgroundColor: '#FFFBEB', // Soft Amber
  },

  // Text Container
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: 'Inter',
    marginLeft: 4,
  },

  // Badges
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeCritical: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  badgeModerate: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  badgeTextCritical: {
    color: '#EF4444',
  },
  badgeTextModerate: {
    color: '#D97706',
  },
});