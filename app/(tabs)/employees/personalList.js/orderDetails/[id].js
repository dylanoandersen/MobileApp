import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, Text } from 'react-native';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, color: 'white' }}>Order ID: {id}</Text>
    </SafeAreaView>
  );
}
