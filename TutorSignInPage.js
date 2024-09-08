import * as React from "react";
import { StyleSheet, View, Image, Text, Pressable, SafeAreaView, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TutorSignInPage = () => {
  const navigation = useNavigation();

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
          <Text style={styles.signInTitle}>Sign In</Text>
          <Text style={styles.signInSubtitle}>
            Sign in with your UCT email and Password.
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="UCT Student Email"
              placeholderTextColor="#A0A0A0" 
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A0A0A0" 
              secureTextEntry
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
          <Pressable
            style={styles.signInButton}
            onPress={() => navigation.navigate("TutorHomePage")}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
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
    fontFamily: 'System',
    fontWeight: '600',
    marginVertical: 20,
  },
  signInSubtitle: {
    fontSize: 14, 
    color: '#D3D3D3',
    fontFamily: 'System', 
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
    fontFamily: 'System',
  },
  forgotPassword: {
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#B0B0B0', 
    fontFamily: 'System',
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
    fontFamily: 'System',
  },
});

export default TutorSignInPage;
