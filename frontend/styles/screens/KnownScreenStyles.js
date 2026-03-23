import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', 
  },
  content: {
    padding: 20,
    paddingBottom: 100, 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    fontFamily: 'Inter',
  },

  // Card Styles
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2, 
  },
  
  // Avatar Styles
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 16,
    backgroundColor: '#E2E8F0',
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 16,
    backgroundColor: Colors.primary || '#3B82F6', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  // Text Info
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: '700',
    color: '#1E293B',
    fontSize: 17,
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  relation: {
    color: Colors.primary || '#3B82F6',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter',
  },

  // Time Styles
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  lastSeen: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },

  // Floating Action Button
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: '85%',
  },
  fab: {
    flexDirection: 'row',
    backgroundColor: Colors.primary || '#0F172A', 
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary || '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: 'Inter',
  },
  deleteButton: {
    padding: 8,
  },

  // ✅ New Empty State Upload Box
  emptyImageUpload: {
    height: 140,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },
  emptyImageUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginTop: 8,
    fontFamily: 'Inter',
  },
  emptyImageUploadSubText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    fontFamily: 'Inter',
  },

  imageScrollContainer: {
    marginBottom: 20,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginRight: 16,
    paddingTop: 8, // space for the delete badge
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 0,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // ✅ Compact "Add More" Button
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginTop: 8, // aligns with the images pushed down by the delete badge
  },
  addImageBtnText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    fontFamily: 'Inter',
    marginTop: 4,
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
    backgroundColor: Colors.primary || '#0F172A', 
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: Colors.primary || '#0F172A',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
});