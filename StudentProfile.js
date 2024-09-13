import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from './firebase'; 
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const StudentProfile = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [phone, setPhone] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigation.navigate('LoginPage');
          return;
        }

        const email = user.email;
        if (email) {
          const studentsRef = collection(db, 'students');
          const q = query(studentsRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setUserDetails(userData);
              setPhone(userData.phone || '');
              setCourseList(userData.courses || []);
            });
          } else {
            setError('User details not found.');
          }
        } else {
          setError('No email associated with the current user.');
        }
      } catch (error) {
        console.error('Error fetching user details: ', error);
        setError('Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigation]);

  const handleSavePhone = async () => {
    if (!phone) {
      Alert.alert('Input Error', 'Please enter a valid phone number.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const email = user.email;
        if (email) {
          const studentsRef = collection(db, 'students');
          const q = query(studentsRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, { phone });
            Alert.alert('Success', 'Phone number updated successfully.');
          }
        }
      }
    } catch (error) {
      console.error('Error updating phone number: ', error);
      Alert.alert('Error', 'Failed to update phone number.');
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse) {
      Alert.alert('Input Error', 'Please enter a course name.');
      return;
    }

    try {
      const updatedCourses = [...courseList, newCourse];
      const user = auth.currentUser;
      if (user) {
        const email = user.email;
        if (email) {
          const studentsRef = collection(db, 'students');
          const q = query(studentsRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, { courses: updatedCourses });
            setCourseList(updatedCourses);
            setNewCourse('');
            Alert.alert('Success', 'Course added successfully.');
          }
        }
      }
    } catch (error) {
      console.error('Error adding course: ', error);
      Alert.alert('Error', 'Failed to add course.');
    }
  };

  const handleRemoveCourse = async (courseToRemove) => {
    try {
      const updatedCourses = courseList.filter(course => course !== courseToRemove);
      const user = auth.currentUser;
      if (user) {
        const email = user.email;
        if (email) {
          const studentsRef = collection(db, 'students');
          const q = query(studentsRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, { courses: updatedCourses });
            setCourseList(updatedCourses);
            Alert.alert('Success', 'Course removed successfully.');
          }
        }
      }
    } catch (error) {
      console.error('Error removing course: ', error);
      Alert.alert('Error', 'Failed to remove course.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No user details found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#4A90E2" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.title}>Student Profile</Text>
          <Text style={styles.subtitle}>Welcome back, {userDetails.name}!</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSavePhone}
          >
            <Text style={styles.buttonText}>Save Phone Number</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Courses</Text>
          <View style={styles.coursesContainer}>
            {courseList.length > 0 ? (
              courseList.map((course, index) => (
                <View key={index} style={styles.courseItem}>
                  <Text style={styles.courseText}>{course}</Text>
                  <TouchableOpacity 
                    style={styles.removeCourseButton}
                    onPress={() => handleRemoveCourse(course)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#E55542" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>No courses added.</Text>
            )}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Add a new course"
            value={newCourse}
            onChangeText={setNewCourse}
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleAddCourse}
          >
            <Text style={styles.buttonText}>Add Course</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FF',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
  },
  contentContainer: {
    flexGrow: 1,
  },
  profileSection: {
    backgroundColor: '#4A90E2',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coursesContainer: {
    marginBottom: 15,
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  courseText: {
    fontSize: 16,
    color: '#333',
  },
  removeCourseButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default StudentProfile;
