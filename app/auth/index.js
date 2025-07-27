// app/index.js
import { router, Stack } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Button, Image, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebaseConfig.js';
import { useUser } from './user_context';

export default function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { setUserProfile } = useUser();

	const handleLogin = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			console.log('User logged in:', userCredential.user);
			if (!userCredential.user.emailVerified) {
				alert('Please verify your email before logging in.');
				return;
			}
		}
		catch (error) {
			console.error('Login failed:', error);
			alert('Login failed. Please check your credentials and try again.');
			return;
		}
		const user = auth.currentUser;
		if (!user) {
			console.log('❌ User not found after login.');
			alert('User not found. Please try logging in again.');
			return;
		}
		try {
			const docRef = doc(db, 'employees', user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const profile = docSnap.data();
				setUserProfile({ uid: user.uid, ...profile });
				console.log('✅ User profile set:', profile);
			} else {
				console.error('❌ No profile found in Firestore for this user.');
			}

			router.replace('/(tabs)/orders/ordersList');
		} catch (error) {
			console.error('🔥 Firestore fetch failed:', error);
			alert('Something went wrong while loading your profile.');
		}
	};

	return (
		<>
			<Stack.Screen options={{ headerShown: false, animation: 'fade_from_bottom', animationDuration: 500, gestureEnabled: true, gestureDirection: 'vertical', gestureResponseDistance: { vertical: 100 }, title: 'Login', headerStyle: { backgroundColor: '#121212' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }} />
			<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
				<View style={{ position: 'relative', top: -150 }}>
					<Image
						source={require('../../assets/images/WindowWarriors.png')}
						style={{ width: 200, height: 200, marginBottom: 20 }}
					/>
					<View>
						<Text style={{ color: 'white', marginBottom: 5 }}>{"Email"}</Text>
						<TextInput
							style={{ borderWidth: 1, width: 200, height: 35, color: 'white', borderColor: 'white', marginBottom: 10, paddingLeft: 5 }}
							placeholder="Email"
							placeholderTextColor="gray"
							value={email}
							onChangeText={setEmail} />
						<Text style={{ color: 'white', marginBottom: 5 }}>{"Password"}</Text>
						<TextInput
							style={{ borderWidth: 1, width: 200, height: 35, marginBottom: 30, color: 'white', paddingLeft: 5, borderColor: 'white' }}
							secureTextEntry
							placeholder="Password"
							placeholderTextColor="gray"
							value={password}
							onChangeText={setPassword} />
					</View>
					<Button title="Log In" onPress={handleLogin} />
					<Button title="Sign Up" onPress={() => router.push('/auth/sign_up')} />
				</View>
			</SafeAreaView>
		</>
	);
}