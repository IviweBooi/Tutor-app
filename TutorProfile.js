import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TutorProfile = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isAway, setIsAway] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const handleStatusChange = (status) => {
    setIsAvailable(status === 'available');
    setIsBusy(status === 'busy');
    setIsAway(status === 'away');
    setIsOffline(status === 'offline');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-outline" size={100} color="#4A90E2" />
        <Text style={styles.tutorName}>Mnelisi Mabuza</Text>
        <Text style={styles.tutorTier}>3rd Tier Tutor</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Set Your Status</Text>
        <TouchableOpacity
          style={[
            styles.statusButton,
            isAvailable && styles.activeStatusButton,
          ]}
          onPress={() => handleStatusChange('available')}
        >
          <Text style={styles.statusText}>Available</Text>
          <Switch
            value={isAvailable}
            onValueChange={() => handleStatusChange('available')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusButton, isBusy && styles.activeStatusButton]}
          onPress={() => handleStatusChange('busy')}
        >
          <Text style={styles.statusText}>Busy</Text>
          <Switch
            value={isBusy}
            onValueChange={() => handleStatusChange('busy')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusButton, isAway && styles.activeStatusButton]}
          onPress={() => handleStatusChange('away')}
        >
          <Text style={styles.statusText}>Away</Text>
          <Switch
            value={isAway}
            onValueChange={() => handleStatusChange('away')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusButton, isOffline && styles.activeStatusButton]}
          onPress={() => handleStatusChange('offline')}
        >
          <Text style={styles.statusText}>Offline</Text>
          <Switch
            value={isOffline}
            onValueChange={() => handleStatusChange('offline')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  tutorName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  tutorTier: {
    fontSize: 18,
    color: '#4A90E2',
    marginTop: 5,
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333333',
  },
  statusButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#E8F1FF',
    borderRadius: 10,
    marginBottom: 10,
  },
  activeStatusButton: {
    backgroundColor: '#4A90E2',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default TutorProfile;
