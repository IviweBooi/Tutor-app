import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, SafeAreaView, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker'; 
import CheckBox from 'expo-checkbox'; 
import { useNavigation } from '@react-navigation/native'; 
import { db } from './firebase';
import { collection, addDoc, updateDoc } from 'firebase/firestore';

const TutorSignUpPage = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [cellphoneError, setCellphoneError] = useState('');
  const [level, setLevel] = useState(''); 
  const [studyYear, setStudyYear] = useState(''); 
  const [major, setMajor] = useState({ ComputerScience: false, InformationSystems: false });
  const [selectedCourses, setSelectedCourses] = useState({});
  const [courses, setCourses] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const coursesByYear = {
    ComputerScience: {
      '1st': ['CSC1015F', 'CSC1016S'],
      '2nd': ['CSC2001F', 'CSC2002S'],
      '3rd': ['CSC3002F', 'CSC3003S']
    },
    InformationSystems: {
      '1st': ['INF1002F', 'INF1003S'],
      '2nd': ['INF2004F', 'INF2006F'],
      '3rd': ['INF3003W', 'INF3014F', 'INF3012S']
    }
  };

  const handleLevelChange = (selectedLevel) => {
    setLevel(selectedLevel);
    setStudyYear('');
    setCourses([]);
    setSelectedCourses({});
  };

  const handleYearChange = (selectedYear) => {
    setStudyYear(selectedYear);
    updateCourses(selectedYear, major);
  };

  const handleMajorChange = (selectedMajor) => {
    setMajor(prevMajor => ({
      ...prevMajor,
      [selectedMajor]: !prevMajor[selectedMajor]
    }));
  };

  const updateCourses = (studyYear, major) => {
    let availableCourses = [];
    let yearToTutor = ''; 

    if (level === 'Undergraduate') {
      if (studyYear === '2nd') {
        yearToTutor = '1st';
      } else if (studyYear === '3rd') {
        yearToTutor = 'combined'; 
      }
    } else if (level === 'Postgraduate') {
      yearToTutor = 'all'; 
    }

    if (major.ComputerScience) {
      if (yearToTutor === 'combined') {
        availableCourses = availableCourses.concat(
          [...coursesByYear.ComputerScience['1st'], ...coursesByYear.ComputerScience['2nd']]
        );
      } else {
        availableCourses = availableCourses.concat(
          yearToTutor === 'all' 
            ? [...coursesByYear.ComputerScience['1st'], ...coursesByYear.ComputerScience['2nd'], ...coursesByYear.ComputerScience['3rd']] 
            : coursesByYear.ComputerScience[yearToTutor] || []
        );
      }
    }
    if (major.InformationSystems) {
      if (yearToTutor === 'combined') {
        availableCourses = availableCourses.concat(
          [...coursesByYear.InformationSystems['1st'], ...coursesByYear.InformationSystems['2nd']]
        );
      } else {
        availableCourses = availableCourses.concat(
          yearToTutor === 'all' 
            ? [...coursesByYear.InformationSystems['1st'], ...coursesByYear.InformationSystems['2nd'], ...coursesByYear.InformationSystems['3rd']]
            : coursesByYear.InformationSystems[yearToTutor] || []
        );
      }
    }
    
    setCourses(availableCourses);
    resetSelectedCourses(availableCourses);
  };

  const resetSelectedCourses = (availableCourses) => {
    const initialSelectedCourses = {};
    availableCourses.forEach(course => {
      initialSelectedCourses[course] = false;
    });
    setSelectedCourses(initialSelectedCourses);
  };

  const handleCheckboxChange = (course) => {
    const selectedCoursesList = Object.keys(selectedCourses).filter(key => selectedCourses[key]);
    if (selectedCoursesList.length < 2 || selectedCourses[course]) {
      setSelectedCourses(prevState => ({
        ...prevState,
        [course]: !prevState[course],
      }));
    } else {
      Alert.alert('Error', 'You can only select up to 2 courses.');
    }
  };

  const validateCellphone = (value) => {
    const cellphoneRegex = /^0[0-9]{9}$/;
    if (!cellphoneRegex.test(value)) {
      setCellphoneError('Cellphone number must start with 0 and be exactly 10 digits.');
    } else {
      setCellphoneError('');
    }
  };

  const handleNext = async () => {
    if (!name || !lastName || !cellphone || !level || (level === 'Undergraduate' && !studyYear) || !Object.values(major).includes(true)) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    const selectedCoursesList = Object.keys(selectedCourses).filter(course => selectedCourses[course]);
    if (selectedCoursesList.length === 0) {
      Alert.alert('Error', 'Please select at least one course.');
      return;
    }

    if (cellphoneError) {
      Alert.alert('Error', 'Please enter a valid cellphone number.');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'You must accept the terms and conditions.');
      return;
    }

    const tutorData = {
      firstName: name,
      lastName,
      cellphone,
      levelOfStudy: level,
      studyYear: level === 'Postgraduate' ? 'N/A' : studyYear,
      major: Object.keys(major).filter(key => major[key]),
      courses: selectedCoursesList,
      availability: 'available',
    };

    if (level === 'Postgraduate') {
      tutorData.tier = 3;
    }

    try {

      const docRef = await addDoc(collection(db, 'tutors'), tutorData);

      await updateDoc(docRef, { TutorID: docRef.id });

      Alert.alert('Success', 'Tutor information saved successfully');
      navigation.navigate('TutorHomePage', { tutorId: docRef.id });
    } catch (error) {
      Alert.alert('Error', `Failed to save tutor data: ${error.message}`);
    }
  };

  useEffect(() => {
    const hasValidInput = name && lastName && cellphone && level && (level === 'Postgraduate' || studyYear) && Object.values(major).includes(true) && !cellphoneError && termsAccepted;
    const selectedCoursesList = Object.keys(selectedCourses).filter(course => selectedCourses[course]);
    setIsSubmitDisabled(!hasValidInput || selectedCoursesList.length === 0);
  }, [name, lastName, cellphone, level, studyYear, major, selectedCourses, cellphoneError, termsAccepted]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>First Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your first name"
            placeholderTextColor="#a9a9a9"
          />
          <Text style={styles.label}>Last Name:</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            placeholderTextColor="#a9a9a9"
          />
          <Text style={styles.label}>Cellphone:</Text>
          <TextInput
            style={styles.input}
            value={cellphone}
            onChangeText={value => {
              setCellphone(value);
              validateCellphone(value);
            }}
            keyboardType="numeric"
            placeholder="Enter your cellphone number"
            placeholderTextColor="#a9a9a9"
          />
          {cellphoneError ? <Text style={styles.error}>{cellphoneError}</Text> : null}
          <Text style={styles.label}>Level of Study:</Text>
          <Picker
            selectedValue={level}
            onValueChange={handleLevelChange}
            style={styles.picker}
          >
            <Picker.Item label="Select Level" value="" />
            <Picker.Item label="Undergraduate" value="Undergraduate" />
            <Picker.Item label="Postgraduate" value="Postgraduate" />
          </Picker>
          {level === 'Undergraduate' && (
            <>
              <Text style={styles.label}>Year of Study:</Text>
              <Picker
                selectedValue={studyYear}
                onValueChange={handleYearChange}
                style={styles.picker}
              >
                <Picker.Item label="Select Year" value="" />
                <Picker.Item label="1st Year" value="1st" />
                <Picker.Item label="2nd Year" value="2nd" />
                <Picker.Item label="3rd Year" value="3rd" />
              </Picker>
            </>
          )}
          <Text style={styles.label}>Major:</Text>
          <View style={styles.checkboxContainer}>
            {Object.keys(major).map(key => (
              <View key={key} style={styles.checkboxWrapper}>
                <CheckBox
                  value={major[key]}
                  onValueChange={() => handleMajorChange(key)}
                />
                <Text style={styles.checkboxText}>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
              </View>
            ))}
          </View>
          {courses.length > 0 && (
            <>
              <Text style={styles.label}>Courses:</Text>
              {courses.map(course => (
                <Pressable
                  key={course}
                  style={styles.courseContainer}
                  onPress={() => handleCheckboxChange(course)}
                >
                  <Text style={styles.courseText}>{course}</Text>
                  <CheckBox
                    value={selectedCourses[course]}
                    onValueChange={() => handleCheckboxChange(course)}
                  />
                </Pressable>
              ))}
            </>
          )}
          <View style={styles.termsContainer}>
            <CheckBox
              value={termsAccepted}
              onValueChange={setTermsAccepted}
            />
            <Text style={styles.termsText}>I have read and accept the terms and conditions.</Text>
            <Pressable
              style={styles.termsButton}
              onPress={() => Alert.alert('Terms and Conditions', 'Terms and conditions content goes here.')}
            >
              <Text style={styles.termsButtonText}>Read Terms & Conditions</Text>
            </Pressable>
          </View>
          <TouchableOpacity
            style={[styles.button, isSubmitDisabled && styles.disabledButton]}
            onPress={handleNext}
            disabled={isSubmitDisabled}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002b36',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#003366', // Darker blue background for form
    padding: 20,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    color: '#ffffff', // White text for labels
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffffff', // White border
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
    backgroundColor: '#002b36', // Dark input background
    color: '#ffffff', // White text
  },
  error: {
    color: '#ff6f6f', // Error text color
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  checkboxText: {
    color: '#ffffff', // White text
    marginLeft: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ffffff', // White border
    borderRadius: 4,
    marginBottom: 16,
    color: '#ffffff', // White text
    backgroundColor: '#003366', // Darker background
  },
  courseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff', // White border for course list
  },
  courseText: {
    fontSize: 16,
    color: '#ffffff', // White text for courses
  },
  button: {
    backgroundColor: '#00509e', // Interactive button color
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff', // White text for button
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#004080', // Darker button when disabled
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  termsText: {
    fontSize: 14,
    color: '#ffffff', // White text
    marginLeft: 8,
    flex: 1,
  },
  termsButton: {
    marginLeft: 8,
    backgroundColor: '#004080',
    padding: 8,
    borderRadius: 4,
  },
  termsButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default TutorSignUpPage;
