import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const TutorHomePage = () => {
  const navigation = useNavigation();

  const handleProfileClick = () => {
    navigation.navigate('TutorProfile');
  };

  const handleJobAccept = (jobId) => {
    navigation.navigate('TutorJobConfirmationPage');
    console.log(`Job ${jobId} accepted!`);
  };

  const handleJobDecline = (jobId) => {
    console.log(`Job ${jobId} declined!`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hello, Tutor!</Text>
          <Text style={styles.subtitle}>Your tutoring journey awaits.</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Live Lesson Jobs</Text>
          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>CSC3002F - Computer Networks</Text>
            <Text style={styles.jobDetails}>2 hours in person at Ishango</Text>
            <Text style={styles.jobDetails}>Tier 3 - R200</Text>
            <View style={styles.jobActions}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleJobAccept(1)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleJobDecline(1)}
              >
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>INF3012S - Business Processes</Text>
            <Text style={styles.jobDetails}>1.5 hours online via Teams</Text>
            <Text style={styles.jobDetails}>Tier 2 - R150</Text>
            <View style={styles.jobActions}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleJobAccept(2)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleJobDecline(2)}
              >
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Tutor Tier</Text>
          <View style={styles.tierContainer}>
            <Text style={styles.tierText}>Tier 3</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity>
          <Ionicons name="home" size={28} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubbles" size={28} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => console.log('Add Lesson')}
        >
          <Ionicons name="add" size={36} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="calendar" size={28} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfileClick}>
          <Ionicons name="person" size={28} color="#3179ff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FF',
  },
  contentContainer: {
    paddingBottom: 80,
  },
  welcomeContainer: {
    backgroundColor: '#4A90E2',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333333',
  },
  jobCard: {
    backgroundColor: '#E8F1FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#4A90E2',
  },
  jobDetails: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 10,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  declineButton: {
    backgroundColor: '#FF7F50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  tierContainer: {
    alignItems: 'center',
    padding: 15,
  },
  tierText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 20 : 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  addButtonContainer: {
    backgroundColor: '#4A90E2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30, // To elevate the button above the footer
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default TutorHomePage;
