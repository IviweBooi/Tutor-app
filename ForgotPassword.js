import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase'; 
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = () => {
    if (email === '') {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Success', 'A password reset link has been sent to your email.');
        navigation.navigate('StudentSignInPage');
      })
      .catch((error) => {
        console.error('Error sending reset email:', error.message);

        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('Error', 'The email address is invalid.');
            break;
          case 'auth/user-not-found':
            Alert.alert('Error', 'No account found with this email.');
            break;
          default:
            Alert.alert('Error', 'Something went wrong. Please try again.');
            break;
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your UCT email"
        placeholderTextColor="#A0A0A0"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <Pressable style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetButtonText}>Send Reset Email</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0044CC',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 20,
    borderColor: '#555555',
    borderWidth: 1,
  },
  resetButton: {
    backgroundColor: '#FF6600',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default ForgotPassword;
