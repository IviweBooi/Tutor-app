import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, SafeAreaView, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker'; 
import { useNavigation, useRoute } from "@react-navigation/native";
import CheckBox from 'expo-checkbox'; 
import { FontSize, Border } from './GlobalStyles'; 
import { db } from './firebase'; 
import { collection, addDoc } from 'firebase/firestore'; 

const TutorSignUpPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || ''; 

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);

  const facultyCourses = {
    Commerce: ['MAM1000W', 'MAM1006S', 'ACC1006F', 'ECO1011F', 'BUS1023S'],
    Science: ['PHY1000W', 'CSC1015F', 'CSC1016S', 'STA1006S', 'STA1000S/F'],
  };

  useEffect(() => {
    const isFormComplete = name && lastName && faculty && yearOfStudy && acceptTerms && Object.values(selectedCourses).includes(true);
    setIsContinueDisabled(!isFormComplete);
  }, [name, lastName, faculty, yearOfStudy, selectedCourses, acceptTerms]);

  const handleFacultyChange = (selectedFaculty) => {
    setFaculty(selectedFaculty);
    setCourses(facultyCourses[selectedFaculty] || []);
    setSelectedCourses({});
  };

  const handleCheckboxChange = (course) => {
    setSelectedCourses(prevState => ({
      ...prevState,
      [course]: !prevState[course],
    }));
  };

  const handleNext = async () => {
    const selectedCoursesList = Object.keys(selectedCourses).filter(course => selectedCourses[course]);

    if (selectedCoursesList.length === 0) {
      Alert.alert('Error', 'Please select at least one course.');
      return;
    }

    try {
      await addDoc(collection(db, 'tutors'), {
        email,
        name,
        lastName,
        faculty,
        yearOfStudy,
        courses: selectedCoursesList,
      });
      navigation.navigate("HomePage");
      Alert.alert('Success', 'Tutor information saved successfully!');
    } catch (error) {
      console.error('Error saving tutor information: ', error);
      Alert.alert('Error', 'Failed to save your information.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Tutor Sign-Up</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Faculty</Text>
          <Picker
            selectedValue={faculty}
            style={styles.picker}
            onValueChange={handleFacultyChange}
          >
            <Picker.Item label="Select Faculty..." value="" />
            <Picker.Item label="Science" value="Science" />
            <Picker.Item label="Commerce" value="Commerce" />
          </Picker>

          <Text style={styles.label}>Academic Year of Study</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your year of study"
            value={yearOfStudy}
            onChangeText={setYearOfStudy}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Courses</Text>
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <TouchableOpacity key={index} onPress={() => handleCheckboxChange(course)} style={styles.courseItem}>
                <CheckBox
                  value={selectedCourses[course]} 
                  onValueChange={() => handleCheckboxChange(course)} 
                  color={selectedCourses[course] ? "blue" : undefined}
                />
                <Text style={styles.courseText}>{course}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noCoursesText}>Select a faculty to see available courses</Text>
          )}

          <View style={styles.termsContainer}>
            <CheckBox
              value={acceptTerms}
              onValueChange={setAcceptTerms}
            />
            <Text style={styles.termsText}>
              I accept the terms and conditions (POPIA compliance)
            </Text>
          </View>

          <Pressable
            style={[styles.nextButton, isContinueDisabled && styles.disabledButton]}
            onPress={handleNext}
            disabled={isContinueDisabled}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  container: { paddingHorizontal: 16, alignItems: 'center' },
  title: { fontSize: FontSize.size_6xl, color: '#1029AF', fontWeight: '600', marginBottom: 20 },
  label: { fontSize: FontSize.size_md, color: '#10294F', marginBottom: 10, alignSelf: 'flex-start', fontWeight: 'bold' },
  input: { backgroundColor: '#F0F0F0', borderRadius: Border.br_3xs, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#000000', width: '100%', marginBottom: 20, borderColor: '#CCCCCC', borderWidth: 1 },
  picker: { color: '#0066B0', width: '100%', marginBottom: 20, backgroundColor: '#F0F0F0', borderRadius: 10 },
  courseItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#CCCCCC' },
  courseText: { fontSize: 16, marginLeft: 10 },
  noCoursesText: { color: '#A0A0A0', marginBottom: 20 },
  termsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  termsText: { marginLeft: 10, fontSize: 14 },
  nextButton: { backgroundColor: '#FF6600', borderRadius: Border.br_3xs, paddingVertical: 15, width: '100%', alignItems: 'center', marginTop: 20 },
  disabledButton: { backgroundColor: '#CCCCCC' },
  nextButtonText: { fontSize: 18, color: '#FFFFFF' },
});

export default TutorSignUpPage;
