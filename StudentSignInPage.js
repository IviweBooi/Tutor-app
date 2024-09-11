import * as React from "react";
import { StyleSheet, View, Image, Text, Pressable, SafeAreaView, TextInput, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase'; // Import Firebase auth from firebase.js file
import { useState } from 'react';

const StudentSignInPage = () => {
  const navigation = useNavigation();

  // State for email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle sign in
  const handleSignIn = () => {
    const validEmailDomain = "@myuct.ac.za";
    if (!email.endsWith(validEmailDomain)) {
      Alert.alert('Error', 'Please use your UCT email ending with @myuct.ac.za');
      return;
    }
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User signed in:', user);
        navigation.navigate("HomePage");
      })
      .catch((error) => {
        console.error('Sign-in error:', error.code, error.message); // Log the detailed error for debugging
        
        // Handle specific sign-in errors
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'Invalid email format.');
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'Invalid email or password.');
        } else if (error.code === 'auth/too-many-requests') {
          Alert.alert('Error', 'Too many unsuccessful attempts. Please try again later.');
        } else {
          Alert.alert('Error', 'Something went wrong, please try again.');
        }
      });
  };

  // Function to handle sign up
  const handleSignUp = () => {
    const validEmailDomain = "@myuct.ac.za";
    if (!email.endsWith(validEmailDomain)) {
      Alert.alert('Error', 'Please use your UCT email ending with @myuct.ac.za');
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
        console.log('User signed up:', user);
        Alert.alert('Success', 'Account created successfully! Please sign in.');
        navigation.navigate("InformationPage", { email: email });
      })
      .catch((error) => {
        console.error('Sign-up error:', error.code, error.message);
        
        // Handle specific sign-up errors
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'The email address is already in use.');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'Invalid email format.');
        } else {
          Alert.alert('Error', 'Something went wrong, please try again.');
        }
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
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.navigate("WelcomePage")}
          > 
            <Image
              style={styles.vectorIcon}
              resizeMode="cover"
              source={require("./assets/vector.png")}
            />
          </Pressable>
          
          <Text style={styles.signInTitle}>Student Portal</Text>
          <Text style={styles.signInSubtitle}>
            Sign in or Sign up with your UCT email and password.
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="UCT Student Email"
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
          </View>
          <Pressable style={styles.rememberMeContainer}>
            <Text style={styles.rememberMe}>Remember Me</Text>
          </Pressable>
          <Pressable
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </Pressable>

          {/* Sign In Button */}
          <Pressable
            style={styles.signInButton}
            onPress={handleSignIn}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>

          {/* Sign Up Button */}
          <Pressable
            style={styles.signUpButton}
            onPress={handleSignUp}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
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
  uctLogo: {
    width: 106,
    height: 106,
    marginVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  vectorIcon: {
    width: 11,
    height: 11,
  },
  signInTitle: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '600',
    marginVertical: 20,
  },
  signInSubtitle: {
    fontSize: 14,
    color: '#D3D3D3',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
    borderColor: '#555555',
    borderWidth: 1,
  },
  rememberMeContainer: {
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  rememberMe: {
    fontSize: 14,
    color: '#D3D3D3',
  },
  forgotPassword: {
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#0066B0',
  },
  signInButton: {
    backgroundColor: '#FF6600',
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  signInButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  signUpButton: {
    backgroundColor: '#00CC44',
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default StudentSignInPage;
