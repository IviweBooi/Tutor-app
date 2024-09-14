import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const { width } = Dimensions.get('window');

const TutorHomePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const tutorId = route.params?.tutorId;
  const [sessions, setSessions] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [tutorCourses, setTutorCourses] = useState([]);
  const [tutorName, setTutorName] = useState('');

  useEffect(() => {
    if (tutorId) {
      const fetchTutorData = async () => {
        try {
          const tutorDocRef = doc(db, 'tutors', tutorId);
          const tutorDoc = await getDoc(tutorDocRef);

          if (tutorDoc.exists()) {
            const tutorData = tutorDoc.data();
            setTutorCourses(tutorData.courses || []);
            setTutorName(tutorData.firstName || 'Tutor');
          } else {
            console.log('No such tutor!');
          }
        } catch (error) {
          console.error('Error fetching tutor data: ', error);
        }
      };

      fetchTutorData();
    }
  }, [tutorId]);

  useEffect(() => {
    if (tutorCourses.length > 0) {
      const sessionsRef = collection(db, 'IRequestSessions');
      const q = query(
        sessionsRef,
        where('course', 'in', tutorCourses),
        where('status', '==', 'pending')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const sessionList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSessions(sessionList);
      });

      return () => unsubscribe();
    }
  }, [tutorCourses]);

  useEffect(() => {
    if (tutorCourses.length > 0) {
      const scheduledRef = collection(db, 'ScheduledSessions');
      const q = query(
        scheduledRef,
        where('course', 'in', tutorCourses),
        where('tutorId', '==', tutorId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const scheduledList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setScheduledSessions(scheduledList);
      });

      return () => unsubscribe();
    }
  }, [tutorCourses, tutorId]);

  const handleJobAccept = (jobId) => {
    navigation.navigate('TutorJobConfirmationPage');
    console.log(`Job ${jobId} accepted!`);
  };

  const handleJobDecline = (jobId) => {
    console.log(`Job ${jobId} declined!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome5 name="wallet" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.welcomeText}>Welcome, {tutorName}!</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>“Empowering through knowledge and compassion.”</Text>
        </View>
        
        <ScrollView contentContainerStyle={styles.contentContainer}>
      
          <View style={styles.welcomeContainer}>
            <Text style={styles.subtitle}>Your journey to impact starts here.</Text>
          </View>
        
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Live Lesson Jobs</Text>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <Animated.View key={session.id} style={styles.jobCard}>
                  <View style={styles.jobHeader}>
                    <Text style={styles.jobTitle}>{session.course}</Text>
                    <Text style={styles.jobDetails}>Requested at: {new Date(session.timestamp.seconds * 1000).toLocaleString()}</Text>
                  </View>
                  <View style={styles.jobBody}>
                    <Text style={styles.jobDetails}>
                      {session.duration} hours {session.sessionType === 'in-person' ? 'in person' : 'online'}
                    </Text>
                    <Text style={styles.jobDetails}>Tier {session.tier} - R{session.price}</Text>
                  </View>
                  <View style={styles.jobActions}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleJobAccept(session.id)}
                    >
                      <Ionicons name="thumbs-up" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={() => handleJobDecline(session.id)}
                    >
                      <Ionicons name="close" size={24} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))
            ) : (
              <Text style={styles.noJobsText}>No live sessions available!</Text>
            )}
          </View>

          {/* Scheduled Lessons Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Scheduled Lessons</Text>
            {scheduledSessions.length > 0 ? (
              scheduledSessions.map((session) => (
                <Animated.View key={session.id} style={styles.scheduledCard}>
                  <Text style={styles.jobTitle}>{session.course}</Text>
                  <Text style={styles.jobDetails}>
                    Scheduled for: {new Date(session.date.seconds * 1000).toLocaleDateString()} at {new Date(session.time.seconds * 1000).toLocaleTimeString()}
                  </Text>
                  <Text style={styles.jobDetails}>Tier {session.tier} - R{session.price}</Text>
                </Animated.View>
              ))
            ) : (
              <Text style={styles.noJobsText}>No scheduled lessons at the moment.</Text>
            )}
          </View>

          {/* Tutor Tier Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>My Rank</Text>
            <View style={styles.tierContainer}>
              <Text style={styles.tierText}>Tier 3</Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={28} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Messages')}>
            <Ionicons name="chatbubbles" size={28} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButtonContainer}
            onPress={() => console.log('Add Lesson')}
          >
            <Ionicons name="add" size={36} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person" size={28} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Wallet')}>
            <FontAwesome5 name="wallet" size={28} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  quoteContainer: {
    backgroundColor: '#E1E9F2',
    paddingVertical: 15,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#4A90E2',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 15,
  },
  welcomeContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  scheduledCard: {
    backgroundColor: '#E8F4F8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  jobHeader: {
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  jobDetails: {
    fontSize: 14,
    color: '#555555',
    marginTop: 5,
  },
  jobBody: {
    marginBottom: 10,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    backgroundColor: '#E94F4F',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  noJobsText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    paddingVertical: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#dddddd',
    elevation: 5,
  },
  footerButton: {
    paddingHorizontal: 20,
  },
  addButtonContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    position: 'absolute',
    bottom: 10,
    right: width / 2 - 30,
  },
  tierContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  tierText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  iconButton: {
    padding: 10,
  },
});

export default TutorHomePage;
