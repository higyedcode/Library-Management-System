import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { useEntityContext } from '../context/TripContextDb';
import { useEntityContext } from '../context/TripContextServer';
import { Book } from '../models/Entity';
import { Route } from 'expo-router';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  HomeScreen: undefined;
  CreateScreen: undefined;
  UpdateScreen: {
    trip: Book,
    onSave: (updateEntity: Book) => void
  };
};

type UpdateScreenProps = StackScreenProps<RootStackParamList, 'UpdateScreen'>

const UpdateScreen: React.FC<UpdateScreenProps> = ({ route, navigation }) => {
  const { updateEntity } = useEntityContext();
  const { trip } = route.params;
  const [name, setName] = useState(trip.name);
  const [type, settype] = useState(trip.type);
  const [calories, setcalories] = useState(trip.calories);
  const [date, setdate] = useState(new Date(trip.date));
  const [notes, setnotes] = useState(trip.notes);
  const [showdatePicker, setShowdatePicker] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = () => {
    if (!name || !type || !notes) {
      Alert.alert('Validation Error', 'Please fill out all fields.');
      return;
    }

    const updatedTrip: Book = { ...trip, name, type,  calories: calories, date: formatDate(date), notes };
    updateEntity(updatedTrip);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>type</Text>
      <TextInput style={styles.input} value={type} onChangeText={settype} />
      <Text>Calories</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric" // Ensures the numeric keyboard is shown
              value={calories.toString()}
              onChangeText={(text) => setcalories(parseInt(text, 10))}
              placeholder="Enter a number"
            />      
      <Text>Date</Text>
      <TouchableOpacity onPress={() => setShowdatePicker(true)}>
        <TextInput style={styles.input} value={formatDate(date)} editable={false} />
      </TouchableOpacity>
      {showdatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowdatePicker(false);
            if (date) setdate(date);
          }}
        />
      )}
      <Text>notes</Text>
      <TextInput style={styles.input} value={notes} onChangeText={setnotes} multiline />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,    
  },
});

export default UpdateScreen;