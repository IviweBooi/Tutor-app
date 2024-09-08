import React, { useState } from "react";
import { View, Text, Pressable, TextInput, SafeAreaView, ScrollView, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker'; 
import { useNavigation, useRoute } from "@react-navigation/native";
import { RadioButton } from 'react-native-paper';
import { FontSize, Border } from './GlobalStyles'; 
import { db } from './firebase'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

const InformationPage = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Get the route to access params
  const email = route.params?.email || ''; // Get the email from the previous page

  const [studyLevel, setStudyLevel] = useState('undergraduate'); // Default to undergraduate
  const [faculty, setFaculty] = useState('science'); // Default to Science
  const [major, setMajor] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [courses, setCourses] = useState('');

  const handleNext = async () => {
    if (!major || !yearOfStudy || !courses) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    try {
      // Add the student data to Firestore
      await addDoc(collection(db, 'students'), {
        email: email, // Include the email from the previous page
        studyLevel: studyLevel,
        faculty: faculty,
        major: major,
        yearOfStudy: yearOfStudy,
        courses: courses.split(',').map(course => course.trim()), // Convert the courses to an array
      });

      // Navigate to HomePage after successful submission
      navigation.navigate("HomePage");
      Alert.alert('Success', 'Information saved successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Failed to save your information.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Tell Us About Yourself</Text>
          
          <Text style={styles.label}>Are you an undergraduate or postgraduate student?</Text>
          <View style={styles.radioContainer}>
            <RadioButton
              value="undergraduate"
              status={studyLevel === 'undergraduate' ? 'checked' : 'unchecked'}
              onPress={() => setStudyLevel('undergraduate')}
              color="#FF6600"
            />
            <Text style={styles.radioText}>Undergraduate</Text>

            <RadioButton
              value="postgraduate"
              status={studyLevel === 'postgraduate' ? 'checked' : 'unchecked'}
              onPress={() => setStudyLevel('postgraduate')}
              color="#FF6600"
            />
            <Text style={styles.radioText}>Postgraduate</Text>
          </View>

          <Text style={styles.label}>Select Your Faculty</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={faculty}
              style={{ color: '#FFFFFF'}}
              onValueChange={(itemValue) => setFaculty(itemValue)}
            >
              <Picker.Item label="Science" value="science" />
              <Picker.Item label="Commerce" value="commerce" />
            </Picker>
          </View>

          <Text style={styles.label}>What is your Major or Degree?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Computer Science"
            placeholderTextColor="#A0A0A0"
            value={major}
            onChangeText={(text) => setMajor(text)}
          />

          <Text style={styles.label}>Year of Study</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 3"
            placeholderTextColor="#A0A0A0"
            keyboardType="numeric"
            value={yearOfStudy}
            onChangeText={(text) => setYearOfStudy(text)}
          />

          <Text style={styles.label}>List the courses you are currently doing</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="e.g., CSC301, MATH302, STAT201"
            placeholderTextColor="#A0A0A0"
            value={courses}
            onChangeText={(text) => setCourses(text)}
            multiline
          />

          <Pressable
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0044CC',
      },
      scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
      },
      container: {
        paddingHorizontal: 16,
        alignItems: 'center',
      },
      title: {
        fontSize: FontSize.size_6xl,
        color: '#FFFFFF',
        fontWeight: '600',
        marginBottom: 20,
      },
      label: {
        fontSize: FontSize.size_md,
        color: '#FFFFFF',
        marginBottom: 10,
        alignSelf: 'flex-start',
      },
      input: {
        backgroundColor: '#333333',
        borderRadius: Border.br_3xs,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#FFFFFF',
        width: '100%',
        marginBottom: 20,
        borderColor: '#555555',
        borderWidth: 1,
      },
      radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      radioText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginRight: 15,
      },
      pickerContainer: {
        backgroundColor: '#333333',
        borderRadius: Border.br_3xs,
        marginBottom: 20,
        borderColor: '#555555',
        borderWidth: 1,
        width: '100%',
      },
      picker: {
        height: 50,
        color: '#FFFFFF',
      },
      nextButton: {
        backgroundColor: '#FF6600',
        borderRadius: Border.br_3xs,
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
      },
      nextButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
      },
});

export default InformationPage;
