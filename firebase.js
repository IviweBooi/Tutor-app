import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDP_cJL-Job1Zpdhkxmu91ZAlVvfDY_jJc",
  authDomain: "mytutorapp-4ba6e.firebaseapp.com",
  projectId: "mytutorapp-4ba6e",
  storageBucket: "mytutorapp-4ba6e.appspot.com",
  messagingSenderId: "885586601950",
  appId: "1:885586601950:web:db22a8826f84bc19725f4f"
};
  //Initialize Firebase

  const app = initializeApp(firebaseConfig);

  //Initialize Firebase services
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),

  });

  const db = getFirestore(app);

  export {auth, db};
  