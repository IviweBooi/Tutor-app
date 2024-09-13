//import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './HomePage';
import ImmediateRequestPage from './ImmediateRequestPage';
import ScheduledRequestPage from './ScheduledRequestPage';
import RequestOptionsPage from './RequestOptionsPage';
import WalletPage from './WalletPage';
import ReviewPage from './ReviewPage';
import SearchingScreen from './SearchingScreen';
import TutorFoundScreen from './TutorFoundScreen';
import StudentSignInPage from './StudentSignInPage';
import TutorSignInPage from './TutorSignInPage';
import TutorSignUpPage from './TutorSignUpPage';
import WelcomePage from './WelcomePage';
import TutorHomePage from './TutorHomePage';
import TutorProfile from './TutorProfile';   
import TutorReviewPage from './TutorReviewPage';
import TutorJobConfirmationPage from './TutorJobConfirmationPage';
import InformationPage from './InformationPage';
import ForgotPassword from './ForgotPassword';
import StudentProfile from './StudentProfile';

import { auth} from './firebase';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import React, { useState, useEffect } from 'react';
AppRegistry.registerComponent(appName, () => App);


const Stack = createStackNavigator();

export default function App() {

  const [user, setUser] = React.useState(null);

  useEffect(() => {
    //Authentication Listner
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user){
        setUser(user); //User is signed in
      } else {
        setUser(null); //User is signed out
      }
    });
    return unsubscribe;

  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomePage">
        <Stack.Screen
          name="WelcomePage"
          component={WelcomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudentSignInPage"
          component={StudentSignInPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="TutorSignUpPage" 
        component={TutorSignUpPage} options={{ headerShown: false }} /> 
        <Stack.Screen name="InformationPage" 
        component={InformationPage} options={{ headerShown: false }} />
        <Stack.Screen
          name="TutorSignInPage"
          component={TutorSignInPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ImmediateRequestPage" component={ImmediateRequestPage} options={{ headerShown: false }}/>
        <Stack.Screen name="ScheduledRequestPage" component={ScheduledRequestPage} options={{ headerShown: false }}/>
        <Stack.Screen name="RequestOptions" component={RequestOptionsPage} options={{ headerShown: false }}/>
        <Stack.Screen name="WalletPage" component={WalletPage} options={{ headerShown: false }}/>
        <Stack.Screen name="ReviewPage" component={ReviewPage} options={{ headerShown: false }}/>
        <Stack.Screen name="TutorReviewPage" component={TutorReviewPage} options={{ headerShown: false }}/>
        <Stack.Screen name="SearchingScreen" component={SearchingScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="TutorJobConfirmationPage" component={TutorJobConfirmationPage} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="TutorFoundScreen" component={TutorFoundScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentProfile" component={StudentProfile} options={{ headerShown: false }}/>
        <Stack.Screen 
          name="TutorHomePage" 
          component={TutorHomePage} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TutorProfile" 
          component={TutorProfile} 
          options={{ title: 'Tutor Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
