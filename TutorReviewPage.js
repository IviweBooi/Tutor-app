import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TutorReviewPage = ({ navigation }) => {
  const [studentPin, setStudentPin] = useState('');
  const [tutorPin, setTutorPin] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = () => {
    if (studentPin && tutorPin && review && rating) {
      Alert.alert('Review submitted successfully!');
      navigation.navigate('TutorHomePage');
    } else {
      Alert.alert('Please fill in all fields and provide a rating.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Review</Text>

      <View style={styles.ratingContainer}>
        <Text style={styles.label}>Rate the Student:</Text>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRating(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={28}
              color={star <= rating ? '#ffd700' : '#ccc'}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Student's Pin Code"
        value={studentPin}
        onChangeText={setStudentPin}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Your Pin Code"
        value={tutorPin}
        onChangeText={setTutorPin}
      />
      <TextInput
        style={styles.input}
        placeholder="Write your review here"
        value={review}
        onChangeText={setReview}
        multiline
      />

      <Button title="Submit Review" onPress={handleSubmitReview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginRight: 10,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default TutorReviewPage;
