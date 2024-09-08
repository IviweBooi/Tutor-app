import React from 'react';
import { View, Text, Image, StyleSheet, Button, Alert } from 'react-native';

const TutorJobConfirmationPage = ({ navigation }) => {
  const handlePaymentNotification = () => {
    Alert.alert("Payment Received", "Your wallet has been credited with +R200.");
  };

  const handleNavigate = () => {
    handlePaymentNotification();
    navigation.navigate('TutorReviewPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Accepted!</Text>
      <Image source={require('./assets/mnelisi.png')} style={styles.studentImage} />
      <Text style={styles.studentName}>John Doe</Text>
      <Text style={styles.courseName}>CSC3002F: Computer Networks & OS</Text>
      <Text style={styles.contactText}>Contact: +27 073 456 7890</Text>
      <Text style={styles.venueText}>Preferred Venue: Ishango, CS Building</Text>

      <Button title="Proceed to Session" onPress={handleNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  studentImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  courseName: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 10,
  },
  venueText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
});

export default TutorJobConfirmationPage;
