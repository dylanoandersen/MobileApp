import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Item } from './ordersList';

import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig.js';


export default function OrderCalendar() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snatshot = await getDocs(collection(db, 'orders'));
        const datas = snatshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(datas);
        const markedDatesT = {};
        datas.forEach((data) => {
          const timestamp = data.TimeOfService;
          if (!timestamp?.toDate) return;
          const dateObj = timestamp.toDate();
          const formattedDate = dateObj.toISOString().split('T')[0];
          if (!markedDatesT[formattedDate]) {
            markedDatesT[formattedDate] = { marked: true, dots: [{ color: 'blue' }] };
          }
        });
        setMarkedDates(markedDatesT);
      }
      catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [])

  const handleDayPress = (day) => {
    const clickedDate = day.dateString;
    setSelectedDay(clickedDate);

    const filtered = orders.filter((o) => {
      const orderDate = o.TimeOfService?.toDate?.().toISOString().split('T')[0];
      return orderDate === clickedDate;
    });

    setSelectedOrders(filtered);
  };

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onPress={() => {
          router.push(`/(tabs)/orders/${item.id}`);
        }}>
      </Item>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Calendar
          markedDates={markedDates}
          markingType={'multi-dot'}
          onDayPress={handleDayPress}
        />

        {selectedDay && (
          <View style={{ flex: 1 }}>
            <FlatList
              data={selectedOrders}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 100, backgroundColor: '#f0f0f0' }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
