// firebase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCkM0TakSFc4mbJoibwA_u10enQz7YKJyM",
    authDomain: "chucknasty26s.firebaseapp.com",
    projectId: "chucknasty26s",
    storageBucket: "chucknasty26s.firebasestorage.app",
    messagingSenderId: "1063359125039",
    appId: "1:1063359125039:web:9e555951773964a15bd8da"
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);