import { router } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth, db } from '../../../firebaseConfig.js';

export default function OrderDetailScreen() {

	const [customerFirstName, setCustomerFirstName] = useState('');
	const [customerLastName, setCustomerLastName] = useState('');
	const [customerPhone, setCustomerPhone] = useState('');
	const [customerEmail, setCustomerEmail] = useState('');
	const [cleaningAddress, setCleaningAddress] = useState('');
	const [cleaningZipCode, setCleaningZipCode] = useState('');
	const [cleaningCity, setCleaningCity] = useState('');

	const [cleaningType, setCleaningType] = useState('');
	const [open, setOpen] = useState(false);
	const [cleaningOptions, setCleaningOptions] = useState([
		{ label: 'Outdoor Window Cleaning', value: 'OutdoorWindow' },
		{ label: 'Window Screen Cleaning', value: 'WindowScreen' },
		{ label: 'House Siding Cleaning', value: 'HouseSiding' },]);

	const [whosCleaning, setWhosCLeaning] = useState(['']);
	const [cleaningNotes, setCleaningNotes] = useState('');
	const [cleaningPrice, setCleaningPrice] = useState('');

	const [pickerVisible, setPickerVisible] = useState(false);
	const [pickerMode, setPickerMode] = useState('date');
	const [date, setDate] = useState(new Date());

	const user = auth.currentUser;

	const handleAddCustomer = async () => {
		if (customerFirstName.trim() === '') {
			alert('Please enter a customer first name.');
			return;
		}
		if (customerLastName.trim() === '') {
			alert('Please enter a customer last name.');
			return;
		}
		if (customerPhone.trim() === '') {
			alert('Please enter a customer phone number.');
			return;
		}
		if (customerEmail.trim() === '') {
			alert('Please enter a customer email.');
			return;
		}
		if (cleaningAddress.trim() === '') {
			alert('Please enter a cleaning address.');
			return;
		}
		if (cleaningZipCode.trim() === '') {
			alert('Please enter a cleaning zip code.');
			return;
		}
		if (cleaningCity.trim() === '') {
			alert('Please enter a cleaning city.');
			return;
		}
		if (cleaningType.trim() === '') {
			alert('Please select a cleaning type.');
			return;
		}
		if (date === null) {
			alert('Please select a date and time.');
			return;
		}

		const customId = Date.now().toString();

		const sellerName = await fetchEmployee();

		if (!sellerName) {
			alert('Failed to fetch employee data. Please try again.');
			return;
		}

		try {
			await setDoc(doc(db, 'orders', customId), {
				CustomerFirstName: customerFirstName,
				CustomerLastName: customerLastName,
				StreetAddress: cleaningAddress,
				CleaningZipCode: cleaningZipCode,
				CleaningCity: cleaningCity,
				ServiceType: cleaningType,
				Notes: cleaningNotes,
				Price: cleaningPrice,
				TimeOfService: date,
				PhoneNumber: customerPhone,
				Email: customerEmail,
				Status: "Pending",
				Seller: user.uid,
				SellerName: sellerName,
				DateCreated: new Date(),
			});
			setCustomerFirstName('');
			setCustomerLastName('');
			setCleaningAddress('');
			setCleaningZipCode('');
			setCleaningCity('');
			setCleaningType('');
			setCleaningNotes('');
			setCleaningPrice('');
			setDate(new Date());
			router.back();
		} catch (error) {
			console.error('Error adding order:', error);
			alert('Failed to add order. Please try again.');
		}
	};
	const handlePriceChange = (text) => {
		const regex = /^\d*\.?\d{0,2}$/;
		if (regex.test(text)) {
			setCleaningPrice(text);
		}
	};
	const handlePriceBlur = () => {
		if (cleaningPrice === '') return;

		const num = parseFloat(cleaningPrice);
		if (!isNaN(num)) {
			setCleaningPrice(num.toFixed(2));
		}
	};

	const showDatePicker = () => {
		setPickerMode('date');
		setPickerVisible(true);
	};

	const showTimePicker = () => {
		setPickerMode('time');
		setPickerVisible(true);
	};

	const handleConfirm = (date) => {
		setDate(date);
		setPickerVisible(false);
	};

	const handleCancel = () => {
		setPickerVisible(false);
	};

	const fetchEmployee = async () => {
		try {
			const docRef = doc(db, 'employees', user.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const employee = docSnap.data();
				const fullname = (`${employee.FirstName || ''} ${employee.LastName || ''}`.trim());
				console.log('Employee data fetched successfully:', fullname);
				return fullname;
			} else {
				console.error('Employee data not found.');
				return null;
			}
		} catch (error) {
			console.error('Error fetching employee data:', error);
			alert('Failed to fetch employee data.');
			return null;
		}
	};

	return (

		<SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
			<KeyboardAwareScrollView
				style={{ flex: 1, backgroundColor: 'black' }}
				contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
				enableOnAndroid={true}
				keyboardShouldPersistTaps="handled"
				extraScrollHeight={100}
			>
				<Text style={{ fontSize: 24, color: 'white', alignSelf: 'center' }}>Add New Order</Text>
				<View style={{ padding: 20 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
						<View style={{ flexDirection: 'column', flex: 1, marginRight: 10 }}>
							<Text style={{ color: 'white', paddingBottom: 5, fontWeight: 'bold' }}>{"First Name"}</Text>
							<TextInput
								style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5, color: 'white' }}
								placeholder="First Name"
								placeholderTextColor="gray"
								value={customerFirstName}
								onChangeText={setCustomerFirstName}
								maxLength={20}

							/>
						</View>
						<View style={{ flexDirection: 'column', flex: 1, marginRight: 10 }}>
							<Text style={{ color: 'white', paddingBottom: 5, fontWeight: 'bold' }}>{"Last Name"}</Text>
							<TextInput
								style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5, color: 'white' }}
								placeholder="Last Name"
								placeholderTextColor="gray"
								value={customerLastName}
								onChangeText={setCustomerLastName}
								maxLength={25}
							/>
						</View>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
						<View style={{ flexDirection: 'column', flex: .5, marginRight: 10 }}>
							<Text style={{ color: 'white', paddingBottom: 5, fontWeight: 'bold' }}>{"Phone #"}</Text>
							<TextInput
								style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5, color: 'white' }}
								placeholder="1234567890"
								keyboardType="numeric"
								placeholderTextColor="gray"
								value={customerPhone}
								onChangeText={setCustomerPhone}
								maxLength={20}

							/>
						</View>
						<View style={{ flexDirection: 'column', flex: 1, marginRight: 10 }}>
							<Text style={{ color: 'white', paddingBottom: 5, fontWeight: 'bold' }}>{"Email"}</Text>
							<TextInput
								style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5, color: 'white' }}
								placeholder="example@something.com"
								placeholderTextColor="gray"
								value={customerEmail}
								onChangeText={setCustomerEmail}
								maxLength={25}
							/>
						</View>
					</View>
					<Text style={{ color: 'white', paddingBottom: 5, fontWeight: 'bold' }}>{"Street Address"}</Text>
					<TextInput
						style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5, color: 'white' }}
						placeholder="117 Mill Street"
						placeholderTextColor="gray"
						value={cleaningAddress}
						onChangeText={setCleaningAddress}
					/>
					<View style={{ flexDirection: 'row', marginBottom: 20 }}>
						<View>
							<Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 10 }}>{"Zip Code"}</Text>
							<TextInput
								style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5, color: 'white' }}
								placeholder="12345"
								keyboardType="numeric"
								placeholderTextColor="gray"
								value={cleaningZipCode}
								onChangeText={setCleaningZipCode}
							/>
						</View>
						<View style={{ marginLeft: 20 }}>
							<Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 10 }}>{"City"}</Text>
							<TextInput
								style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5, color: 'white' }}
								placeholder="Napervegas"
								placeholderTextColor="gray"
								value={cleaningCity}
								onChangeText={setCleaningCity}
							/>
						</View>
					</View>

					<Text style={{ color: 'white', paddingBottom: 5, fontWeight: 'bold' }}>{"Service Type"}</Text>
					<DropDownPicker
						open={open}
						value={cleaningType}
						items={cleaningOptions}
						setOpen={setOpen}
						setValue={setCleaningType}
						setItems={setCleaningOptions}
						listMode='SCROLLVIEW'
						placeholder="Select Cleaning Type"
						style={{ backgroundColor: '#333', borderColor: '#666' }}
						textStyle={{
							color: 'white',
						}}
						dropDownContainerStyle={{
							backgroundColor: '#444',
						}}
					/>
					<Text style={{ color: 'white', paddingBottom: 5, marginTop: 20, fontWeight: 'bold' }}>{"Notes"}</Text>
					<TextInput
						style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5, color: 'white' }}
						placeholder="Notes"
						placeholderTextColor="gray"
						value={cleaningNotes}
						onChangeText={setCleaningNotes}
						maxLength={20}

					/>
					<Text style={{ color: 'white', paddingBottom: 5, marginTop: 12, fontWeight: 'bold' }}>{"Price"}</Text>
					<View style={{ flexDirection: 'row' }}>
						<Text style={{ color: 'white', fontSize: 16, marginTop: 10, fontWeight: 'bold' }}>$</Text>
						<TextInput
							style={{ height: 40, width: 104, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 5, color: 'white', alignItems: 'center' }}
							placeholder="Price"
							keyboardType="numeric"
							placeholderTextColor="gray"
							value={cleaningPrice}
							onChangeText={handlePriceChange}
							onBlur={handlePriceBlur}
							maxLength={20}

							returnKeyType='done'
						/>
					</View>

				</View>

				<View style={styles.date}>
					<Button title="Date" onPress={() => showDatePicker('date')} />
					<Text>{"   "}</Text>
					<Button title="Time" onPress={() => showTimePicker('time')} />
					<DateTimePickerModal
						isVisible={pickerVisible}
						mode={pickerMode}
						date={date}
						onConfirm={handleConfirm}
						onCancel={handleCancel}
						is24Hour={true}
					/>
				</View>
				<Text style={{ color: 'white', paddingLeft: 20 }}>{date.toLocaleString()}</Text>
				<View style={{ padding: 20 }}>
					<Button
						title="Add Order"
						onPress={handleAddCustomer}
					/>
				</View>
			</KeyboardAwareScrollView >
		</SafeAreaView>

	);
}

const styles = {
	date: {
		fontSize: 16,
		textAlign: 'flex-start',
		flexDirection: 'row',
		padding: 12,
		color: 'white',
	},
};