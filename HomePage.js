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
import { db, auth } from './firebase'; // Import Firebase services
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firestore query functions

const { width } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState(null); // State to hold user details
  const [balance, setBalance] = useState(null); // State to hold balance
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for feedback

  // Fetch user details and balance from Firestore when the HomePage loads
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;  // Get the current logged-in user
        if (!user) {
          // If no user, redirect to login screen
          navigation.navigate('LoginPage');
          return;
        }

        const email = user.email;  // Get the user's email
        if (email) {
          // Query Firestore for a document where the email field matches the user's email
          const studentsRef = collection(db, 'students');
          const q = query(studentsRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              setUserDetails(userData);

              // Set the balance if it exists in the document
              if (userData.balance) {
                setBalance(userData.balance);
              } else {
                setBalance(0); // Default balance to 0 if not found
              }
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

    fetchUserDetails();  // Call the function to fetch user details
  }, []);

  const handleRequestTutor = () => {
    navigation.navigate('RequestOptions');
  };

  const handleNotificationsClick = () => {
    navigation.navigate('Notifications');
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNotificationsClick} style={styles.iconContainer}>
          <Ionicons name="notifications-outline" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Image
          source={require('./assets/uct-logo.png')}
          style={styles.logo}
        />
        {/* Balance Button */}
        <TouchableOpacity style={styles.balanceButton}>
          <Text style={styles.balanceText}>Balance: R{balance}</Text>
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
  balanceButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333333',
  },
  coursesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseButton: {
    backgroundColor: '#E8F1FF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  courseText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A90E2',
  },
  sessionButton: {
    backgroundColor: '#FFEFE8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sessionText: {
    fontSize: 16,
    color: '#FF7F50',
  },
  requestButton: {
    backgroundColor: '#E8FFE8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestText: {
    fontSize: 16,
    color: '#32CD32',
  },
  tutorCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginRight: 15,
    width: width * 0.6,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  tutorTier: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  footerIcon: {
    flex: 1,
    alignItems: 'center',
  },
  addButtonContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default HomePage; //2
