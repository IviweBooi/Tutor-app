import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, SafeAreaView, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker'; 
import { useNavigation, useRoute } from "@react-navigation/native";
import CheckBox from 'expo-checkbox'; 
import { FontSize, Border } from './GlobalStyles'; 
import { db } from './firebase'; 
import { collection, addDoc } from 'firebase/firestore'; 

const InformationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || ''; 

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [faculty, setFaculty] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);

  const allCourses = {
    ComputerScience: {
      1: ['CSC1015F', 'CSC1016S'],
      2: ['CSC2001F', 'CSC2002S', 'CSC2004Z'],
      3: ['CSC3002F', 'CSC3003S'],
    },
    InformationSystems: {
      1: ['INF1002F', 'INF1003F', 'INF1102S'],
      2: ['INF2004F', 'INF2006F', 'INF2011S'],
      3: ['INF3003W', 'INF3014F', 'INF3012S'],
    }
  };

  useEffect(() => {
    const isFormComplete = name && lastName && affiliation && faculty && degree && year && courses.length > 0;
    const isAnyCourseSelected = Object.values(selectedCourses).includes(true);
    setIsContinueDisabled(!(isFormComplete && isAnyCourseSelected));
  }, [name, lastName, affiliation, faculty, degree, year, selectedCourses]);

  const handleDegreeChange = (selectedDegree) => {
    setDegree(selectedDegree);
    setCourses([]); 
    setYear(''); 
    setSelectedCourses({}); 
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);

    if (degree && allCourses[degree] && allCourses[degree][selectedYear]) {
      setCourses(allCourses[degree][selectedYear] || []);
      
      const initialSelectedCourses = {};
      allCourses[degree][selectedYear].forEach((course) => {
        initialSelectedCourses[course] = false; 
      });
      setSelectedCourses(initialSelectedCourses);
    } else {
      setCourses([]);
      setSelectedCourses({});
    }
  };

  const handleCheckboxChange = (course) => {
    setSelectedCourses(prevState => ({
      ...prevState,
      [course]: !prevState[course], 
    }));
  };

  const handleNext = async () => {
    if (!name || !lastName || !affiliation || !faculty || !degree || !year || courses.length === 0) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    const selectedCoursesList = Object.keys(selectedCourses).filter(course => selectedCourses[course]);

    if (selectedCoursesList.length === 0) {
      Alert.alert('Error', 'Please select at least one course.');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        email: email,
        name,
        lastName,
        affiliation,
        faculty,
        degree,
        year,
        courses: selectedCoursesList,
        balance: 100, // Add balance field set to 100
      });

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
          <Text style={styles.title}>Student Details</Text>

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

          <Text style={styles.label}>Affiliation</Text>
          <Picker
            selectedValue={affiliation}
            style={[styles.picker, affiliation !== '' && styles.pickerSelected]}
            onValueChange={setAffiliation}
          >
            <Picker.Item label="Select..." value="" />
            <Picker.Item label="Undergraduate" value="undergraduate" />
            
          </Picker>

          <Text style={styles.label}>Faculty</Text>
          <Picker
            selectedValue={faculty}
            style={[styles.picker, faculty !== '' && styles.pickerSelected]}
            onValueChange={setFaculty}
          >
            <Picker.Item label="Select..." value="" />
            <Picker.Item label="Science" value="science" />
            <Picker.Item label="Commerce" value="commerce" />
          </Picker>

          <Text style={styles.label}>Degree</Text>
          <Picker
            selectedValue={degree}
            style={[styles.picker, degree !== '' && styles.pickerSelected]}
            onValueChange={handleDegreeChange}
          >
            <Picker.Item label="Select..." value="" />
            <Picker.Item label="Computer Science" value="ComputerScience" />
            <Picker.Item label="Information Systems" value="InformationSystems" />
          </Picker>

          <Text style={styles.label}>Year</Text>
          <Picker
            selectedValue={year}
            style={[styles.picker, year !== '' && styles.pickerSelected]}
            onValueChange={handleYearChange}
          >
            <Picker.Item label="Select..." value="" />
            <Picker.Item label="1st" value="1" />
            <Picker.Item label="2nd" value="2" />
            <Picker.Item label="3rd" value="3" />
          </Picker>

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
            <Text style={styles.noCoursesText}>Select a degree and year to see courses</Text>
          )}

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
    fontSize: FontSize.size_6xl,
    color: '#1029AF',
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    fontSize: FontSize.size_md,
    color: '#10294F',  
    marginBottom: 10,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: Border.br_3xs,
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
    color: '#0066B0', 
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#F0F0F0', 
    borderRadius: 10, 
  },
  pickerSelected: {
    borderColor: 'blue',  
    backgroundColor: '#F0F0F0',  
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
    borderRadius: Border.br_3xs,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default InformationPage;
