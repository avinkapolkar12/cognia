import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background || '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100, 
    flexGrow: 1, // ✅ Ensures the empty state can center itself properly
  },

  // ✅ Empty State Styles
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'Inter',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontFamily: 'Inter',
    paddingHorizontal: 30,
    lineHeight: 20,
  },

  // Routine Card (Updated for Timeline Look)
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
  timeBlock: {
    width: 85, // ✅ Fixed width for alignment
    borderRightWidth: 1,
    borderColor: '#E2E8F0', // ✅ Sleek vertical divider
    marginRight: 16,
    paddingRight: 8,
    justifyContent: 'center',
  },
  timeText: {
    color: '#0F172A', // ✅ Dark, crisp text
    fontWeight: '800',
    fontSize: 14,
    fontFamily: 'Inter',
  },
  infoBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 4,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  routineDesc: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: 'Inter',
  },

  // Floating Action Button
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 24, 
  },
  fab: {
    backgroundColor: Colors.primary || '#10B981',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary || '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', 
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: Colors.primary || '#10B981',
    marginLeft: 8,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
});