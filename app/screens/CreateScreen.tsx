import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { useEntityContext } from '../context/TripContextDb';
import { useEntityContext } from '../context/TripContextServer';
import { Book } from '../models/Entity';
import { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  HomeScreen: undefined;
  CreateScreen: {
    onSave: (trip: Book) => void;
  };
  UpdateScreen: {
    trip: Book;
    onSave: (updatedTrip: Book) => void;
  };
};

type CreateScreenProps = StackScreenProps<RootStackParamList, 'CreateScreen'>


const CreateScreen: React.FC<CreateScreenProps> = ({ route, navigation }) => {
  const { addEntity } = useEntityContext();
  const [title, settitle] = useState('');
  const [author, setauthor] = useState('');
  const [genre, setGenre] = useState('');
  const [quantity, setquantity] = useState(0);
  // const [date, setdate] = useState(new Date());
  const [reserved, setreserved] = useState(0);  
  // const [showdatePicker, setShowdatePicker] = useState(false);

  // const formatDate = (date: Date) => {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // };

  const handleSave = () => {
    if (!title || !author || !reserved) {
      Alert.alert('Validation Error', 'Please fill out all fields.');
      return;
    }

    const newBook: Book = { id: Date.now(), title, author,genre , quantity, reserved };
    addEntity(newBook);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={settitle} />
      <Text>Author</Text>
      <TextInput style={styles.input} value={author} onChangeText={setauthor} />
      <Text>Genre</Text>
      <TextInput style={styles.input} value={genre} onChangeText={setGenre} />
      <Text>Quantity</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric" // Ensures the numeric keyboard is shown
        value={quantity.toString() == '0' ? '' : quantity.toString()}
        onChangeText={(text) => {
          if(text === '') {
          setquantity(0)
          }
          else {
          setquantity(parseInt(text, 10))
          }
        }
      }
        placeholder="Enter a number"
      />      
      <Text>Reserved</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric" // Ensures the numeric keyboard is shown
        value={reserved.toString() == '0' ? '' : reserved.toString()}
        onChangeText={(text) => {
          if(text === '') {
          setreserved(0)
          }
          else {
          setreserved(parseInt(text, 10))
          }
        }
      }
        placeholder="Enter a number"
      />      
      {/* <Text>Date</Text>
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
      )} */}
      {/* <Text>reserved</Text>
      <TextInput style={styles.input} value={reserved} onChangeText={setreserved} multiline /> */}
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

export default CreateScreen;