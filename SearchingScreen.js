import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ActivityIndicator, Animated } from 'react-native';

const SearchingScreen = ({ navigation }) => {
  const [searching, setSearching] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulating the searching process
    setTimeout(() => {
      setSearching(false);
      navigation.navigate('TutorFoundScreen');
    }, 5000);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sit tight, help is on the way!</Text>
      <Animated.Image
        source={{ uri: 'https://www.news.uct.ac.za/images/userfiles/images/publications/campuslife/2023/01-01_About-UCT-and-CPT_00.jpg' }}
        style={[styles.image, { opacity: fadeAnim }]}
      />
      <Text style={styles.searchingText}>Searching...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
      <Button
        title="Cancel Request"
        onPress={() => navigation.goBack()}
        color="#d9534f"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 20,
  },
  searchingText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default SearchingScreen;
