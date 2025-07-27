import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import { auth, db } from '../../../firebaseConfig.js';

export default function EmployeeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [eFirstName, setEFirstName] = useState('');
  const [eLastName, setELastName] = useState('');
  const [ePhone, setEPhone] = useState('');
  const [eEmail, setEEmail] = useState('');
  const [eAddress, setEAddress] = useState('');
  const [eCity, setECity] = useState('');
  const [eZipCode, setEZipCode] = useState('');
  const [eState, setEState] = useState('');
  const [eRole, setERole] = useState('');
  const [open, setOpen] = useState(false);
  const [roleOptions, setRoleOptions] = useState([
    { label: 'Cleaner', value: 'Cleaner' },
    { label: 'Salesman', value: 'Salesman' },
    { label: 'Chuck_Nasty', value: 'Chuck_Nasty' },
  ]);

  const [uid, setUid] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const fetchEmployeeDetails = async () => {
    try {
      const docRef = doc(db, 'employees', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const employee = docSnap.data();
        setEFirstName(employee.FirstName || '');
        setELastName(employee.LastName || '');
        setEPhone(employee.PhoneNumber || '');
        setEEmail(employee.Email || '');
        setEAddress(employee.Address || '');
        setECity(employee.City || '');
        setEZipCode(employee.ZipCode || '');
        setEState(employee.State || '');
        setERole(employee.Role || '');

      } else {
        alert('Employee data not found.');
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      alert('Failed to fetch employee data.');
    }
  };


  const handleSave = async () => {
    try {
      const docRef = doc(db, 'employees', id);
      await updateDoc(docRef, {
        FirstName: eFirstName,
        LastName: eLastName,
        PhoneNumber: ePhone,
        Address: eAddress,
        City: eCity,
        ZipCode: eZipCode,
        State: eState,
        Email: eEmail,
        Role: eRole,
      });
      console.log('Employee updated successfully.');
    } catch (error) {
      console.error('Update error:', error.message);
    }
  };

  const clearEmployeeFields = () => {
    setEFirstName('');
    setELastName('');
    setEPhone('');
    setEEmail('');
    setEAddress('');
    setECity('');
    setEZipCode('');
    setEState('');
    setERole('');
  };

  useEffect(() => {
    fetchEmployeeDetails();
    return () => clearEmployeeFields();
  }, [id]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUid(user.uid);
    } else {
      console.error('No user is currently logged in.');
    }
  }, []);

  const renderField = (label, value, setter, isLarge = false) => (
    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      {label !== '' && <Text style={styles.label}>{label}</Text>}
      {isEditing ? (
        <TextInput
          style={isLarge ? styles.inputLarge : styles.input}
          value={value}
          onChangeText={setter}
          placeholder={label}
          placeholderTextColor="gray"
        />
      ) : (
        <Text style={isLarge ? styles.Lvalue : styles.value}>{value}</Text>
      )}
    </View>
  );

  const renderFieldRole = (label, value, setter, isLarge = false) => (
    <SafeAreaView style={{ flexDirection: 'row', marginBottom: 10 }}>
      {label !== '' && <Text style={styles.label}>{label}</Text>}
      {isEditing ? (<DropDownPicker
        open={open}
        value={value}
        items={roleOptions}
        setOpen={setOpen}
        setValue={setter}
        setItems={setRoleOptions}
        listMode='SCROLLVIEW'
        style={{ backgroundColor: '#333', borderColor: '#666', width: 200, height: 30, minHeight: 30 }}
        textStyle={{
          color: 'white',
        }}
        dropDownContainerStyle={{
          backgroundColor: '#444',
          width: 200,
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ justifyContent: 'flex-end' }}>
            {id === uid && (<Button title={isEditing ? 'Save' : 'Edit'} onPress={() => {
              if (isEditing) {
                handleSave();
              }
              setIsEditing(!isEditing)
            }} />)}
          </View>
          <View>
            {eRole === "Salesman" && (<Button title='Sales!!!' onPress={() => router.push({ pathname: '/(tabs)/employees/personalList.js/[id]', params: { id } })}></Button>)}
            {eRole === "Cleaner" && (<Button title='Cleaned Houses!!!' onPress={() => router.push(`/employees/personalList/${id}`)}></Button>)}
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <View style={{ flexDirection: 'column', marginBottom: 30 }}>
            <View style={{ flex: 1, minWidth: 100, marginRight: 10 }}>
              {renderField('', eFirstName, setEFirstName, true)}
            </View>
            <View style={{ flex: 1, minWidth: 100 }}>
              {renderField('', eLastName, setELastName, true)}
            </View>
          </View>
          {renderField('Phone #:', ePhone, setEPhone)}
          {renderField('Email:', eEmail, setEEmail)}
          {renderField('Address:', eAddress, setEAddress)}
          {renderField('City:', eCity, setECity)}
          <View style={{ flexDirection: 'row', marginBottom: 15 }}>
            <View style={{ flex: 1 }}>
              {renderField('State:', eState, setEState)}
            </View>
            <View style={{ width: 10 }} />
            <View style={{ flex: 1 }}>
              {renderField('Zip Code:', eZipCode, setEZipCode)}
            </View>
          </View>
          {renderFieldRole('Role:', eRole, setERole)}
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