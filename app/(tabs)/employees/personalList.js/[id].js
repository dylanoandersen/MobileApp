import { ThemedText } from '@/components/ThemedText';
import { Button } from '@react-navigation/elements';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Checkbox } from 'react-native-paper';
import { db } from '../../../../firebaseConfig.js';

const screenHeight = Dimensions.get('window').height;

const Item = ({ item, onPress }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [
    styles.itemContainer,
    { opacity: pressed ? 0.7 : 1 }
  ]}>
    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
      {item.CustomerFirstName} {item.CustomerLastName}
    </Text>
    <Text>{item.id}</Text>
  </Pressable>
);


function FilterOptions({
  completed, setCompleted,
  pending, setPending,
  cancelled, setCancelled,
  outdoor, setOutdoor,
  screen, setScreen,
  house, setHouse,
  date, setDate
}) {

  const [open, setOpen] = useState(false);
  const [dateOptions, setDateOptions] = useState([
    { label: 'Ascending', value: 'ascending' },
    { label: 'Descending', value: 'descending' },
  ]);

  return (
    <SafeAreaView style={styles.filterContainer}>
      <View>
        <ThemedText style={{ color: 'black' }} type="subtitle">{"Filter Options"}</ThemedText>
        <View style={{ marginBottom: 15, marginTop: 15 }}>
          <Text style={{ color: 'black', paddingBottom: 5, fontWeight: 'bold' }}>{"Date"}</Text>
          <DropDownPicker
            open={open}
            value={date}
            items={dateOptions}
            setOpen={setOpen}
            setValue={setDate}
            setItems={setDateOptions}
            style={{ backgroundColor: '#333', borderColor: '#666' }}
            textStyle={{
              color: 'white',
            }}
            dropDownContainerStyle={{
              backgroundColor: '#444',
            }}
          />
        </View>

        <Text style={{ color: 'black', paddingBottom: 5, fontWeight: 'bold' }}>{"Status"}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 9 }}>
              <Checkbox
                status={completed ? 'checked' : 'unchecked'}
                onPress={() => setCompleted(!completed)}
                color="black"
              />
            </View>
            <Text style={{ color: 'black', marginLeft: 8 }}>Completed</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 9 }}>
              <Checkbox
                status={pending ? 'checked' : 'unchecked'}
                onPress={() => setPending(!pending)}
                color="black"
              />
            </View>
            <Text style={{ color: 'black', marginLeft: 8 }}>Pending</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 9 }}>
              <Checkbox
                status={cancelled ? 'checked' : 'unchecked'}
                onPress={() => setCancelled(!cancelled)}
                color="black"
              />
            </View>
            <Text style={{ color: 'black', marginLeft: 8 }}>Cancelled</Text>
          </View>
        </View>
        <Text style={{ color: 'black', paddingBottom: 5, fontWeight: 'bold' }}>{"Service Type"}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 9 }}>
              <Checkbox
                status={outdoor ? 'checked' : 'unchecked'}
                onPress={() => setOutdoor(!outdoor)}
                color="black"
              />
            </View>
            <Text style={{ color: 'black', marginLeft: 8 }}>Outdoor Window</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 9 }}>
              <Checkbox
                status={screen ? 'checked' : 'unchecked'}
                onPress={() => setScreen(!screen)}
                color="black"
              />
            </View>
            <Text style={{ color: 'black', marginLeft: 8 }}>Window Screen</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 }}>
          <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 9 }}>
            <Checkbox
              status={house ? 'checked' : 'unchecked'}
              onPress={() => setHouse(!house)}
              color="black"
            />
          </View>
          <Text style={{ color: 'black', marginLeft: 8 }}>House Siding</Text>
        </View>
      </View>
      <View>
        <ThemedText style={{ color: 'black' }} type="subtitle">{"Included Persons"}</ThemedText>
      </View>
    </SafeAreaView>
  );
}

export default function EmployeeOrders() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);

  const [date, setDate] = useState('descending');
  const [completed, setCompleted] = useState(false);
  const [pending, setPending] = useState(true);
  const [cancelled, setCancelled] = useState(false);

  const [outdoor, setOutdoor] = useState(false);
  const [screen, setScreen] = useState(false);
  const [house, setHouse] = useState(false);
  const [selectedPersons, setSelectedPersons] = useState([]);

  const filteredOrders = employeeData.filter(order => {
    const statusFilters = [];
    if (completed) statusFilters.push('Completed');
    if (pending) statusFilters.push('Pending');
    if (cancelled) statusFilters.push('Cancelled');

    const typeFilters = [];
    if (outdoor) typeFilters.push('OutdoorWindow');
    if (screen) typeFilters.push('WindowScreen');
    if (house) typeFilters.push('HouseSiding');

    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(order.Status);
    const matchesType = typeFilters.length === 0 || typeFilters.includes(order.ServiceType);

    return matchesStatus && matchesType;
  });

  const fetchEmployees = async () => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('Seller', '==', id)  // Filter orders by creator ID
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEmployeeData(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };



  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEmployees(); // or whatever function you use to reload data
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          router.push(`/(tabs)/employees/personalList.js/orderDetails/${item.id}`);
        }}>
      </Item>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'grey' }}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={{ color: 'black', fontStyle: 'Bold' }}>
          Order Management
        </ThemedText>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 10 }}>
        <View style={styles.title}>
          <ThemedText type="subtitle">Search</ThemedText>
        </View>
        <View>
          <Button style={{ backgroundColor: 'white' }} onPress={() => { setShowFilters(true) }}>Filters</Button>
        </View>
      </View>
      <View style={{ flex: 1, position: 'relative' }}>
        <FlatList
          data={filteredOrders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          contentContainerStyle={{
            backgroundColor: 'grey',
            paddingBottom: 100,
          }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#9Bd35A', '#689F38']}
        />
        <>
          <Modal
            visible={showFilters}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowFilters(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowFilters(false)}
            >
              <Pressable style={styles.modalContent} onPress={() => { }}>
                <FilterOptions
                  completed={completed} setCompleted={setCompleted}
                  pending={pending} setPending={setPending}
                  cancelled={cancelled} setCancelled={setCancelled}
                  outdoor={outdoor} setOutdoor={setOutdoor}
                  screen={screen} setScreen={setScreen}
                  house={house} setHouse={setHouse}
                  date={date} setDate={setDate}
                />
                <Button onPress={() => setShowFilters(false)}>Close</Button>
              </Pressable>
            </Pressable>
          </Modal>
        </>
        <View
          style={{
            position: 'absolute',
            bottom: 60,
            right: 10,
            backgroundColor: 'transparent',
          }}
        >
          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/(tabs)/orders/new_order')}
          >
            <Text style={{ color: 'white', fontSize: 35, lineHeight: 37 }}>+</Text>
          </Pressable>
        </View>
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
    fontSize: 50,
    fontWeight: 'bold',
    marginVertical: 8,
    alignItems: 'center'
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
