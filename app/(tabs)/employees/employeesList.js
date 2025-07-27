import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { db } from '../../../firebaseConfig.js';

import { Button } from '@react-navigation/elements';

const router = useRouter();
const screenHeight = Dimensions.get('window').height;

const Item = ({ item, onPress }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [
    styles.itemContainer,
    { opacity: pressed ? 0.7 : 1 }
  ]}>
    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
      {item.FirstName} {item.LastName}
    </Text>
    <Text>{item.PhoneNumber}</Text>
  </Pressable>
);

export default function Employees() {
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [searchText, setSearchText] = useState('');

  const fetchEmployees = async () => {
    const snatshot = await getDocs(collection(db, 'employees'));
    const data = snatshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setEmployeeData(data);
  };

  const filteredEmployees = employeeData.filter(employee => {
    const matchesSearch =
      searchText.trim().length === 0 ||
      employee.id.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.FirstName.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.LastName.toLowerCase().includes(searchText.toLowerCase());

    return matchesSearch;
  });

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          router.push(`/(tabs)/employees/${item.id}`);
        }}>
      </Item>
    );
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'grey' }}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={{ color: 'black', fontStyle: 'Bold' }}>
          Employees
        </ThemedText>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 10 }}>
        <View style={styles.title}>
          <TextInput
            mode="outlined"
            placeholder="Search Employees "
            style={{ backgroundColor: 'white', width: '100%' }}
            onChangeText={setSearchText}
          ></TextInput>
        </View>
        <View>
          <Button style={{ backgroundColor: 'white' }} onPress={() => { setShowFilters(true) }}>Filters</Button>
        </View>
      </View>
      <View style={{ flex: 1, position: 'relative' }}>
        <FlatList
          data={filteredEmployees}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          contentContainerStyle={{
            backgroundColor: 'grey',
            paddingBottom: 100,
          }}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 10
  },
  title: {
    marginVertical: 8,
  },
  stepContainer: {
    gap: 1,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 2,
    marginHorizontal: 6,
    borderRadius: 5,
  },
  filterContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: screenHeight * 0.8,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 9
  },
  addButton: {
    color: 'black',
    backgroundColor: 'black',
    borderRadius: 15,
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 10,
    fontSize: 50,
  },
});
