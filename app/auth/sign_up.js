
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Button, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { auth, db } from '../../firebaseConfig';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function SignUpScreen() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [zipCode, setZipCode] = useState(null);
	const [state, setState] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password1, setPassword1] = useState('');

	const [open, setOpen] = useState(false);
	const [role, setRole] = useState('')
	const [roleOptions, setRoleOptions] = useState([
		{ label: 'Cleaner', value: 'Cleaner' },
		{ label: 'Salesman', value: 'Salesman' },
		{ label: 'Chuck_Nasty', value: 'Chuck_Nasty' },
	]);

	const [showVerificationMessage, setShowVerificationMessage] = useState(false);

	const register = async () => {
		if (!email || !password || !firstName || !lastName || !phoneNumber || !address || !city || !zipCode || !state) {
			console.error('Email and password are required for registration.');
			return;
		}
		if (password.length < 6) {
			console.error('Password must be at least 6 characters.');
			return;
		}
		if (password !== password1) {
			console.error('Passwords do not match.');
			return;
		}
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			await setDoc(doc(db, 'employees', user.uid), {
				FirstName: firstName,
				LastName: lastName,
				PhoneNumber: phoneNumber,
				Address: address,
				City: city,
				ZipCode: zipCode,
				State: state,
				Email: email,
				Role: role,
			});

			console.log('User signed up:', user);
			await sendEmailVerification(user);
			setShowVerificationMessage(true);
			await sleep(5000);
			router.push('/auth');
			await auth.signOut();
		} catch (error) {
			console.error('Signup error:', error.message);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: 'black' }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
			<FlatList
				data={['form']} // dummy single item
				keyExtractor={(item, index) => index.toString()}
				renderItem={() => (
					<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ color: 'white' }}>Sign Up</Text>
						<Text style={{ color: 'white', marginBottom: 40 }}>Please fill in the details below:</Text>
						<View style={{ gap: 8, marginBottom: 20 }}>
							<View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
								<View style={{ flexDirection: 'column', gap: 10 }}>
									<Text style={{ color: 'white' }}>First Name:</Text>
									<TextInput
										style={{ borderWidth: 1, width: 200, height: 30, marginBottom: 10, color: 'white', borderBottomColor: 'red', borderWidth: 1 }}
										placeholder="First Name"
										placeholderTextColor="gray"
										value={firstName}
										onChangeText={setFirstName}
									/>
								</View>
								<View style={{ flexDirection: 'column', gap: 10 }}>
									<Text style={{ color: 'white' }}>Last Name:</Text>

									<TextInput
										style={{ borderWidth: 1, width: 200, height: 30, marginBottom: 10, color: 'white', borderBottomColor: 'red', borderWidth: 1 }}
										placeholder="Last Name"
										placeholderTextColor="gray"
										value={lastName}
										onChangeText={setLastName}
									/>
								</View>

							</View>
							<View style={{ flexDirection: 'column', gap: 10, marginBottom: 20 }}>
								<Text style={{ color: 'white' }}>Phone Number:</Text>
								<TextInput
									style={{ borderWidth: 1, width: 200, height: 30, marginBottom: 10, color: 'white', borderBottomColor: 'red', borderWidth: 1 }}
									placeholder="Phone Number"
									keyboardType='phone-pad'
									placeholderTextColor="gray"
									value={phoneNumber}
									onChangeText={setPhoneNumber}
								/>
							</View>
							<View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
								<View style={{ flexDirection: 'column', gap: 10 }}>
									<Text style={{ color: 'white' }}>Full Address:</Text>
									<TextInput
										style={{ borderWidth: 1, width: 200, height: 30, marginBottom: 10, color: 'white', borderBottomColor: 'red', borderWidth: 1 }}
										placeholder="Address"
										placeholderTextColor="gray"
										value={address}
										onChangeText={setAddress}
									/>
								</View>
								<View style={{ flexDirection: 'column', gap: 10 }}>
									<Text style={{ color: 'white' }}>City:</Text>
									<TextInput
										style={{ borderWidth: 1, width: 200, height: 30, marginBottom: 10, color: 'white', borderBottomColor: 'red', borderWidth: 1 }}
										placeholder="City"
										placeholderTextColor="gray"
										value={city}
										onChangeText={setCity}
									/>
								</View>
							</View>
							<View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
								<View style={{ flexDirection: 'column', gap: 10 }}>
									<Text style={{ color: 'white' }}>Zip Code:</Text>
									<TextInput
										style={{ borderWidth: 1, width: 200, height: 30, marginBottom: 10, color: 'white', borderBottomColor: 'red', borderWidth: 1 }}
										placeholder="Zip COde"
										placeholderTextColor="gray"
										keyboardType='numeric'
										value={zipCode}
										onChangeText={setZipCode}
									/>
								</View>
								<View style={{ flexDirection: 'column', gap: 10 }}>
									<Text style={{ color: 'white' }}>State:</Text>
									<TextInput
										style={{ borderWidth: 1, width: 200, height: 30, marginBottom: 10, color: 'white', borderBottomColor: 'red', borderWidth: 1 }}
										placeholder="State"
										placeholderTextColor="gray"
										value={state}
										onChangeText={setState}
									/>
								</View>
							</View>
							<View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
								<View style={{ flexDirection: 'column', gap: 10 }}>
									<Text style={{ color: 'white' }}>Email:</Text>
									<TextInput
										style={{ borderWidth: 1, width: 200, height: 30, marginBottom: 10, color: 'white', borderBottomColor: 'red', borderWidth: 1 }}
										placeholder="Email"
										placeholderTextColor="gray"
										value={email}
										onChangeText={setEmail}
									/>
									<View style={{ marginTop: 50, padding: 5 }}>
										<Text style={{ color: 'white' }}>Role:</Text>
									</View>
								</View>

								<View style={{ flexDirection: 'column', gap: 10 }}>
									<Text style={{ color: 'white' }}>Password:</Text>
									<TextInput
										style={{ borderWidth: 1, width: 200, height: 30, marginBottom: 10, color: 'white', borderBottomColor: 'red', borderWidth: 1 }}
										placeholder="Password"
										placeholderTextColor="gray"
										secureTextEntry
										value={password}
										onChangeText={setPassword}
									/>
									<Text style={{ color: 'white' }}>Confirm Password:</Text>

									<TextInput
										style={{ borderWidth: 1, width: 200, height: 30, marginBottom: 10, color: 'white', borderBottomColor: 'red', borderWidth: 1 }}
										placeholder="Password"
										placeholderTextColor="gray"
										secureTextEntry
										value={password1}
										onChangeText={setPassword1}
										onBlur={() => {
											if (password !== password1) {
												console.error('Passwords do not match.');
											}
										}}
									/>
								</View>
							</View>
							<View style={{ marginTop: -20 }}>
								<DropDownPicker
									open={open}
									value={role}
									items={roleOptions}
									setOpen={setOpen}
									setValue={setRole}
									setItems={setRoleOptions}
									listMode='SCROLLVIEW'
									placeholder='Select a Role'
									style={{ backgroundColor: '#333', borderColor: '#666' }}
									textStyle={{
										color: 'white',
									}}
									dropDownContainerStyle={{
										backgroundColor: '#444',
									}}
								/>
							</View>
						</View>
						<Button title="Sign Up" onPress={register} />

						{showVerificationMessage && (
							<Text style={{ color: 'yellow', marginTop: 10 }}>
								Please check your email to verify your account.
							</Text>
						)}
					</SafeAreaView>
				)}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
			/>
		</KeyboardAvoidingView>
	);
}