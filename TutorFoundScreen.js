import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TutorFoundScreen = ({ navigation }) => {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft === 0) {
      Alert.alert("Time's up!", "Please head to the venue immediately.");
    } else {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 60000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleCallTutor = () => {
    Alert.alert("Calling Tutor", "+27 069 386 3267");
  };

  const handleTeamsSession = () => {
    Alert.alert("Teams Session", "Starting a Teams session...");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor Found!</Text>
      <Image source={require('./assets/mnelisi.png')} style={styles.tutorImage} />
      <Text style={styles.tutorName}>Mnelisi Mabuza</Text>
      <Text style={styles.courseName}>CSC3002F: Computer Networks & OS</Text>
      <View style={styles.sessionDetails}>
        <Text style={styles.sessionText}>Session Details: 2 hours, In-person/Teams</Text>
        <TouchableOpacity onPress={handleTeamsSession}>
          <Ionicons name="videocam-outline" size={28} color="blue" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.venueText}>Preferred Venue: Ishango, CS Building</Text>
      <Text style={styles.timeAlert}>You have {timeLeft} minutes to get to the venue!</Text>

      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>Contact: +27 069 386 3267</Text>
        <TouchableOpacity onPress={handleCallTutor}>
          <Ionicons name="call-outline" size={28} color="green" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Button title="Confirm Arrival" onPress={() => navigation.navigate('ReviewPage')} />
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
  tutorImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  tutorName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  courseName: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sessionText: {
    fontSize: 16,
    marginRight: 10,
  },
  venueText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  timeAlert: {
    fontSize: 16,
    color: '#ff0000',
    marginBottom: 20,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactText: {
    fontSize: 16,
    marginRight: 10,
  },
  icon: {
    marginLeft: 10,
  },
});

export default TutorFoundScreen;
