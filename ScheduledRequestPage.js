import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
//import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const ScheduledRequestPage = ({ navigation }) => {
  const [course, setCourse] = useState('');
  const [duration, setDuration] = useState('');
  const [tier, setTier] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [price, setPrice] = useState(0);

  const calculatePrice = () => {
    let basePrice = 0;

    switch (tier) {
      case '2nd Tier':
        basePrice = 200; // R200 for 2nd Tier
        break;
      case '3rd Tier':
        basePrice = 300; // R300 for 3rd Tier
        break;
      default:
        basePrice = 100; // R100 for others
    }

    setPrice(basePrice * duration);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleConfirmRequest = () => {
    Alert.alert(
      'Request Confirmed!',
      'Your scheduled session is booked. Keep an eye on notifications a tutor will be in contact with you soon.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('HomePage'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Schedule Tutoring Request</Text>

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

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>Select Date: {formatDate(date)}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)}
          onChange={onDateChange}
        />
      )}

      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>Select Time: {formatTime(time)}</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      <TouchableOpacity style={styles.calculateButton} onPress={calculatePrice}>
        <Text style={styles.buttonText}>Calculate Price</Text>
      </TouchableOpacity>

      <Text style={styles.price}>Price: R{price}</Text>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmRequest}
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
  dateButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 18,
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

export default ScheduledRequestPage;
