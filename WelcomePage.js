import * as React from "react";
import { StyleSheet, View, Text, Pressable, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Border, FontSize } from "./GlobalStyles";

const WelcomePage = () => {
  const navigation = useNavigation();

  const handleStudentPress = () => {
    navigation.navigate("StudentSignInPage");
  };

  const handleTutorPress = () => {
    navigation.navigate("TutorSignInPage");
  };

  return (
    <ImageBackground
      style={styles.background}
      resizeMode="cover"
      source={require("./assets/bckwelcome.png")}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to TuTor!</Text>
        <Text style={styles.subtitle}>Unlock Your Learning Potential</Text>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleStudentPress}>
            <Text style={styles.buttonText}>Student</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleTutorPress}>
            <Text style={styles.buttonText}>Tutor</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark overlay
  },
  content: {
    zIndex: 1, // Ensure the content appears above the overlay
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  welcomeText: {
    fontSize: FontSize.size_6xl,
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSize.size_lg,
    color: "#FFFFFF",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Adjusted for equal spacing
    width: "100%", // Full width for proper spacing
  },
  button: {
    backgroundColor: "#10294f",
    borderRadius: Border.br_3xs,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: FontSize.size_sm,
    fontWeight: "500",
  },
});

export default WelcomePage;
