import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export default StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: Colors.background || '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: Colors.primaryLight || '#D1FAE5',
    borderRadius: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text || '#0F172A',
    fontFamily: 'Inter',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted || '#64748B',
    fontFamily: 'Inter',
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 24,
    gap: 16, // Adds perfect spacing between inputs if AppInput doesn't have margins
  },
  linkContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  link: {
    color: Colors.muted || '#64748B',
    fontSize: 15,
    fontFamily: 'Inter',
  },
  linkBold: {
    color: Colors.primary || '#10B981',
    fontWeight: '700',
    fontFamily: 'Inter',
  },
});