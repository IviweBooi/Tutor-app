import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from './firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          
          navigation.navigate('StudentSignInPage');
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
  }, []);

  const handleRequestTutor = () => {
    navigation.navigate('RequestOptions');
  };

  const handleNotificationsClick = () => {
    navigation.navigate('StudentProfile');
  };

  const handleEwalletClick = () => {
    navigation.navigate('WalletPage');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Processing...</Text>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNotificationsClick} style={styles.iconContainer}>
          <Ionicons name="notifications-outline" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Image
          source={require('./assets/uct-logo.png')}
          style={styles.logo}
        />
        
        <TouchableOpacity onPress={handleEwalletClick} style={styles.iconContainer}>
          <Ionicons name="wallet-outline" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, {userDetails.name}!</Text>
          <Text style={styles.subtitle}>Your learning journey awaits.</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Courses</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.coursesContainer}>
              {userDetails.courses?.length > 0 ? (
                userDetails.courses.map((course, index) => (
                  <View key={index} style={styles.courseButton}>
                    <Text style={styles.courseText}>{course}</Text>
                  </View>
                ))
              ) : (
                <Text>No courses available</Text>
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
          <TouchableOpacity style={styles.sessionButton}>
            <Text style={styles.sessionText}>No upcoming sessions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tutoring Requests</Text>
          <TouchableOpacity style={styles.requestButton}>
            <Text style={styles.requestText}>No pending requests.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Tutors</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tutorCard}>
              <Image
                style={styles.tutorImage}
                source={require('./assets/wiseman.jpeg')}
              />
              <Text style={styles.tutorName}>Mnelisi Mabuza</Text>
              <Text style={styles.tutorTier}>3rd Tier</Text>
              <View style={styles.ratingContainer}>
                {Array(5)
                  .fill()
                  .map((_, index) => (
                    <Ionicons
                      key={index}
                      name="star"
                      size={14}
                      color="orange"
                    />
                  ))}
              </View>
            </View>
            <View style={styles.tutorCard}>
              <Image
                style={styles.tutorImage}
                source={require('./assets/maria.jpeg')}
              />
              <Text style={styles.tutorName}>Kruppa Prag</Text>
              <Text style={styles.tutorTier}>3rd Tier</Text>
              <View style={styles.ratingContainer}>
                {Array(5)
                  .fill()
                  .map((_, index) => (
                    <Ionicons
                      key={index}
                      name="star"
                      size={14}
                      color="orange"
                    />
                  ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerIcon}>
          <Ionicons name="home-outline" size={30} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon}>
          <Ionicons name="chatbubbles-outline" size={30} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={handleRequestTutor}
        >
          <Ionicons name="add-outline" size={36} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon}>
          <Ionicons name="calendar-outline" size={30} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon} onPress={handleNotificationsClick}>
          <Ionicons name="person-outline" size={30} color="#4A90E2" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4A90E2',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
  iconContainer: {
    padding: 10,
  },
  contentContainer: {
    paddingBottom: 80, 
  },
  welcomeContainer: {
    backgroundColor: '#4A90E2',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 5,
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  coursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  courseButton: {
    backgroundColor: '#E5F0FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  courseText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  sessionButton: {
    backgroundColor: '#FFF0E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  sessionText: {
    color: '#E55542',
    fontWeight: 'bold',
  },
  requestButton: {
    backgroundColor: '#E5F0FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  requestText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  tutorCard: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    width: width * 0.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tutorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  tutorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tutorTier: {
    fontSize: 14,
    color: '#4A90E2',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerIcon: {
    paddingHorizontal: 10,
  },
  addButtonContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
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
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomePage;
