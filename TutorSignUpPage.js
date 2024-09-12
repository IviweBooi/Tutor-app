import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, SafeAreaView, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker'; 
import CheckBox from 'expo-checkbox'; 
import { useNavigation } from '@react-navigation/native'; 
import { db } from './firebase'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

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
    const cellphoneRegex = /^0[0-9]{9}$/; // Ensures 10 digits starting with 0
    if (!cellphoneRegex.test(value)) {
      setCellphoneError('Cellphone number must start with 0 and be exactly 10 digits.');
    } else {
      setCellphoneError('');
    }
  };

  // Function to handle form submission
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

    // Prepare data to save to Firebase
    const tutorData = {
      firstName: name,
      lastName,
      cellphone,
      levelOfStudy: level,
      studyYear: level === 'Postgraduate' ? 'N/A' : studyYear,
      major: Object.keys(major).filter(key => major[key]),
      courses: selectedCoursesList,
      availability: 'available', // Add availability field
    };

    // Add tier field for postgraduate tutors
    if (level === 'Postgraduate') {
      tutorData.tier = 3;
    }

    try {
      // Save to Firestore (tutors collection)
      await addDoc(collection(db, 'tutors'), tutorData);
      Alert.alert('Success', 'Tutor information saved successfully');
      navigation.navigate('TutorHomePage');
    } catch (error) {
      Alert.alert('Error', `Failed to save tutor data: ${error.message}`);
    }
  };

  useEffect(() => {
    const selectedCoursesList = Object.keys(selectedCourses).filter(course => selectedCourses[course]);
    const isFormComplete = name && lastName && cellphone && !cellphoneError && level && (level === 'Postgraduate' || studyYear) && selectedCoursesList.length > 0;
    setIsSubmitDisabled(!isFormComplete);
  }, [name, lastName, cellphone, cellphoneError, level, studyYear, selectedCourses]);

  useEffect(() => {
    updateCourses(studyYear, major);
  }, [studyYear, major]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Tutor Details</Text>

          <Text style={styles.label}>First Name</Text>
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

          <Text style={styles.label}>Cellphone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your cellphone number"
            keyboardType="phone-pad"
            value={cellphone}
            onChangeText={(value) => {
              setCellphone(value);
              validateCellphone(value);
            }}
          />
          {cellphoneError ? <Text style={styles.errorText}>{cellphoneError}</Text> : null}

          <Text style={styles.label}>Level of Study</Text>
          <Picker
            selectedValue={level}
            style={styles.picker}
            onValueChange={handleLevelChange}
          >
            <Picker.Item label="Select..." value="" />
            <Picker.Item label="Undergraduate" value="Undergraduate" />
            <Picker.Item label="Postgraduate" value="Postgraduate" />
          </Picker>

          {level === 'Undergraduate' && (
            <Picker
              selectedValue={studyYear}
              style={styles.picker}
              onValueChange={handleYearChange}
            >
              <Picker.Item label="Select Year..." value="" />
              <Picker.Item label="2nd Year" value="2nd" />
              <Picker.Item label="3rd Year" value="3rd" />
            </Picker>
          )}

          <Text style={styles.label}>Tutoring Major</Text>
          <TouchableOpacity onPress={() => handleMajorChange('ComputerScience')} style={styles.courseItem}>
            <CheckBox value={major.ComputerScience} />
            <Text style={styles.courseText}>Computer Science</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMajorChange('InformationSystems')} style={styles.courseItem}>
            <CheckBox value={major.InformationSystems} />
            <Text style={styles.courseText}>Information Systems</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Courses Available for Tutoring</Text>
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
            <Text style={styles.noCoursesText}>Select a year and major to see courses</Text>
          )}

          <Pressable
            style={[styles.nextButton, isSubmitDisabled && styles.disabledButton]}
            onPress={handleNext}
            disabled={isSubmitDisabled}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontSize: 24,
    color: '#1029AF',
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#10294F',  
    marginBottom: 10,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
    width: '100%',
    marginBottom: 20,
    borderColor: '#CCCCCC',
    borderWidth: 1,
  },
  picker: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#F0F0F0', 
    borderRadius: 10, 
    color: '#0066B0',
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC', 
  },
  courseText: {
    fontSize: 16,
    marginLeft: 10,
  },
  noCoursesText: {
    color: '#A0A0A0',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#FF6600',
    borderRadius: 8,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
});

export default TutorSignUpPage;
