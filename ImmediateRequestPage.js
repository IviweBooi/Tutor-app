import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const ImmediateRequestPage = ({ navigation }) => {
  const [course, setCourse] = useState('');
  const [duration, setDuration] = useState('');
  const [tier, setTier] = useState('');
  const [price, setPrice] = useState(0);
  const [balance, setBalance] = useState(1000);

  const calculatePrice = () => {
    let basePrice = 0;

    switch (tier) {
      case '2nd Tier':
        basePrice = 200;
        break;
      case '3rd Tier':
        basePrice = 300;
        break;
      default:
        basePrice = 100;
    }

    const totalPrice = basePrice * duration;
    setPrice(totalPrice);
  };

  const confirmRequest = () => {
    if (balance >= price) {
      setBalance(balance - price);
      Alert.alert('Request Confirmed', `R${price} has been deducted from your wallet.`);
      navigation.navigate('SearchingScreen');
    } else {
      Alert.alert('Insufficient Funds', 'Please select a lower-tier tutor or refill your funds.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Immediate Tutoring Request</Text>

      <Picker
        selectedValue={course}
        style={styles.picker}
        onValueChange={(itemValue) => setCourse(itemValue)}
      >
        <Picker.Item label="Select Your Course" value="" />
        <Picker.Item label="CSC3002F" value="CSC3002F" />
        <Picker.Item label="CSC3003S" value="CSC3003S" />
        <Picker.Item label="INF3014F" value="INF3014F" />
        <Picker.Item label="INF3011F" value="INF3011F" />
        <Picker.Item label="CSC2001F" value="CSC2001F" />
      </Picker>

      <Picker
        selectedValue={duration}
        style={styles.picker}
        onValueChange={(itemValue) => setDuration(parseFloat(itemValue))}
      >
        <Picker.Item label="Select Duration (in hours)" value="" />
        <Picker.Item label="0.5 hr" value="0.5" />
        <Picker.Item label="1 hr" value="1" />
        <Picker.Item label="1.5 hr" value="1.5" />
        <Picker.Item label="2 hr" value="2" />
        <Picker.Item label="2.5 hr" value="2.5" />
        <Picker.Item label="3 hr" value="3" />
        <Picker.Item label="3.5 hr" value="3.5" />
        <Picker.Item label="4 hr" value="4" />
        <Picker.Item label="4.5 hr" value="4.5" />
        <Picker.Item label="5 hr" value="5" />
      </Picker>

      <Picker
        selectedValue={tier}
        style={styles.picker}
        onValueChange={(itemValue) => setTier(itemValue)}
      >
        <Picker.Item label="Select Tutor Tier" value="" />
        <Picker.Item label="2nd Tier" value="2nd Tier" />
        <Picker.Item label="3rd Tier" value="3rd Tier" />
      </Picker>

      <TouchableOpacity style={styles.calculateButton} onPress={calculatePrice}>
        <Text style={styles.buttonText}>Calculate Price</Text>
      </TouchableOpacity>

      <Text style={styles.price}>Price: R{price}</Text>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={confirmRequest}
      >
        <Text style={styles.buttonText}>Confirm Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 40,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  calculateButton: {
    backgroundColor: '#ff7043',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#42a5f5',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  price: {
    fontSize: 20,
    marginVertical: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ImmediateRequestPage;
