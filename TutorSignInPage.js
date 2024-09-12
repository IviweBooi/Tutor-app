import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, Pressable, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase'; // Import Firebase auth from your firebase.js

const TutorSignInPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign In Function
  const handleSignIn = () => {
    const validEmailDomain = "@myuct.ac.za";

    if (!email.endsWith(validEmailDomain)) {
      Alert.alert('Error', 'Please use your UCT tutor email ending with @myuct.ac.za');
      return;
    }

    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Tutor signed in:', user);

        // Pass email to TutorPage
        navigation.navigate("TutorHomePage");
      })
      .catch((error) => {
        console.error('Sign-in error:', error.code, error.message);
        Alert.alert('Error', 'Failed to sign in. Please try again.');
      });
  };

  // Sign Up Function
  const handleSignUp = () => {
    const validEmailDomain = "@myuct.ac.za";

    if (!email.endsWith(validEmailDomain)) {
      Alert.alert('Error', 'Please use your UCT tutor email ending with @myuct.ac.za');
      return;
    }

    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters long');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Tutor signed up:', user);

        // Navigate to TutorPage after successful sign-up
        navigation.navigate("TutorSignUpPage", { email: email });
      })
      .catch((error) => {
        console.error('Sign-up error:', error.code, error.message);
        Alert.alert('Error', 'Failed to sign up. Please try again.');
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            style={styles.uctLogo}
            resizeMode="cover"
            source={require("./assets/uct-logo.png")}
          />
          
          <Text style={styles.signInTitle}>Tutor Portal</Text>
          <TextInput
            style={styles.input}
            placeholder="UCT Tutor Email"
            placeholderTextColor="#A0A0A0"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          {/* Sign In Button */}
          <Pressable style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>

          {/* Sign Up Button */}
          <Pressable style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0044CC' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  container: { paddingHorizontal: 16, alignItems: 'center' },
  uctLogo: { width: 106, height: 106, marginVertical: 20 },
  signInTitle: { fontSize: 36, color: '#FFFFFF', marginVertical: 20 },
  input: { backgroundColor: '#333', borderRadius: 10, padding: 16, fontSize: 14, color: '#FFFFFF', marginBottom: 12, borderColor: '#555', borderWidth: 1 },
  signInButton: { backgroundColor: '#FF6600', borderRadius: 10, padding: 15, width: '100%', alignItems: 'center', marginTop: 20 },
  signInButtonText: { fontSize: 18, color: '#FFFFFF' },
  signUpButton: { backgroundColor: '#00CC44', borderRadius: 10, padding: 15, width: '100%', alignItems: 'center', marginTop: 20 },
  signUpButtonText: { fontSize: 18, color: '#FFFFFF' }
});

export default TutorSignInPage;
