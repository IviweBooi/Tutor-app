import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewPage = ({navigation}) => {
  const [tutorPin, setTutorPin] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [review, setReview] = useState('');

  const handleSubmitReview = () => {
    if (tutorPin && studentPin && review) {
      navigation.navigate('HomePage');
      Alert.alert('Success', 'Review submitted successfully!');
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Session Review</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Tutor's Pin Code"
            placeholderTextColor="#aaa"
            value={tutorPin}
            onChangeText={setTutorPin}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Pin Code"
            placeholderTextColor="#aaa"
            value={studentPin}
            onChangeText={setStudentPin}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <Ionicons name="chatbox-outline" size={24} color="#888" style={styles.icon} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your review here"
            placeholderTextColor="#aaa"
            value={review}
            onChangeText={setReview}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ReviewPage;
