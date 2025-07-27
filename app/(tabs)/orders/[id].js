import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, Linking, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth, db } from '../../../firebaseConfig.js';
import { useUser } from '../../auth/user_context.js';


export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const { userProfile } = useUser();
  const [uid, setUid] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [eFirstName, setEFirstName] = useState('');
  const [eLastName, setELastName] = useState('');
  const [ePhone, setEPhone] = useState('');
  const [eEmail, setEEmail] = useState('');
  const [eAddress, setEAddress] = useState('');
  const [eCity, setECity] = useState('');
  const [eZipCode, setEZipCode] = useState('');
  const fullAddress = `${eAddress}, ${eCity}, ${eZipCode}`;

  const [serviceType, setServiceType] = useState('');
  const [open, setOpen] = useState(false);
  const [cleaningOptions, setCleaningOptions] = useState([
    { label: 'Outdoor Window Cleaning', value: 'OutdoorWindow' },
    { label: 'Window Screen Cleaning', value: 'WindowScreen' },
    { label: 'House Siding Cleaning', value: 'HouseSiding' },]);

  const [seller, setSeller] = useState('');
  const [status, setStatus] = useState('');
  const [timeOfService, setTimeOfService] = useState(new Date());
  const [dateCreated, setDateCreated] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [date, setDate] = useState(new Date());

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

  const fetchOrderDetails = async () => {
    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const order = docSnap.data();
        setEFirstName(order.CustomerFirstName || '');
        setELastName(order.CustomerLastName || '');
        setSeller(order.SellerName || '');
        setEPhone(order.PhoneNumber || '');
        setEEmail(order.Email || '');
        setEAddress(order.StreetAddress || '');
        setECity(order.CleaningCity || '');
        setEZipCode(order.CleaningZipCode || '');
        setServiceType(order.ServiceType || '');
        setStatus(order.Status || '');
        setTimeOfService(order.TimeOfService?.toDate() || new Date());
        setDateCreated(order.DateCreated?.toDate() || new Date());
        setNotes(order.Notes || '');
        setPrice(order.Price || '');

      } else {
        alert('order data not found.');
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
      alert('Failed to fetch order data.');
    }
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'orders', id);
      await updateDoc(docRef, {
        CustomerFirstName: eFirstName,
        CustomerLastName: eLastName,
        PhoneNumber: ePhone,
        StreetAddress: eAddress,
        CleaningCity: eCity,
        CleaningZipCode: eZipCode,
        Email: eEmail,
        ServiceType: serviceType,
        TimeOfService: timeOfService,
        Notes: notes,
        Price: price
      });
      console.log('order updated successfully.');
    } catch (error) {
      console.error('Update error:', error.message);
    }
  };

  const clearOrderFields = () => {
    setEFirstName('');
    setELastName('');
    setEPhone('');
    setEEmail('');
    setEAddress('');
    setECity('');
    setEZipCode('');
    setServiceType('');
    setSeller('');
    setStatus('');
    setTimeOfService('');
    setNotes('');
    setPrice('');
  };

  useEffect(() => {
    fetchOrderDetails();
    return () => clearOrderFields();
  }, [id]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUid(user.uid);
    } else {
      console.error('No user is currently logged in.');
    }
  }, []);

  const openInMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = Platform.select({
      ios: `http://maps.apple.com/?address=${encodedAddress}`,
      android: `geo:0,0?q=${encodedAddress}`,
    });

    Linking.openURL(url).catch((err) =>
      console.error('Failed to open maps:', err)
    );
  };

  const renderField = (label, value, setter, isLarge = false) => (
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      {label !== '' && <Text style={styles.label}>{label}</Text>}
      {isEditing ? (
        <TextInput
          style={isLarge ? styles.inputLarge : styles.input}
          value={value ?? ''}
          onChangeText={setter}
          placeholder={label}
          placeholderTextColor="gray"
        />
      ) : (
        <Text style={isLarge ? styles.Lvalue : styles.value}>{value}</Text>
      )}
    </View>
  );

  const renderFieldNum = (label, value, setter, isLarge = false) => (
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      {label !== '' && <Text style={styles.label}>{label}</Text>}
      {isEditing ? (
        <TextInput
          style={isLarge ? styles.inputLarge : styles.input}
          value={value ?? ''}
          keyboardType="numeric"
          onChangeText={setter}
          placeholder={label}
          placeholderTextColor="gray"
        />
      ) : (
        <Text style={isLarge ? styles.Lvalue : styles.value}>{value}</Text>
      )}
    </View>
  );

  const renderFieldDate = (label, value,) => (
    <>
      <View style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'center', flex: 1 }}>
        {label !== '' && <Text style={styles.label}>{label}</Text>}

        {isEditing ? (<View style={{ flexDirection: 'row', flex: 1 }}><Button title="Date" onPress={() => showDatePicker('date')} />
          <Text>{"   "}</Text>
          <Button title="Time" onPress={() => showTimePicker('time')} />
          <DateTimePickerModal
            isVisible={pickerVisible}
            mode={pickerMode}
            date={value}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            is24Hour={true}
          /></View>) : (
          null
        )}
        <Text style={{ color: 'white', paddingLeft: 20 }}>{value.toLocaleString()}</Text>
      </View>

    </>
  );

  const renderFieldService = (label, value, setter, isLarge = false) => (
    <SafeAreaView style={{ flexDirection: 'row', marginBottom: 10 }}>
      {label !== '' && <Text style={styles.label}>{label}</Text>}
      {isEditing ? (<DropDownPicker
        open={open}
        value={value}
        items={cleaningOptions}
        setOpen={setOpen}
        setValue={setter}
        setItems={setCleaningOptions}
        listMode='SCROLLVIEW'
        style={{ backgroundColor: '#333', borderColor: '#666', width: 250, height: 30, minHeight: 30 }}
        textStyle={{
          color: 'white',
        }}
        dropDownContainerStyle={{
          backgroundColor: '#444',
          width: 250,
        }}
      />) : <Text style={isLarge ? styles.Lvalue : styles.value}>{value}</Text>}
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black', padding: 20 }}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: 'black' }}
        contentContainerStyle={{ padding: 20 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100}
      >

        <View style={{ marginTop: 30 }}>
          <View style={{ justifyContent: 'flex-end' }}>
            {userProfile?.Role != 'Cleaner' && (<Button title={isEditing ? 'Save' : 'Edit'} onPress={() => {
              if (isEditing) {
                handleSave();
              }
              setIsEditing(!isEditing)
            }} />)}
          </View>
          <View style={{ flexDirection: 'column', marginBottom: 30 }}>
            <View style={{ flex: 1, minWidth: 100, marginRight: 10 }}>
              {renderField('', eFirstName, setEFirstName, true)}
            </View>
            <View style={{ flex: 1, minWidth: 100 }}>
              {renderField('', eLastName, setELastName, true)}
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={styles.label}>{"Seller: "}</Text>
            <Text style={styles.value}>{seller}</Text>
          </View>

          {renderField('Status:', status, setStatus)}
          {renderFieldDate('Time of Service:', timeOfService)}
          {renderFieldNum('Price:', price, setPrice)}
          {renderFieldNum('Phone #:', ePhone, setEPhone)}
          {renderField('Email:', eEmail, setEEmail)}
          {isEditing ? (
            <>
              {renderField('Address:', eAddress, setEAddress)}
              {renderField('City:', eCity, setECity)}
              {renderFieldNum('Zip Code:', eZipCode, setEZipCode)}
            </>
          ) : (
            <TouchableOpacity onPress={() => openInMaps(`${eAddress}, ${eCity}, ${eZipCode}`)}>
              <Text style={{ color: '#4DA6FF', textDecorationLine: 'underline' }}>
                {`${eAddress}, ${eCity}, ${eZipCode}`}
              </Text>
            </TouchableOpacity>
          )}
          {renderField('Order Created:', dateCreated.toLocaleString())}
          {renderField('Notes:', notes, setNotes)}
          {renderFieldService('Service:', serviceType, setServiceType)}
        </View>
      </KeyboardAwareScrollView >
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    color: 'white',
    width: 100,
  },
  Lvalue: {
    fontSize: 40,
    color: 'white',
    flex: 1,
  },
  value: {
    fontSize: 20,
    color: 'white',
    flexShrink: 1,
  },
  input: {
    fontSize: 20,
    color: 'white',
    borderBottomWidth: 1,
    borderColor: 'gray',
    flexShrink: 1,
  },
  inputLarge: {
    fontSize: 40,
    color: 'white',
    borderBottomWidth: 1,
    borderColor: 'gray',
    flex: 1,
  },
});
