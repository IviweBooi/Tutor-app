import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RequestOptionsPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request a Tutor</Text>

      <TouchableOpacity
        style={[styles.button, styles.immediateButton]}
        onPress={() => navigation.navigate('ImmediateRequestPage')}
      >
        <Text style={styles.buttonText}>Immediate Request</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.scheduledButton]}
        onPress={() => navigation.navigate('ScheduledRequestPage')}
      >
        <Text style={styles.buttonText}>Scheduled Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  immediateButton: {
    backgroundColor: '#ff7043',
  },
  scheduledButton: {
    backgroundColor: '#42a5f5',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});

export default RequestOptionsPage;
