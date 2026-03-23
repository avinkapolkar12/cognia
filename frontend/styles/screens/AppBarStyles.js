import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',          // ✅ Aligns items horizontally
    justifyContent: 'space-between', // ✅ Pushes text left, icon right
    alignItems: 'center',          // ✅ Centers them vertically
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF', 
  },
  textContainer: {
    flex: 1, // Ensures the text takes up available space
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  iconBtn: {
    padding: 8, // Makes it easier to tap
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});